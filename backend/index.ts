import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sessionMiddleware } from "./middlewares.js";
import connectDB from "./db/db.js";
import sessionRouter from "./routes/session.js";
import rfpRouter from "./routes/rfps.js";
import emailRouter from "./routes/email.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({}));
app.use(express.json());
app.use(sessionMiddleware);

app.use("/api/session", sessionRouter);
app.use("/api/rfps", rfpRouter)
app.use("/api/email", emailRouter)

app.get("/health", (req, res) => {
    res.json({ message: "ok" });
});

// Create RFP

app.listen(PORT, async () => {
    await connectDB();
    console.log(`[Server] - Server started on port ${PORT}`);
});