import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { forgotPassword, setResetEmail, clearAuthError, clearAuthSuccess } from "../redux/slices/authSlice";
import { toast } from "sonner";

function ForgotPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, successMessage } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    dispatch(clearAuthError());
    dispatch(clearAuthSuccess());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setLocalError("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
      return;
    }

    dispatch(setResetEmail(cleanEmail));
    const result = await dispatch(forgotPassword({ email: cleanEmail }));

    if (forgotPassword.fulfilled.match(result)) {
      toast.success("Password reset code dispatched! Check your inbox.");
      setTimeout(() => {
        navigate("/verify-reset-otp", { state: { email: cleanEmail } });
      }, 800);
    } else {
      const errMsg = result.payload || "Failed to send reset code. Please try again.";
      setLocalError(errMsg);
      toast.error(errMsg);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card" style={{ maxWidth: "440px" }}>
        <div className="auth-logo">
          <div className="auth-logo-box">C</div>
          <div>
            <div className="logo-title">CampusConnect</div>
            <div className="logo-subtitle">SMART CAMPUS PLATFORM</div>
          </div>
        </div>

        <h1>Forgot Password?</h1>
        <p>Enter your registered email address to receive a secure 6-digit password reset code.</p>

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
          <div className="auth-field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="e.g. yourname@campus.edu"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setLocalError("");
              }}
              autoComplete="email"
              required
            />
          </div>

          <button type="submit" className="auth-submit" disabled={loading || !email.trim()}>
            {loading ? "Sending Reset Code..." : "Send Reset Code"}
          </button>
        </form>

        <div className="auth-footer" style={{ marginTop: "24px" }}>
          Remember your password? <Link to="/login">Log in</Link>
        </div>
      </div>
    </section>
  );
}

export default ForgotPassword;
