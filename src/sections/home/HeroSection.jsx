import { Link } from "react-router-dom";
import { Bell, Users, GraduationCap, CalendarDays, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";

function HeroSection() {
  return (
    <section className="hero-section" id="home">
      <div className="container">
        <div className="hero-container">
          {/* LEFT CONTENT */}
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              SMART CAMPUS PLATFORM
            </div>

            <h1>
              <span className="dark-heading">CONNECT.</span>
              <span className="gradient-heading">MANAGE. GROW.</span>
            </h1>

            <p className="hero-description">
              A centralized digital platform connecting students, faculty, and administration for a seamless, intelligent campus experience.
            </p>

            <div className="hero-buttons">
              <Link to="/register" className="primary-hero-btn">
                Get Started
                <ArrowRight size={18} />
              </Link>

              <a href="#features" className="secondary-hero-btn">
                Explore Platform
                <span>↘</span>
              </a>
            </div>

            <div className="hero-mini-stats">
              <div className="mini-stat">
                <strong>10K+</strong>
                <span>Students Connected</span>
              </div>

              <div className="mini-stat">
                <strong>500+</strong>
                <span>Faculty Members</span>
              </div>

              <div className="mini-stat">
                <strong>50+</strong>
                <span>Academic Depts</span>
              </div>
            </div>
          </div>

          {/* RIGHT GRAPHIC / INTERACTIVE MOCKUP */}
          <div className="hero-graphic-wrapper">
            <div className="dashboard-card-mockup">
              <div className="mockup-header">
                <div>
                  <small>CAMPUSCONNECT DASHBOARD</small>
                  <h3>Institution Control Hub</h3>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ background: "#1e293b", padding: "6px", borderRadius: "50%" }}>
                    <Bell size={16} className="text-sky-400" />
                  </div>
                  <div style={{ background: "#2563eb", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>
                    Active
                  </div>
                </div>
              </div>

              {/* Overview Card */}
              <div style={{ background: "linear-gradient(135deg, #1e3a8a, #2563eb)", borderRadius: "12px", padding: "20px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <small style={{ color: "#93c5fd", fontWeight: "600" }}>Campus System Status</small>
                  <h4 style={{ fontSize: "18px", fontWeight: "700", margin: "4px 0" }}>All Services Operational</h4>
                  <p style={{ fontSize: "12px", color: "#e0f2fe", margin: 0 }}>Attendance, Exams & Placements in Sync</p>
                </div>
                <ShieldCheck size={36} style={{ color: "#60a5fa" }} />
              </div>

              {/* Metric Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div style={{ background: "#1e293b", padding: "14px", borderRadius: "10px", textAlign: "center" }}>
                  <Users size={18} style={{ color: "#38bdf8", margin: "0 auto 4px" }} />
                  <strong style={{ display: "block", fontSize: "18px", color: "#ffffff" }}>2,450</strong>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>Students</span>
                </div>

                <div style={{ background: "#1e293b", padding: "14px", borderRadius: "10px", textAlign: "center" }}>
                  <GraduationCap size={18} style={{ color: "#a855f7", margin: "0 auto 4px" }} />
                  <strong style={{ display: "block", fontSize: "18px", color: "#ffffff" }}>94.2%</strong>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>Attendance</span>
                </div>

                <div style={{ background: "#1e293b", padding: "14px", borderRadius: "10px", textAlign: "center" }}>
                  <CheckCircle2 size={18} style={{ color: "#34d399", margin: "0 auto 4px" }} />
                  <strong style={{ display: "block", fontSize: "18px", color: "#ffffff" }}>91%</strong>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>Placed</span>
                </div>
              </div>
            </div>

            {/* Floating Pill */}
            <div className="floating-stat-pill">
              <CalendarDays size={20} className="text-blue-600" />
              <div>
                <strong style={{ display: "block", fontSize: "13px", lineHeight: "1.2" }}>Placement Drive</strong>
                <small style={{ color: "#64748b", fontSize: "11px" }}>TCS Campus Drive • Today</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;