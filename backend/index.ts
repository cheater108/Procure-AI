import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express()
app.use(cors());

app.get("/health", (req, res) => {
    res.json({ message: "ok" })
})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})