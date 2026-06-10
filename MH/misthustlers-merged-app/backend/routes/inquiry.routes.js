import { Router } from "express";
import { submitInquiry } from "../controllers/inquiry.controller.js";
import { validateInquiry, handleValidationErrors } from "../middleware/validate.middleware.js";

const router = Router();

router.post("/inquiry", validateInquiry, handleValidationErrors, submitInquiry);

export default router;
