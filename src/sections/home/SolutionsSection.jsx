import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function SolutionsSection() {
  const problems = [
    "Scattered student records across multiple spreadsheets and legacy databases",
    "Manual paper-based academic workflows causing delays in communication",
    "Unsecured registration allowing unverified users to compromise campus data",
    "Lack of real-time visibility into placement drives and student performance",
  ];

  const solutions = [
    "Centralized MongoDB database unifying student, faculty, and administrative data",
    "Automated email OTP verification ensuring 100% verified student accounts",
    "Role-based security enforcing strict permission checks across all API routes",
    "Real-time analytics and placement tracking with intuitive visual dashboards",
  ];

  return (
    <section className="section-dark" id="solutions">
      <div className="container">
        <div className="section-header">
          <span className="section-badge" style={{ color: "#38bdf8" }}>PROBLEM & SOLUTION</span>
          <h2 style={{ color: "#ffffff" }}>Why Institutions Choose CampusConnect</h2>
          <p style={{ color: "#94a3b8" }}>
            Transforming traditional, fragmented campus management into a streamlined, digital SaaS ecosystem.
          </p>
        </div>

        <div className="solutions-cards-grid">
          {/* Problems Card */}
          <div className="solutions-card problem-card">
            <h3 style={{ color: "#f87171", fontSize: "20px", fontWeight: "700", marginBottom: "20px" }}>
              The Traditional Challenge
            </h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "14px" }}>
              {problems.map((p, idx) => (
                <li key={idx} style={{ color: "#94a3b8", fontSize: "14px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <span style={{ color: "#ef4444", fontWeight: "bold" }}>✕</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions Card */}
          <div className="solutions-card solution-card">
            <h3 style={{ color: "#60a5fa", fontSize: "20px", fontWeight: "700", marginBottom: "20px" }}>
              The CampusConnect Solution
            </h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "14px" }}>
              {solutions.map((s, idx) => (
                <li key={idx} style={{ color: "#f8fafc", fontSize: "14px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <CheckCircle2 size={18} style={{ color: "#10b981", flexShrink: 0, marginTop: "2px" }} />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <Link to="/register" className="primary-hero-btn" style={{ background: "#2563eb", display: "inline-flex" }}>
            Deploy CampusConnect Today
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default SolutionsSection;