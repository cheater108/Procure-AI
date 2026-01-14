import { Router } from "express";
import { postRfp, getRfps } from "../controllers/rfps.js";

const router = Router();

// Create RFP
router.post("/", postRfp);
// Get all RFPs for session
router.get("/", getRfps);

export default router;
