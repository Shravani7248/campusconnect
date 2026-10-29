import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, clearAuthError, setPendingEmail } from "../redux/slices/authSlice";
import GoogleButton from "../components/auth/GoogleButton";
import { toast } from "sonner";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, token } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const [localError, setLocalError] = useState("");

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  // Redirect if already authenticated
  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setLocalError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setLocalError("Please fill in all required fields.");
      toast.error("Please fill in all required fields.");
      return;
    }

    const cleanEmail = formData.email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setLocalError("Please enter a valid email address (e.g. Gmail, Outlook, Yahoo, or your college email).");
      toast.error("Please enter a valid email address.");
      return;
    }

    if (formData.password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match.");
      toast.error("Passwords do not match.");
      return;
    }

    const payload = {
      name: formData.fullName.trim(),
      email: cleanEmail,
      password: formData.password,
      role: formData.role,
    };

    const result = await dispatch(registerUser(payload));

    if (registerUser.fulfilled.match(result)) {
      dispatch(setPendingEmail(cleanEmail));
      toast.success("Account created! A 6-digit verification code was sent to your email.");
      navigate("/verify-email", { state: { email: cleanEmail } });
    } else {
      const errMsg = result.payload || "Registration failed. Please check your information.";
      setLocalError(errMsg);
      toast.error(errMsg);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-box">C</div>
          <div>
            <div className="logo-title">CampusConnect</div>
            <div className="logo-subtitle">SMART CAMPUS PLATFORM</div>
          </div>
        </div>

        {/* Heading */}
        <h1>Create your account</h1>
        <p>Join the CampusConnect community</p>

        {/* Continue with Google */}
        <div style={{ marginBottom: "20px" }}>
          <GoogleButton label="Continue with Google" disabled={loading} />
        </div>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <div style={{ flex: 1, height: "1px", backgroundColor: "#e2e8f0" }} />
          <span
            style={{
              fontSize: "11px",
              fontWeight: "600",
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Or register with email
          </span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#e2e8f0" }} />
        </div>

        {/* Error Notification */}
        {(error || localError) && (
          <div
            style={{
              padding: "12px 14px",
              backgroundColor: "rgba(244, 63, 94, 0.1)",
              border: "1px solid #f43f5e",
              borderRadius: "8px",
              color: "#f43f5e",
              fontSize: "13px",
              marginBottom: "16px",
              lineHeight: "1.5",
            }}
          >
            {error || localError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="auth-field">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              placeholder="e.g. Alex Johnson"
              value={formData.fullName}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>

          {/* Email */}
          <div className="auth-field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Gmail, Outlook, Yahoo, or college email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          {/* Account Type */}
          <div className="auth-field">
            <label htmlFor="role">Account Type</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="student">Student Account</option>
              <option value="faculty">Faculty / Staff Account</option>
            </select>
          </div>

          {/* Password */}
          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Create a password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="auth-field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>

          {/* Submit */}
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Creating Account & Sending OTP..." : "Create Account"}
          </button>
        </form>

        {/* Login Redirect */}
        <div className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </section>
  );
}

export default Register;