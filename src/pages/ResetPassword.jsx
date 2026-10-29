import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { resetPassword, clearAuthError, clearAuthSuccess } from "../redux/slices/authSlice";
import { toast } from "sonner";

function ResetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, successMessage, resetEmail, resetOTP } = useSelector((state) => state.auth);

  const email = (location.state?.email || resetEmail || "").trim();
  const otp = (location.state?.otp || resetOTP || "").trim();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [formError, setFormError] = useState("");

  useEffect(() => {
    dispatch(clearAuthError());
    dispatch(clearAuthSuccess());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.newPassword || !formData.confirmPassword) {
      setFormError("Please fill in both password fields.");
      toast.error("Please fill in both password fields.");
      return;
    }

    if (formData.newPassword.length < 6) {
      setFormError("New password must be at least 6 characters.");
      toast.error("New password must be at least 6 characters.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setFormError("Passwords do not match.");
      toast.error("Passwords do not match.");
      return;
    }

    if (!email || !otp) {
      setFormError("Missing reset session data. Please restart from Forgot Password.");
      toast.error("Missing reset session data.");
      return;
    }

    const result = await dispatch(
      resetPassword({ email, otp, newPassword: formData.newPassword })
    );

    if (resetPassword.fulfilled.match(result)) {
      toast.success("Password reset successfully! You can now log in.");
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } else {
      const errMsg = result.payload || "Failed to reset password. Please try again.";
      setFormError(errMsg);
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

        <h1>Set New Password</h1>
        <p>Create a secure new password for your account.</p>

        {(error || formError) && (
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
            {error || formError}
          </div>
        )}

        {successMessage && (
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
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              name="newPassword"
              placeholder="Enter new password (min 6 characters)"
              value={formData.newPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Re-enter new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Resetting Password..." : "Update Password"}
          </button>
        </form>

        <div className="auth-footer" style={{ marginTop: "24px" }}>
          <Link to="/login">Cancel and Return to Log In</Link>
        </div>
      </div>
    </section>
  );
}

export default ResetPassword;
