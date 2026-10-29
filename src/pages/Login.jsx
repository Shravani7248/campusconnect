import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { loginUser, clearAuthError, setPendingEmail } from "../redux/slices/authSlice";
import GoogleButton from "../components/auth/GoogleButton";
import { toast } from "sonner";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { loading, error, token } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [localError, setLocalError] = useState("");
  const [unverifiedEmail, setUnverifiedEmail] = useState(null);

  // Check for error in query string (from Google OAuth redirect)
  useEffect(() => {
    const queryError = searchParams.get("error");
    if (queryError) {
      setLocalError(queryError);
      toast.error(queryError);
    }
  }, [searchParams]);

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
    setUnverifiedEmail(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUnverifiedEmail(null);

    if (!formData.email || !formData.password) {
      setLocalError("Please enter both your email address and password.");
      toast.error("Please fill in both email and password.");
      return;
    }

    if (!formData.email.includes("@")) {
      setLocalError("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
      return;
    }

    const result = await dispatch(loginUser(formData));

    if (loginUser.fulfilled.match(result)) {
      toast.success("Login successful! Welcome back.");
      navigate("/dashboard");
    } else {
      const errMsg = result.payload || "Login failed.";
      if (
        typeof errMsg === "string" &&
        (errMsg.toLowerCase().includes("verify") || errMsg.toLowerCase().includes("not verified"))
      ) {
        setUnverifiedEmail(formData.email);
        dispatch(setPendingEmail(formData.email));
        toast.warning("Email not verified. Please enter the OTP code sent to your email.");
      } else {
        toast.error(errMsg);
      }
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
        <h1>Welcome back</h1>
        <p>Log in to access your CampusConnect dashboard</p>

        {/* Unverified Account Banner */}
        {unverifiedEmail ? (
          <div
            style={{
              padding: "12px 14px",
              backgroundColor: "rgba(245, 158, 11, 0.1)",
              border: "1px solid #f59e0b",
              borderRadius: "8px",
              color: "#f59e0b",
              fontSize: "13px",
              marginBottom: "16px",
              lineHeight: "1.5",
            }}
          >
            <strong>Email Not Verified!</strong>
            <br />
            Your account requires email OTP verification before logging in.
            <div style={{ marginTop: "10px" }}>
              <button
                type="button"
                onClick={() => navigate("/verify-email", { state: { email: unverifiedEmail } })}
                style={{
                  backgroundColor: "#f59e0b",
                  color: "#0f172a",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                Enter OTP Verification Code →
              </button>
            </div>
          </div>
        ) : error || localError ? (
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
        ) : null}

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
            Or continue with email
          </span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#e2e8f0" }} />
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="auth-field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="e.g. yourname@campus.edu"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          {/* Password */}
          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          {/* Options */}
          <div className="auth-options">
            <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
              <input type="checkbox" style={{ accentColor: "#2563eb", cursor: "pointer" }} />
              Remember me
            </label>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          {/* Login Submit */}
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Register Redirect */}
        <div className="auth-footer">
          Don't have an account? <Link to="/register">Create an account</Link>
        </div>
      </div>
    </section>
  );
}

export default Login;