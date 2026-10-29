import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { verifyResetOTP, setResetOTP, clearAuthError, clearAuthSuccess } from "../redux/slices/authSlice";
import { toast } from "sonner";

function VerifyResetOTP() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, successMessage, resetEmail } = useSelector((state) => state.auth);
  const email = (location.state?.email || resetEmail || "").trim();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [localError, setLocalError] = useState("");
  const inputRefs = useRef([]);

  useEffect(() => {
    dispatch(clearAuthError());
    dispatch(clearAuthSuccess());
  }, [dispatch]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleDigitChange = (value, index) => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned && value !== "") return;

    const char = cleaned.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);
    setLocalError("");

    if (char && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }

    if (char && index === 5) {
      const fullCode = newOtp.join("");
      if (fullCode.length === 6) {
        submitVerification(fullCode);
      }
    }
  };

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

    const nextIndex = Math.min(digitsOnly.length, 5);
    inputRefs.current[nextIndex]?.focus();

    if (digitsOnly.length === 6) {
      submitVerification(digitsOnly);
    }
  };

  const submitVerification = async (codeToVerify) => {
    const fullOtp = codeToVerify || otp.join("");

    if (!email) {
      setLocalError("Email address missing. Please request a new password reset code.");
      toast.error("Email address missing.");
      return;
    }

    if (fullOtp.length !== 6) {
      setLocalError("Please enter all 6 digits of your reset code.");
      return;
    }

    dispatch(setResetOTP(fullOtp));
    const result = await dispatch(verifyResetOTP({ email, otp: fullOtp }));

    if (verifyResetOTP.fulfilled.match(result)) {
      toast.success("Reset code verified successfully!");
      setTimeout(() => {
        navigate("/reset-password", { state: { email, otp: fullOtp } });
      }, 800);
    } else {
      const errMsg = result.payload || "Invalid reset code. Please try again.";
      setLocalError(errMsg);
      toast.error(errMsg);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitVerification(otp.join(""));
  };

  return (
    <section className="auth-page">
      <div className="auth-card" style={{ maxWidth: "460px" }}>
        <div className="auth-logo">
          <div className="auth-logo-box">C</div>
          <div>
            <div className="logo-title">CampusConnect</div>
            <div className="logo-subtitle">SMART CAMPUS PLATFORM</div>
          </div>
        </div>

        <h1>Verify Reset Code</h1>
        <p>
          Enter the 6-digit password reset code sent to:
          <br />
          <strong style={{ color: "#2563eb", wordBreak: "break-all" }}>
            {email || "your registered email"}
          </strong>
        </p>

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
            {loading ? "Verifying Code..." : "Verify Code"}
          </button>
        </form>

        <div className="auth-footer" style={{ marginTop: "20px" }}>
          <Link to="/forgot-password">← Back to Request Code</Link>
        </div>
      </div>
    </section>
  );
}

export default VerifyResetOTP;
