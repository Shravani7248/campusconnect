import { ArrowLeft, BarChart3, TrendingUp, Users, BriefcaseBusiness, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

function Analytics() {
  return (
    <div className="dashboard-content">
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <Link to="/dashboard" className="secondary-hero-btn" style={{ padding: "8px 16px", fontSize: "14px" }}>
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", background: "#ffffff", padding: "28px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
          <div>
            <span className="dashboard-badge">INSTITUTION INSIGHTS</span>
            <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", marginTop: "4px" }}>Campus Analytics</h1>
            <p style={{ color: "#64748b", fontSize: "15px", marginTop: "4px" }}>
              Visual insights on student performance, academic growth, and corporate placement trends.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "14px", background: "#f8fafc", padding: "16px 24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <TrendingUp size={28} className="text-blue-600" />
            <div>
              <strong style={{ display: "block", fontSize: "22px", color: "#0f172a", lineHeight: "1" }}>+18.6%</strong>
              <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Annual Growth</span>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-panel">
            <div className="panel-header">
              <div>
                <h2>Placement Distribution</h2>
                <p>Corporate recruitment breakdown by department</p>
              </div>
              <BarChart3 size={20} className="text-blue-600" />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "20px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
                  <span>Computer Engineering</span>
                  <span>95% Placed (140 / 147)</span>
                </div>
                <div style={{ height: "10px", background: "#f1f5f9", borderRadius: "6px", overflow: "hidden" }}>
                  <div style={{ width: "95%", height: "100%", background: "#2563eb" }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
                  <span>Information Technology</span>
                  <span>92% Placed (115 / 125)</span>
                </div>
                <div style={{ height: "10px", background: "#f1f5f9", borderRadius: "6px", overflow: "hidden" }}>
                  <div style={{ width: "92%", height: "100%", background: "#38bdf8" }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
                  <span>Electronics & Telecommunication</span>
                  <span>86% Placed (90 / 105)</span>
                </div>
                <div style={{ height: "10px", background: "#f1f5f9", borderRadius: "6px", overflow: "hidden" }}>
                  <div style={{ width: "86%", height: "100%", background: "#a855f7" }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-panel">
            <div className="panel-header">
              <div>
                <h2>Key Highlights</h2>
                <p>Summary of institutional milestones</p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ padding: "14px", background: "#eff6ff", borderRadius: "10px", display: "flex", gap: "12px", alignItems: "center" }}>
                <Users size={20} className="text-blue-600" />
                <div>
                  <strong style={{ display: "block", fontSize: "14px", color: "#1e3a8a" }}>Student Retention</strong>
                  <span style={{ fontSize: "12px", color: "#3b82f6" }}>98.4% completion rate</span>
                </div>
              </div>

              <div style={{ padding: "14px", background: "#f0fdf4", borderRadius: "10px", display: "flex", gap: "12px", alignItems: "center" }}>
                <BriefcaseBusiness size={20} className="text-emerald-600" />
                <div>
                  <strong style={{ display: "block", fontSize: "14px", color: "#065f46" }}>Average Package</strong>
                  <span style={{ fontSize: "12px", color: "#10b981" }}>INR 7.4 LPA Highest: 24 LPA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;