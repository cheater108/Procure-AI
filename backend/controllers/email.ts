import Vendor from "../db/vendors.js";
import RFP from "../db/rfp.js";
import emailManager from "../managers/emailManager.js";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import { rankProposal } from "../agents/rankProposalAgent.js";
import { parseFile } from "../utils/fileParser.js";

export const sendEmails = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const { vendorIds, body, subject } = req.body;

        const vendors = await Vendor.find({ _id: { $in: vendorIds } });
        for (const vendor of vendors) {
            if (vendor.email) {
                await emailManager.sendEmail(vendor.email, body, subject, vendor._id.toHexString());
            }
        }

        // Update Vendor Status
        await Vendor.updateMany(
            { _id: { $in: vendorIds } },
            { $set: { status: "contacted", response: "" } }
        );

        // Update RFP Body
        const rfp = await RFP.findById(id);
        if (!rfp) {
            return res.status(404).json({ error: "RFP not found" });
        }
        rfp.body = body;
        await rfp.save();

        console.log(`[RFP Router] - Sending bulk emails for RFP ${id} to vendors: ${vendorIds}`);

        res.json({ message: "Emails sent successfully" });
    } catch (error) {
        console.error("[RFP Router] - Failed to send bulk emails:", error);
        res.status(500).json({ error: "Failed to send emails" });
    }
};

export const inboundEmail = async (req: any, res: any) => {
    try {
        const { from, subject, text, to } = req.body;
        const files = req.files as Express.Multer.File[];

        console.log(`[Email Controller] - Received inbound email from ${from} to ${to}`);

        // Extract vendorId from the 'to' field (e.g., procure-VENDORID@domain.com)
        const toAddress = Array.isArray(to) ? to[0] : to;
        const match = toAddress.match(/procure-([a-f\d]{24})/i);
        
        if (!match) {
            console.warn(`[Email Controller] - Could not find vendorId in to-address: ${toAddress}`);
            return res.status(200).send('OK');
        }

        const vendorId = match[1];
        const vendor = await Vendor.findById(vendorId);

        if (!vendor) {
            console.warn(`[Email Controller] - Vendor not found for ID: ${vendorId}`);
            return res.status(200).send('OK');
        }

        // 1. Save attachments and extract text
        const attachmentPaths: string[] = [];
        let extractedText = "";

        if (files && files.length > 0) {
            const uploadDir = path.join(process.cwd(), "uploads", "attachments");
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            for (const file of files) {
                const fileName = `${Date.now()}-${file.originalname}`;
                const filePath = path.join(uploadDir, fileName);
                fs.writeFileSync(filePath, file.buffer);
                attachmentPaths.push(`uploads/attachments/${fileName}`);
                
                // Parse text from file
                const textFromFile = await parseFile(file.buffer, file.originalname);
                extractedText += `\n--- Content from ${file.originalname} ---\n${textFromFile}\n`;
                
                console.log(`[Email Controller] - Saved and parsed attachment: ${fileName}`);
            }
        }

        // 2. Update Vendor status and response
        vendor.status = "responded";
        vendor.response = text || "";
        if (attachmentPaths.length > 0) {
            (vendor as any).attachments = [...((vendor as any).attachments || []), ...attachmentPaths];
        }
        await vendor.save();

        // 3. Automated Ranking
        rankRFP(vendor.rfpId, vendor, text, extractedText);

        res.status(200).send('OK');
    } catch (error) {
        console.error("[Email Controller] - Failed to receive inbound email:", error);
        res.status(500).json({ error: "Failed to receive email" });
    }
}

const rankRFP = async (rfpId: mongoose.Types.ObjectId | null | undefined, vendor: any, text: string, extractedText: string ) => {
  if (!rfpId) {
    console.error("[Email Controller] - No RFP ID provided");
    return;
  }
  const rfp = await RFP.findById(rfpId);
  if (rfp) {
    console.log(`[Email Controller] - Starting automated ranking for vendor ${vendor.name}`);
    const ratingPrompt = `
      RFP REQUIREMENTS:
      Title: ${rfp.title}
      Description: ${rfp.description}

      VENDOR PROPOSAL:
      Email Body: ${text || "No body text"}
      ${extractedText ? `\nAttachment Content: ${extractedText}` : "No Attachments"}
    `;

    try {
      const ranking = await rankProposal(ratingPrompt);
      if (ranking) {
        vendor.score = ranking.score;
        vendor.status = "responded";
        (vendor as any).suggestion = ranking.suggestion;
        await vendor.save();
        console.log(`[Email Controller] - Vendor ${vendor.name} ranked with score: ${ranking.score}`);
      }
    } catch (rankError) {
      console.error(`[Email Controller] - Failed to rank proposal for vendor ${vendor.name}:`, rankError);
    }
  }
}