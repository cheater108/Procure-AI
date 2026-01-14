import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.json({rfps: []});
});

export default router;
