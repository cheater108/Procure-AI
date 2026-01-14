import { Router } from "express";
import Session from "../db/session.js";

const router = Router();

router.get("/", async (req: any, res: any) => {
    const sessionId = req.sessionId;
    const session = await Session.findOne({ sessionId });
    if (!session) {
        const newSession = new Session({ sessionId });
        await newSession.save();
    }
    res.json({ session: 'ok' });
});

export default router;
