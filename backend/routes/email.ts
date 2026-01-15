import { Router } from "express";
import { sendEmails, inboundEmail } from "../controllers/email.js";
import multer from "multer";
const upload = multer();

const router = Router();

router.post("/send/:id", sendEmails);
router.post("/inbound", upload.any(), inboundEmail);

export default router;
