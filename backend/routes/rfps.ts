import { Router } from "express";
import { postRfp, getRfps, patchRfp, postVendor } from "../controllers/rfps.js";

const router = Router();

// Create RFP
router.post("/", postRfp);
// Get all RFPs for session
router.get("/", getRfps);
// Patch RFP
router.patch("/:id", patchRfp);
// Add vendor to RFP
router.post("/:id/vendors", postVendor);

export default router;
