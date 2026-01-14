import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sessionMiddleware } from "./middlewares.js";
import connectDB from "./db/db.js";
import sessionRouter from "./routes/session.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({}));
app.use(express.json());
app.use(sessionMiddleware);

// Initialize session store for RFPs if not exists
const getSessionRfps = (req: any) => {
    if (!req.session.rfps) {
        req.session.rfps = [];
    }
    return req.session.rfps;
};

app.use("/api/session", sessionRouter);

app.get("/health", (req, res) => {
    res.json({ message: "ok" });
});

// Create RFP
app.post("/api/rfps", (req, res) => {
    const { title, description } = req.body;
    const rfps = getSessionRfps(req);
    
    const newRfp = {
        id: crypto.randomUUID(),
        title,
        description,
        createdAt: new Date(),
        status: 'draft'
    };
    
    rfps.push(newRfp);
    res.status(201).json(newRfp);
});

// Get all RFPs for session
app.get("/api/rfps", (req, res) => {
    res.json({rfps: []});
});

app.listen(PORT, async () => {
    await connectDB();
    console.log(`[Server] - Server started on port ${PORT}`);
});