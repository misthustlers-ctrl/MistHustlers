import { body, validationResult } from "express-validator";

export const validateInquiry = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ max: 200 }).withMessage("Name too long"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  body("phone")
    .trim()
    .notEmpty().withMessage("Phone is required")
    .isMobilePhone().withMessage("Invalid phone number"),

  body("company")
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 200 }).withMessage("Company name too long"),

  body("service")
    .trim()
    .notEmpty().withMessage("Service tier is required")
    .isIn(["starter", "growth", "premium"]).withMessage("Invalid service tier"),

  body("budget")
    .trim()
    .notEmpty().withMessage("Budget is required")
    .isIn(["less-than-5000", "5000-15000", "15000-50000", "above-50000", "not-sure"]).withMessage("Invalid budget range"),

  body("message")
    .trim()
    .notEmpty().withMessage("Message is required")
    .isLength({ max: 5000 }).withMessage("Message too long"),

  body("referralCode")
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 4, max: 32 }).withMessage("Invalid referral code")
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage("Invalid referral code"),
];

export const validateApplicant = [
  body("opportunityId")
    .optional({ nullable: true })
    .isInt({ min: 1 }).withMessage("Invalid opportunity"),

  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ max: 200 }).withMessage("Name too long"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  body("phone")
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 50 }).withMessage("Phone too long"),

  body("resumeUrl")
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isURL({ require_protocol: true }).withMessage("Portfolio link must be a valid URL"),

  body("coverLetter")
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 5000 }).withMessage("Message too long"),
];

export function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}
