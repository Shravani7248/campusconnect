import crypto from "crypto";

/**
 * Generate a 6-digit cryptographically secure numeric OTP
 * @returns {string} 6-digit OTP string (e.g. "481920")
 */
export const generateOTP = () => {
  const otpNumber = crypto.randomInt(100000, 1000000);
  return otpNumber.toString();
};

/**
 * Hash an OTP using SHA-256 for secure storage in MongoDB
 * @param {string} otp 6-digit OTP string
 * @returns {string} SHA-256 hex hash
 */
export const hashOTP = (otp) => {
  return crypto.createHash("sha256").update(otp.toString()).digest("hex");
};
