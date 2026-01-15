import { Router } from "express";
import { postRfp, getRfps, patchRfp, postVendor, sendEmails } from "../controllers/rfps.js";

const router = Router();

// Create RFP
router.post("/", postRfp);
// Get all RFPs for session
router.get("/", getRfps);
// Patch RFP
router.patch("/:id", patchRfp);
// Add vendor to RFP
router.post("/:id/vendors", postVendor);
// Send bulk emails
router.post("/:id/send-emails", sendEmails);

export default router;
