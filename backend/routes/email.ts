import { Router } from "express";
import { sendEmails, inboundEmail } from "../controllers/email.js";
import multer from "multer";
const upload = multer();

const router = Router();

// Send Email to vendors
router.post("/send/:id", sendEmails);
// Inbound Email from SendGrid
router.post("/inbound", upload.any(), inboundEmail);

export default router;
