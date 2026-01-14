import RFP from "../db/rfp.js";
import Session from "../db/session.js";
import { generateRfp } from "../agents/rfpAgent.js";

export const postRfp = async (req: any, res: any) => {
    try {
        const { query } = req.body;
        const sessionId = req.sessionId;

        // 1. Generate RFP content using Agent
        console.log(`[RFP Router] - Generating RFP content for query: ${query}`);
        const generatedContent = await generateRfp(query);

        // 2. Save to DB
        const rfp = new RFP({
            title: generatedContent.title,
            description: generatedContent.description,
            body: generatedContent.body,
            vendors: []
        });
        await rfp.save();

        // 3. Link to Session
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
        const session = await Session.findOne({ sessionId }).populate("rfps");
        
        if (!session) {
            return res.json({ rfps: [] });
        }

        res.json({ rfps: session.rfps });
    } catch (error) {
        console.error("[RFP Router] - Failed to fetch RFPs:", error);
        res.status(500).json({ error: "Failed to fetch RFPs" });
    }
}