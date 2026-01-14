import { Router } from "express";
import { postRfp, getRfps, patchRfp } from "../controllers/rfps.js";

const router = Router();

// Create RFP
router.post("/", postRfp);
// Get all RFPs for session
router.get("/", getRfps);
// Patch RFP
router.patch("/:id", patchRfp);

export default router;
