import jwt from "jsonwebtoken";

/**
 * Generate JWT token for authenticated user
 * @param {string} id User MongoDB _id
 * @returns {string} JWT Token
 */
export const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || "campusconnect_default_jwt_secret_key_2026";
  return jwt.sign({ id }, secret, {
    expiresIn: "30d",
  });
};
