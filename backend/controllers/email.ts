import Vendor from "../db/vendors.js";
import RFP from "../db/rfp.js";
import emailManager from "../managers/emailManager.js";

export const sendEmails = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const { vendorIds, body, subject } = req.body;

        const vendors = await Vendor.find({ _id: { $in: vendorIds } });
        for (const vendor of vendors) {
            if (vendor.email) {
                await emailManager.sendEmail(vendor.email, body, subject);
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