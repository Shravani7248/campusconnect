import rateLimit from "express-rate-limit";

/**
 * General authentication rate limiter
 * Limits general auth traffic to 100 requests per 15 minutes
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication requests from this IP. Please try again after 15 minutes.",
  },
});

/**
 * Strict limiter for sensitive OTP generation & resend endpoints
 * Prevents email spamming and abuse
 */
export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // max 15 OTP requests per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many OTP verification requests from this IP. Please wait 15 minutes before requesting again.",
  },
});

/**
 * Strict limiter for login endpoint
 * Mitigates credential stuffing and brute force attempts
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // max 20 login attempts per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts from this IP. Please wait 15 minutes before trying again.",
  },
});
