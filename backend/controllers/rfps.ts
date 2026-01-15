import RFP from "../db/rfp.js";
import Session from "../db/session.js";
import Vendor from "../db/vendors.js";
import { generateRfp } from "../agents/rfpAgent.js";
import { searchVendors } from "../agents/searchAgent.js";
import mongoose from "mongoose";

export const postRfp = async (req: any, res: any) => {
    try {
        const { query } = req.body;
        const sessionId = req.sessionId;

        // 1. Generate RFP content using Agent
        console.log(`[RFP Router] - Generating RFP content for query: ${query}`);
        const generatedContent = await generateRfp(query);

        // 2. Search for Vendors using Search Agent
        console.log(`[RFP Router] - Searching for vendors for: ${query}`);
        let foundVendors: any[] = [];
        try {
            const searchResult = await searchVendors(query);
            if (searchResult && searchResult.vendors) {
                foundVendors = searchResult.vendors;
            }
        } catch (searchError) {
            console.error("[RFP Router] - Vendor search failed:", searchError);
        }

        // 3. Save RFP to DB
        const rfp = new RFP({
            title: generatedContent.title,
            description: generatedContent.description,
            body: generatedContent.body,
            vendors: []
        });
        await rfp.save();

        // 4. Create and Link Vendors
        if (foundVendors.length > 0) {
            const vendorDocs = await Promise.all(foundVendors.map(async (v: any) => {
                const vendor = new Vendor({
                    name: v.name,
                    email: v.email,
                    phone: v.phone,
                    rfpId: rfp._id,
                    status: "not_contacted"
                });
                return await vendor.save();
            }));
            
            rfp.vendors = vendorDocs.map(v => v._id) as any;
            await rfp.save();
            console.log(`[RFP Router] - Added ${vendorDocs.length} vendors to RFP`);
        }

        // 5. Link to Session
        let session = await Session.findOne({ sessionId });
        if (!session) {
            session = new Session({ sessionId, rfps: [] });
        }
        session.rfps.push(rfp._id as any);
        await session.save();

        res.status(201).json(rfp);
    } catch (error) {
        console.error("[RFP Router] - Failed to create RFP:", error);
        res.status(500).json({ error: "Failed to create RFP" });
    }
}

export const getRfps = async (req: any, res: any) => {
    try {
        const sessionId = req.sessionId;
        const session = await Session.findOne({ sessionId }).populate({
            path: "rfps",
            populate: {
                path: "vendors"
            }
        });
        
        if (!session) {
            return res.json({ rfps: [] });
        }

        res.json({ rfps: session.rfps });
    } catch (error) {
        console.error("[RFP Router] - Failed to fetch RFPs:", error);
        res.status(500).json({ error: "Failed to fetch RFPs" });
    }
};

export const patchRfp = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const rfp = await RFP.findByIdAndUpdate(id, updates, { new: true });
        
        if (!rfp) {
            return res.status(404).json({ error: "RFP not found" });
        }

        res.json(rfp);
    } catch (error) {
        console.error("[RFP Router] - Failed to update RFP:", error);
        res.status(500).json({ error: "Failed to update RFP" });
    }
};

export const postVendor = async (req: any, res: any) => {
    try {
        const { id } = req.params; 
        const { name, email, phone } = req.body;

        // 1. Create Vendor
        const vendor = new Vendor({
            name,
            email,
            phone,
            status: "not_contacted",
            rfpId: new mongoose.Types.ObjectId(id),
        });
        await vendor.save();

        // 2. Link to RFP
        const rfp = await RFP.findById(id);
        if (!rfp) {
            return res.status(404).json({ error: "RFP not found" });
        }
        
        rfp.vendors.push(vendor._id as any);
        await rfp.save();

        res.status(201).json(vendor);
    } catch (error) {
        console.error("[RFP Router] - Failed to add vendor:", error);
        res.status(500).json({ error: "Failed to add vendor" });
    }
};
