import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateOTP, hashOTP } from "../utils/generateOTP.js";
import { generateToken } from "../utils/generateToken.js";
import { sendVerificationOTP, sendPasswordResetOTP } from "../services/emailService.js";

/**
 * Helper to get clean Client URL for OAuth redirects
 */
const getClientUrl = () => {
  return (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "");
};

/**
 * @desc    Register a new user and send email verification OTP via Resend
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email address, and password are required.",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (!cleanEmail.includes("@") || cleanEmail.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    // Role safety: Public signups default to student, allow faculty if chosen, forbid admin self-elevation
    let safeRole = "student";
    if (role === "faculty") {
      safeRole = "faculty";
    }

    const existingUser = await User.findOne({ email: cleanEmail });

    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({
          success: false,
          message: "An account with this email address already exists. Please log in.",
        });
      }

      // Check 60-second resend cooldown for unverified accounts
      if (existingUser.lastOtpSentAt) {
        const elapsedSeconds = (Date.now() - new Date(existingUser.lastOtpSentAt).getTime()) / 1000;
        if (elapsedSeconds < 60) {
          const remaining = Math.ceil(60 - elapsedSeconds);
          return res.status(429).json({
            success: false,
            message: `A verification code was recently sent. Please wait ${remaining} seconds before requesting a new one.`,
            data: { email: cleanEmail },
          });
        }
      }

      // Generate secure 6-digit OTP
      const rawOTP = generateOTP();
      const otpHash = hashOTP(rawOTP);
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Send verification email via Resend
      const emailResult = await sendVerificationOTP(cleanEmail, rawOTP, name);

      if (!emailResult.success) {
        return res.status(500).json({
          success: false,
          message: emailResult.error || "Unable to send verification email. Please check your email configuration.",
        });
      }

      // Update unverified user record with new password, hashed OTP, and refreshed cooldown
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUser.name = name.trim();
      existingUser.password = hashedPassword;
      existingUser.role = safeRole;
      existingUser.verificationOTP = {
        otpHash,
        expiresAt,
        attempts: 0,
      };
      existingUser.lastOtpSentAt = new Date();
      await existingUser.save();

      return res.status(200).json({
        success: true,
        message: "Verification code sent! Please check your email inbox to verify your account.",
        data: {
          email: cleanEmail,
          name: existingUser.name,
        },
      });
    }

    // Generate secure 6-digit OTP
    const rawOTP = generateOTP();
    const otpHash = hashOTP(rawOTP);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Send verification email via Resend BEFORE creating DB record to prevent orphaned unverified accounts
    const emailResult = await sendVerificationOTP(cleanEmail, rawOTP, name.trim());

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: emailResult.error || "Unable to send verification email. Please verify your email configuration.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: safeRole,
      isVerified: false,
      verificationOTP: {
        otpHash,
        expiresAt,
        attempts: 0,
      },
      lastOtpSentAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Registration successful! A 6-digit verification code has been sent to your email inbox.",
      data: {
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify email address using 6-digit numeric OTP
 * @route   POST /api/auth/verify-email
 * @access  Public
 */
export const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email address and 6-digit verification code are required.",
      });
    }

    const cleanOtp = String(otp).trim();
    if (!/^\d{6}$/.test(cleanOtp)) {
      return res.status(400).json({
        success: false,
        message: "Verification code must be exactly 6 numeric digits.",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user account found with this email address.",
      });
    }

    if (user.isVerified) {
      const token = generateToken(user._id);
      return res.status(200).json({
        success: true,
        message: "Email is already verified. You are logged in.",
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
          },
        },
      });
    }

    const { otpHash, expiresAt, attempts = 0 } = user.verificationOTP || {};

    if (!otpHash || !expiresAt) {
      return res.status(400).json({
        success: false,
        message: "No active verification code found. Please request a new code.",
      });
    }

    // Check expiration (10 minutes)
    if (new Date() > new Date(expiresAt)) {
      user.verificationOTP = { otpHash: null, expiresAt: null, attempts: 0 };
      await user.save();
      return res.status(400).json({
        success: false,
        message: "Verification code has expired. Please request a new code.",
      });
    }

    // Check attempts limit (max 5)
    if (attempts >= 5) {
      user.verificationOTP = { otpHash: null, expiresAt: null, attempts: 0 };
      await user.save();
      return res.status(429).json({
        success: false,
        message: "Maximum verification attempts exceeded (5). For your security, this code has been invalidated. Please request a new code.",
      });
    }

    // Securely compare SHA-256 hashes
    const inputHash = hashOTP(cleanOtp);

    if (inputHash !== otpHash) {
      const newAttempts = attempts + 1;
      user.verificationOTP.attempts = newAttempts;
      await user.save();

      const remainingAttempts = 5 - newAttempts;
      return res.status(400).json({
        success: false,
        message: remainingAttempts > 0
          ? `Invalid verification code. ${remainingAttempts} attempt(s) remaining.`
          : "Invalid verification code. Maximum attempts exceeded. Please request a new code.",
      });
    }

    // OTP Verified successfully - Mark verified and invalidate OTP
    user.isVerified = true;
    user.verificationOTP = {
      otpHash: null,
      expiresAt: null,
      attempts: 0,
    };
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Email verified successfully! Welcome to CampusConnect.",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Resend Verification OTP with 60-second cooldown
 * @route   POST /api/auth/resend-otp
 * @access  Public
 */
export const resendVerificationOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required.",
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email address.",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Your email address is already verified. You can log in directly.",
      });
    }

    // 60-second cooldown verification
    if (user.lastOtpSentAt) {
      const elapsedSeconds = (Date.now() - new Date(user.lastOtpSentAt).getTime()) / 1000;
      if (elapsedSeconds < 60) {
        const remaining = Math.ceil(60 - elapsedSeconds);
        return res.status(429).json({
          success: false,
          message: `Please wait ${remaining} seconds before requesting a new code.`,
        });
      }
    }

    // Generate fresh 6-digit OTP & hash
    const rawOTP = generateOTP();
    const otpHash = hashOTP(rawOTP);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Dispatch email via Resend
    const emailResult = await sendVerificationOTP(user.email, rawOTP, user.name);

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: emailResult.error || "Failed to deliver verification email. Please check your Resend configuration.",
      });
    }

    // Update user record: invalidate previous OTP, store new hash, reset attempts
    user.verificationOTP = {
      otpHash,
      expiresAt,
      attempts: 0,
    };
    user.lastOtpSentAt = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "A new 6-digit verification code has been sent to your email inbox.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate User via Email & Password
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email address and password are required.",
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email address. Please register first.",
      });
    }

    // Check if account was created with Google OAuth and has no password set
    if (!user.password && user.googleId) {
      return res.status(400).json({
        success: false,
        message: "This account was created using Google Sign-In. Please click 'Continue with Google' to log in.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password. Please verify and try again, or use Forgot Password.",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Your email address is not verified yet. Please enter the verification code sent to your email.",
        data: {
          email: user.email,
          isVerified: false,
        },
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful! Welcome back.",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Initiate Google OAuth 2.0 Flow
 * @route   GET /api/auth/google
 * @access  Public
 */
export const googleAuth = async (req, res) => {
  const clientUrl = getClientUrl();
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const callbackUrl = process.env.GOOGLE_CALLBACK_URL?.trim() || `${req.protocol}://${req.get("host")}/api/auth/google/callback`;

  if (!clientId || clientId === "your_google_client_id_here") {
    console.error("[Google OAuth Error] Missing GOOGLE_CLIENT_ID in backend/.env");
    return res.redirect(
      `${clientUrl}/login?error=${encodeURIComponent(
        "Google Sign-In is not configured on the server. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in backend/.env."
      )}`
    );
  }

  // Create state nonce for CSRF protection
  const state = crypto.randomBytes(16).toString("hex");

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: callbackUrl,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
    state,
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  res.redirect(authUrl);
};

/**
 * @desc    Handle Google OAuth 2.0 Callback
 * @route   GET /api/auth/google/callback
 * @access  Public
 */
export const googleAuthCallback = async (req, res) => {
  const clientUrl = getClientUrl();
  const { code, error } = req.query;

  // Handle user cancellation or access denial
  if (error) {
    const errorMsg = error === "access_denied"
      ? "Google Sign-In was cancelled."
      : `Google authentication failed: ${error}`;
    return res.redirect(`${clientUrl}/login?error=${encodeURIComponent(errorMsg)}`);
  }

  if (!code) {
    return res.redirect(`${clientUrl}/login?error=${encodeURIComponent("Authorization code not received from Google.")}`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const callbackUrl = process.env.GOOGLE_CALLBACK_URL?.trim() || `${req.protocol}://${req.get("host")}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    return res.redirect(
      `${clientUrl}/login?error=${encodeURIComponent("Server Google OAuth credentials are not properly configured.")}`
    );
  }

  try {
    // 1. Exchange authorization code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: String(code),
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: callbackUrl,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error("[Google OAuth Token Exchange Failed]:", tokenData);
      return res.redirect(
        `${clientUrl}/login?error=${encodeURIComponent(
          tokenData.error_description || "Failed to exchange code with Google."
        )}`
      );
    }

    // 2. Fetch Google user profile
    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profile = await userInfoResponse.json();

    if (!userInfoResponse.ok || !profile.email) {
      console.error("[Google Profile Fetch Failed]:", profile);
      return res.redirect(`${clientUrl}/login?error=${encodeURIComponent("Could not retrieve email from Google profile.")}`);
    }

    const { sub: googleId, email, name, picture } = profile;
    const cleanEmail = email.toLowerCase().trim();

    // 3. Find or link or create user
    let user = await User.findOne({ googleId });

    if (!user) {
      // Check if user exists by email address (link safely)
      user = await User.findOne({ email: cleanEmail });

      if (user) {
        // Link Google ID to existing account and verify email
        user.googleId = googleId;
        user.isVerified = true;
        if (!user.avatar && picture) user.avatar = picture;
        // CRITICAL: Preserve existing roles (faculty/admin remain faculty/admin)
        await user.save();
      } else {
        // New Google registration: Assign student role as requested
        user = await User.create({
          name: name || cleanEmail.split("@")[0],
          email: cleanEmail,
          googleId,
          avatar: picture || null,
          role: "student", // new public registrations assigned student role
          isVerified: true, // Google verifies email
          authProvider: "google",
        });
      }
    } else {
      // Existing Google user: update avatar if changed
      if (picture && user.avatar !== picture) {
        user.avatar = picture;
        await user.save();
      }
    }

    // 4. Generate CampusConnect JWT token
    const token = generateToken(user._id);

    // 5. Redirect to frontend auth callback handler
    const safeUserData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    };

    const redirectUrl = `${clientUrl}/auth/callback?token=${encodeURIComponent(token)}&user=${encodeURIComponent(
      JSON.stringify(safeUserData)
    )}`;

    res.redirect(redirectUrl);
  } catch (error) {
    console.error("[Google OAuth Callback Exception]:", error);
    res.redirect(
      `${clientUrl}/login?error=${encodeURIComponent(
        error.message || "An unexpected error occurred during Google Sign-In."
      )}`
    );
  }
};

/**
 * @desc    Verify Google ID Token from client-side Google Identity Services
 * @route   POST /api/auth/google/credential
 * @access  Public
 */
export const googleTokenAuth = async (req, res, next) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google ID token credential is required.",
      });
    }

    // Verify token with Google tokeninfo endpoint
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
    const payload = await response.json();

    if (!response.ok || payload.error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired Google credential.",
      });
    }

    const { sub: googleId, email, name, picture } = payload;
    const cleanEmail = email.toLowerCase().trim();

    let user = await User.findOne({ googleId });

    if (!user) {
      user = await User.findOne({ email: cleanEmail });

      if (user) {
        user.googleId = googleId;
        user.isVerified = true;
        if (!user.avatar && picture) user.avatar = picture;
        await user.save();
      } else {
        user = await User.create({
          name: name || cleanEmail.split("@")[0],
          email: cleanEmail,
          googleId,
          avatar: picture || null,
          role: "student",
          isVerified: true,
          authProvider: "google",
        });
      }
    } else {
      if (picture && user.avatar !== picture) {
        user.avatar = picture;
        await user.save();
      }
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Google authentication successful.",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Current User Profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        isVerified: req.user.isVerified,
        avatar: req.user.avatar || null,
      },
    },
  });
};

/**
 * @desc    Request Password Reset OTP with 60s cooldown
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required.",
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      // Ambiguous response to prevent email enumeration
      return res.status(200).json({
        success: true,
        message: "If an account exists with this email address, a password reset code has been sent.",
      });
    }

    // 60-second cooldown check
    if (user.lastOtpSentAt) {
      const elapsedSeconds = (Date.now() - new Date(user.lastOtpSentAt).getTime()) / 1000;
      if (elapsedSeconds < 60) {
        const remaining = Math.ceil(60 - elapsedSeconds);
        return res.status(429).json({
          success: false,
          message: `Please wait ${remaining} seconds before requesting a new password reset code.`,
        });
      }
    }

    const rawOTP = generateOTP();
    const otpHash = hashOTP(rawOTP);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const emailResult = await sendPasswordResetOTP(user.email, rawOTP, user.name);

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: emailResult.error || "Failed to deliver password reset email. Please try again later.",
      });
    }

    user.resetOTP = {
      otpHash,
      expiresAt,
      attempts: 0,
    };
    user.lastOtpSentAt = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset code sent! Please check your email inbox.",
      data: {
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify Reset Password OTP
 * @route   POST /api/auth/verify-reset-otp
 * @access  Public
 */
export const verifyResetOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email address and 6-digit reset code are required.",
      });
    }

    const cleanOtp = String(otp).trim();
    if (!/^\d{6}$/.test(cleanOtp)) {
      return res.status(400).json({
        success: false,
        message: "Reset code must be exactly 6 numeric digits.",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user account found with this email address.",
      });
    }

    const { otpHash, expiresAt, attempts = 0 } = user.resetOTP || {};

    if (!otpHash || !expiresAt) {
      return res.status(400).json({
        success: false,
        message: "No active password reset request found. Please request a new code.",
      });
    }

    if (new Date() > new Date(expiresAt)) {
      user.resetOTP = { otpHash: null, expiresAt: null, attempts: 0 };
      await user.save();
      return res.status(400).json({
        success: false,
        message: "Password reset code has expired. Please request a new code.",
      });
    }

    if (attempts >= 5) {
      user.resetOTP = { otpHash: null, expiresAt: null, attempts: 0 };
      await user.save();
      return res.status(429).json({
        success: false,
        message: "Maximum attempts exceeded (5). For your security, please request a new password reset code.",
      });
    }

    const inputHash = hashOTP(cleanOtp);

    if (inputHash !== otpHash) {
      const newAttempts = attempts + 1;
      user.resetOTP.attempts = newAttempts;
      await user.save();

      const remainingAttempts = 5 - newAttempts;
      return res.status(400).json({
        success: false,
        message: remainingAttempts > 0
          ? `Invalid reset code. ${remainingAttempts} attempt(s) remaining.`
          : "Invalid reset code. Maximum attempts exceeded. Please request a new code.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Reset code verified. You may now enter your new password.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Set new password after OTP verification
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email address, verification code, and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters.",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    const { otpHash, expiresAt } = user.resetOTP || {};

    if (!otpHash || !expiresAt) {
      return res.status(400).json({
        success: false,
        message: "No active password reset session found. Please start over from Forgot Password.",
      });
    }

    if (new Date() > new Date(expiresAt)) {
      user.resetOTP = { otpHash: null, expiresAt: null, attempts: 0 };
      await user.save();
      return res.status(400).json({
        success: false,
        message: "Reset code has expired. Please request a new code.",
      });
    }

    const inputHash = hashOTP(String(otp).trim());
    if (inputHash !== otpHash) {
      return res.status(400).json({
        success: false,
        message: "Invalid reset code. Password reset aborted.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOTP = {
      otpHash: null,
      expiresAt: null,
      attempts: 0,
    };
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully! You can now log in with your new password.",
    });
  } catch (error) {
    next(error);
  }
};