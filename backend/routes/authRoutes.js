import express from "express";
import {
  registerUser,
  verifyEmail,
  resendVerificationOTP,
  loginUser,
  getMe,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  googleAuth,
  googleAuthCallback,
  googleTokenAuth,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authLimiter, otpLimiter, loginLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

// Apply general rate limiting to all auth endpoints
router.use(authLimiter);

// Public Email/Password & OTP Endpoints
router.post("/register", registerUser);
router.post("/verify-email", verifyEmail);
router.post("/resend-otp", otpLimiter, resendVerificationOTP);
router.post("/login", loginLimiter, loginUser);
router.post("/forgot-password", otpLimiter, forgotPassword);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", resetPassword);

// Google OAuth 2.0 Endpoints
router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback);
router.post("/google/credential", googleTokenAuth);

// Protected Auth Endpoints
router.get("/me", protect, getMe);

export default router;