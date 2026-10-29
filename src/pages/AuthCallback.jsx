import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthSession } from "../redux/slices/authSlice";
import { toast } from "sonner";

function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const token = searchParams.get("token");
    const userParam = searchParams.get("user");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      toast.error(errorParam || "Google authentication failed.");
      navigate("/login", { replace: true });
      return;
    }

    if (token) {
      let user = null;
      if (userParam) {
        try {
          user = JSON.parse(decodeURIComponent(userParam));
        } catch {
          user = null;
        }
      }

      dispatch(setAuthSession({ token, user }));
      toast.success(
        user?.name
          ? `Welcome to CampusConnect, ${user.name}!`
          : "Successfully authenticated with Google!"
      );

      navigate("/dashboard", { replace: true });
    } else {
      toast.error("Authentication token missing. Please try logging in again.");
      navigate("/login", { replace: true });
    }
  }, [searchParams, navigate, dispatch]);

  return (
    <section className="auth-page">
      <div className="auth-card" style={{ textAlign: "center", padding: "48px 32px", maxWidth: "420px" }}>
        <div className="auth-logo" style={{ justifyContent: "center", marginBottom: "20px" }}>
          <div className="auth-logo-box">C</div>
          <div style={{ textAlign: "left" }}>
            <div className="logo-title">CampusConnect</div>
            <div className="logo-subtitle">SMART CAMPUS PLATFORM</div>
          </div>
        </div>

        <div style={{ margin: "28px 0" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "3px solid rgba(99, 102, 241, 0.2)",
              borderTopColor: "#6366f1",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto",
            }}
          />
        </div>

        <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>
          Authenticating with Google...
        </h2>
        <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
          Verifying your credentials and establishing a secure session.
        </p>

        <style>
          {`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </section>
  );
}

export default AuthCallback;
