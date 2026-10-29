import { Resend } from "resend";

/**
 * Resolve Resend Email Configuration from environment variables
 */
const getEmailConfig = () => {
  const apiKey = process.env.RESEND_API_KEY?.trim() || "";
  let from = process.env.EMAIL_FROM?.trim() || process.env.RESEND_FROM_EMAIL?.trim() || "onboarding@resend.dev";

  // If from doesn't contain a display name and brackets, format standard display name
  if (!from.includes("<") && from.includes("@")) {
    from = `CampusConnect <${from}>`;
  }

  return { apiKey, from };
};

/**
 * Format friendly error messages for Resend delivery failures
 */
const formatResendError = (err) => {
  const msg = err?.message || String(err || "Failed to deliver email");
  
  if (msg.includes("testing email") || msg.includes("validation_error") || msg.includes("domains like")) {
    return "Resend Sandbox Restriction: With 'onboarding@resend.dev', emails can only be delivered to your registered Resend account email address. To send emails to any recipient, verify your domain in the Resend dashboard (https://resend.com/domains).";
  }

  if (msg.includes("API key") || msg.includes("restricted") || msg.includes("unauthorized")) {
    return "Invalid or restricted Resend API key. Please check RESEND_API_KEY in your backend/.env.";
  }

  return msg;
};

/**
 * Build professional CampusConnect-branded email HTML template
 */
const buildEmailTemplate = ({ title, preheader, name, description, otp, accentColor, accentGlow, actionNotice }) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 540px; background-color: #0f172a; border-radius: 16px; border: 1px solid #1e293b; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);">
          
          <!-- Header Bar -->
          <tr>
            <td style="padding: 36px 36px 24px; text-align: center; border-bottom: 1px solid #1e293b; background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);">
              <div style="display: inline-block; width: 50px; height: 50px; line-height: 50px; background: ${accentColor}; border-radius: 12px; font-weight: 800; font-size: 24px; color: #ffffff; text-align: center; box-shadow: 0 4px 14px ${accentGlow};">
                C
              </div>
              <h1 style="margin: 14px 0 2px; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">CampusConnect</h1>
              <p style="margin: 0; font-size: 11px; font-weight: 600; color: #94a3b8; letter-spacing: 1.5px; text-transform: uppercase;">Smart Campus Platform</p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px 36px;">
              <h2 style="margin: 0 0 16px; font-size: 19px; font-weight: 700; color: #ffffff;">${preheader}</h2>
              <p style="margin: 0 0 14px; font-size: 15px; line-height: 1.6; color: #cbd5e1;">
                Hello <strong style="color: #f8fafc;">${name}</strong>,
              </p>
              <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #94a3b8;">
                ${description}
              </p>

              <!-- OTP Code Display Card -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 24px 0;">
                <tr>
                  <td align="center" style="background: rgba(15, 23, 42, 0.8); border: 2px dashed ${accentGlow}; border-radius: 12px; padding: 22px 16px;">
                    <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.2px; color: #94a3b8; display: block; margin-bottom: 8px;">Your 6-Digit Verification Code</span>
                    <div style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #ffffff; text-indent: 10px; padding: 4px 0;">
                      ${otp}
                    </div>
                    <span style="font-size: 12px; color: #f59e0b; font-weight: 500; display: inline-block; margin-top: 8px;">
                      ⏱ Expires in 10 minutes (Single use only)
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Notice and Security Warnings -->
              <div style="background-color: #1e293b; border-left: 3px solid ${accentGlow}; border-radius: 6px; padding: 14px 16px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #cbd5e1;">
                  <strong>Security Note:</strong> ${actionNotice} CampusConnect administrators will never ask for your code or password.
                </p>
              </div>

              <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #64748b;">
                If you did not initiate this request, someone may have entered your email by mistake. You can safely ignore this email; no changes will be made to your account.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 36px; background-color: #0b0f19; border-top: 1px solid #1e293b; text-align: center;">
              <p style="margin: 0 0 6px; font-size: 12px; color: #64748b;">
                CampusConnect • Comprehensive Academic & Campus Management
              </p>
              <p style="margin: 0; font-size: 11px; color: #475569;">
                This is an automated system notification. Please do not reply directly to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

/**
 * Dispatch an OTP email via Resend
 */
const sendOtpEmail = async ({ email, otp, name, subject, preheader, description, actionNotice, text, accentColor, accentGlow, label }) => {
  const { apiKey, from } = getEmailConfig();

  if (!apiKey || apiKey.includes("your_resend_api_key")) {
    console.error(`[Email Service Error] Cannot send ${label}: RESEND_API_KEY is not configured in backend/.env`);
    return {
      success: false,
      error: "Resend API key is not configured. Please set RESEND_API_KEY in backend/.env.",
    };
  }

  const html = buildEmailTemplate({
    title: subject,
    preheader,
    name,
    description,
    otp,
    accentColor,
    accentGlow,
    actionNotice,
  });

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from,
      to: email,
      subject,
      text,
      html,
    });

    if (error) {
      const formatted = formatResendError(error);
      console.error(`[Resend Delivery Error] ${label} for ${email} failed: ${formatted}`);
      return {
        success: false,
        error: formatted,
      };
    }

    console.log(`[Resend Success] ${label} dispatched successfully to ${email} (Message ID: ${data?.id || "ok"})`);
    return {
      success: true,
      id: data?.id,
    };
  } catch (error) {
    const formatted = formatResendError(error);
    console.error(`[Resend Exception] Failed to send ${label} to ${email}: ${formatted}`);
    return {
      success: false,
      error: formatted,
    };
  }
};

/**
 * Send 6-Digit Email Verification Code to new or pending user
 */
export const sendVerificationOTP = async (email, otp, name = "Student") => {
  return sendOtpEmail({
    email,
    otp,
    name,
    label: "Verification email",
    subject: "CampusConnect - Verify Your Email Address",
    preheader: "Email Verification Code",
    description: "Thank you for creating an account on CampusConnect. Please use the six-digit verification code below to verify your email address and activate your account.",
    actionNotice: "Enter this code on the verification screen to activate your account.",
    text: `Hello ${name},\n\nThank you for signing up for CampusConnect.\n\nYour 6-digit email verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you did not request this code, please disregard this email.`,
    accentColor: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    accentGlow: "rgba(99, 102, 241, 0.4)",
  });
};

/**
 * Send 6-Digit Password Reset Code to user
 */
export const sendPasswordResetOTP = async (email, otp, name = "User") => {
  return sendOtpEmail({
    email,
    otp,
    name,
    label: "Password reset email",
    subject: "CampusConnect - Password Reset Request",
    preheader: "Reset Your Account Password",
    description: "We received a request to reset the password for your CampusConnect account. Use the six-digit code below to set a new password.",
    actionNotice: "Do not disclose this password reset code to anyone.",
    text: `Hello ${name},\n\nWe received a request to reset your password on CampusConnect.\n\nYour 6-digit password reset code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you did not request this, you can safely ignore this email.`,
    accentColor: "linear-gradient(135deg, #e11d48 0%, #be123c 100%)",
    accentGlow: "rgba(225, 29, 72, 0.4)",
  });
};
