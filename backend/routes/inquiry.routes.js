import { Router } from "express";
import { submitInquiry, trackReferralClick } from "../controllers/inquiry.controller.js";
import { validateInquiry, handleValidationErrors } from "../middleware/validate.middleware.js";

const router = Router();

router.post("/inquiry", validateInquiry, handleValidationErrors, submitInquiry);
router.post("/referral-click", trackReferralClick);

export default router;
