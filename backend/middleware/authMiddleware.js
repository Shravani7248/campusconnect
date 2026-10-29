import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Middleware to protect routes via JWT authentication
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const secret = process.env.JWT_SECRET || "campusconnect_default_jwt_secret_key_2026";
      const decoded = jwt.verify(token, secret);

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found or token invalid",
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Auth middleware error:", error.message);
      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token provided",
    });
  }
};

/**
 * Role-based authorization middleware
 * @param  {...string} roles Allowed roles ('admin', 'faculty', etc.)
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    const userRole = req.user.role;
    const normalizedAllowedRoles = roles.flatMap((r) =>
      r === "admin" || r === "administrator" ? ["admin", "administrator"] : [r]
    );

    if (!normalizedAllowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Role (${userRole || "guest"}) is not authorized to perform this operation`,
      });
    }
    next();
  };
};
