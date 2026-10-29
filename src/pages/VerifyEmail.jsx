import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { verifyEmail, resendOTP, clearAuthError, clearAuthSuccess } from "../redux/slices/authSlice";
import { toast } from "sonner";

function VerifyEmail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, successMessage, pendingEmail, token } = useSelector((state) => state.auth);

  const email = (location.state?.email || pendingEmail || "").trim();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [cooldown, setCooldown] = useState(60);
  const [localError, setLocalError] = useState("");
  const inputRefs = useRef([]);

  useEffect(() => {
    dispatch(clearAuthError());
    dispatch(clearAuthSuccess());
  }, [dispatch]);

  // 60-second Cooldown Timer
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Redirect if already authenticated
  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  // Focus the first input on initial mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Handle individual digit input
  const handleDigitChange = (value, index) => {
    // Only accept numeric digit
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned && value !== "") return;

    const char = cleaned.slice(-1); // Take latest typed digit
    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);
    setLocalError("");

    if (char && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }

    // Auto-submit if all 6 digits are complete
    if (char && index === 5) {
      const fullCode = newOtp.join("");
      if (fullCode.length === 6) {
        submitVerification(fullCode);
      }
    }
  };

  // Handle key navigation (Backspace, ArrowLeft, ArrowRight)
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0 && inputRefs.current[index - 1]) {
        e.preventDefault();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Full Paste Support: Handles pasting 6-digit code anywhere
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const digitsOnly = pastedData.replace(/\D/g, "").slice(0, 6);

    if (!digitsOnly) return;

    const newOtp = ["", "", "", "", "", ""];
    for (let i = 0; i < digitsOnly.length; i++) {
      newOtp[i] = digitsOnly[i];
    }
    setOtp(newOtp);
    setLocalError("");

    // Focus the box after the last pasted digit
    const nextIndex = Math.min(digitsOnly.length, 5);
    inputRefs.current[nextIndex]?.focus();

    // Auto-submit if complete 6-digit code was pasted
    if (digitsOnly.length === 6) {
      submitVerification(digitsOnly);
    }
  };

  const submitVerification = async (codeToVerify) => {
    const finalOtp = codeToVerify || otp.join("");

    if (!email) {
      setLocalError("Email address missing. Please return to login or registration.");
      toast.error("Email address missing.");
      return;
    }

    if (finalOtp.length !== 6) {
      setLocalError("Please enter all 6 digits of your verification code.");
      return;
    }

    const result = await dispatch(verifyEmail({ email, otp: finalOtp }));

    if (verifyEmail.fulfilled.match(result)) {
      toast.success("Email verified successfully! Welcome to CampusConnect.");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } else {
      const errMsg = result.payload || "Verification failed. Please check the code and try again.";
      setLocalError(errMsg);
      toast.error(errMsg);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitVerification(otp.join(""));
  };

  const handleResend = async () => {
    if (cooldown > 0 || !email || loading) return;

    setLocalError("");
    const result = await dispatch(resendOTP({ email }));

    if (resendOTP.fulfilled.match(result)) {
      setCooldown(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      toast.success("A new 6-digit verification code was sent to your email!");
    } else {
      const errMsg = result.payload || "Unable to resend verification code.";
      setLocalError(errMsg);
      toast.error(errMsg);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card" style={{ maxWidth: "460px" }}>
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-box">C</div>
          <div>
            <div className="logo-title">CampusConnect</div>
            <div className="logo-subtitle">SMART CAMPUS PLATFORM</div>
          </div>
        </div>

        <h1>Verify Your Email</h1>
        <p>
          We've sent a 6-digit verification code to:
          <br />
          <strong style={{ color: "#2563eb", wordBreak: "break-all" }}>
            {email || "your email address"}
          </strong>
        </p>

        {/* Error notification */}
        {(error || localError) && (
          <div
            style={{
              padding: "12px 14px",
              backgroundColor: "rgba(244, 63, 94, 0.1)",
              border: "1px solid #f43f5e",
              borderRadius: "8px",
              color: "#f43f5e",
              fontSize: "13px",
              marginBottom: "18px",
              lineHeight: "1.5",
            }}
          >
            {error || localError}
          </div>
        )}

        {/* Success notification */}
        {successMessage && !error && !localError && (
          <div
            style={{
              padding: "12px 14px",
              backgroundColor: "rgba(34, 197, 94, 0.1)",
              border: "1px solid #22c55e",
              borderRadius: "8px",
              color: "#22c55e",
              fontSize: "13px",
              marginBottom: "18px",
              lineHeight: "1.5",
            }}
          >
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Responsive 6-Digit OTP Inputs */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "clamp(6px, 2vw, 12px)",
              margin: "24px 0",
              width: "100%",
              overflow: "hidden",
            }}
          >
            {otp.map((data, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="1"
                value={data}
                onChange={(e) => handleDigitChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                onFocus={(e) => e.target.select()}
                style={{
                  width: "clamp(38px, 12vw, 52px)",
                  height: "clamp(48px, 14vw, 60px)",
                  fontSize: "clamp(20px, 5vw, 26px)",
                  fontWeight: "700",
                  textAlign: "center",
                  borderRadius: "10px",
                  border: data ? "2px solid #2563eb" : "1px solid #cbd5e1",
                  backgroundColor: data ? "rgba(37, 99, 235, 0.04)" : "#ffffff",
                  color: "#0f172a",
                  outline: "none",
                  transition: "all 0.15s ease-in-out",
                  boxShadow: data ? "0 0 0 3px rgba(37, 99, 235, 0.1)" : "none",
                }}
              />
            ))}
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading || otp.join("").length !== 6}
          >
            {loading ? "Verifying Code..." : "Verify Code & Activate"}
          </button>
        </form>

        {/* Resend Cooldown Section */}
        <div style={{ marginTop: "24px", textAlign: "center", fontSize: "14px", color: "#64748b" }}>
          Didn't receive the email code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || loading || !email}
            style={{
              background: "none",
              border: "none",
              color: cooldown > 0 ? "#94a3b8" : "#2563eb",
              fontWeight: "600",
              cursor: cooldown > 0 || loading ? "not-allowed" : "pointer",
              padding: "4px 8px",
              borderRadius: "4px",
              transition: "all 0.2s ease",
            }}
          >
            {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
          </button>
        </div>

        <div className="auth-footer" style={{ marginTop: "20px" }}>
          <Link to="/login">← Back to Log In</Link>
        </div>
      </div>
    </section>
  );
}

export default VerifyEmail;
