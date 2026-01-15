import { Router } from "express";
import { sendEmails } from "../controllers/email.js";

const router = Router();

router.post("/send/:id", sendEmails);

export default router;
