import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import { ChevronDown, ArrowRight, Menu, X, LayoutDashboard, LogOut } from "lucide-react";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user: reduxUser } = useSelector((state) => state.auth);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const storedToken = token || localStorage.getItem("campusconnect_token");

  let user = reduxUser;
  if (!user) {
    try {
      const stored = localStorage.getItem("campusconnect_user");
      user = stored ? JSON.parse(stored) : null;
    } catch {
      user = null;
    }
  }

  const handleLogout = () => {
    dispatch(logout());
    setMobileMenuOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <>
      <div className="top-announcement-bar">
        <span>Smart Campus Management • <strong>One platform for your entire institution</strong></span>
      </div>

      <header className="navbar-wrapper">
        <nav className="navbar">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <div className="logo-box">C</div>
            <div className="logo-text">
              <div className="logo-title">CampusConnect</div>
              <div className="logo-subtitle">SMART CAMPUS PLATFORM</div>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="navbar-links">
            <a href="#features">Platform <ChevronDown size={14} /></a>
            <a href="#solutions">Solutions <ChevronDown size={14} /></a>
            <a href="#roles">Roles</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>

          {/* Right Actions */}
          <div className="navbar-actions">
            {storedToken ? (
              <>
                <Link to="/dashboard" className="login-btn" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>

                <button onClick={handleLogout} className="nav-get-started" style={{ backgroundColor: "#ef4444" }}>
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="login-btn">
                  Login
                </Link>

                <Link to="/register" className="nav-get-started">
                  Get Started
                  <ArrowRight size={16} />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
        </nav>
      </header>

      {/* Mobile Off-Canvas Drawer */}
      {mobileMenuOpen && (
        <>
          <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)} />
          <div className="mobile-drawer">
            <div>
              <div className="mobile-drawer-header">
                <div className="navbar-logo">
                  <div className="logo-box">C</div>
                  <div className="logo-title">CampusConnect</div>
                </div>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              <div className="mobile-drawer-nav">
                <a href="#features" onClick={() => setMobileMenuOpen(false)}>Platform</a>
                <a href="#solutions" onClick={() => setMobileMenuOpen(false)}>Solutions</a>
                <a href="#roles" onClick={() => setMobileMenuOpen(false)}>Roles & Access</a>
                <a href="#about" onClick={() => setMobileMenuOpen(false)}>About Us</a>
                <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "24px" }}>
              {storedToken ? (
                <>
                  <Link
                    to="/dashboard"
                    className="primary-hero-btn"
                    style={{ justifyContent: "center" }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Go to Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="primary-hero-btn"
                    style={{ justifyContent: "center", backgroundColor: "#ef4444" }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="secondary-hero-btn"
                    style={{ justifyContent: "center" }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="primary-hero-btn"
                    style={{ justifyContent: "center" }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started →
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Navbar;