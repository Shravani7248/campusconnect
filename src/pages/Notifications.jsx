import { useState } from "react";
import { ArrowLeft, Bell, Check, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

function Notifications() {
  const [list, setList] = useState([
    { id: 1, title: "Semester Exam Schedule Published", message: "End-semester examination timetable and hall ticket links are now available.", time: "2h ago", unread: true },
    { id: 2, title: "Placement Drive Announced", message: "TCS & Infosys recruitment drive registration opens tomorrow at 10:00 AM.", time: "4h ago", unread: true },
    { id: 3, title: "Attendance Threshold Alert", message: "Monthly attendance records updated. Minimum 75% attendance required for practicals.", time: "1d ago", unread: false },
  ]);

  const markAllRead = () => setList((prev) => prev.map((n) => ({ ...n, unread: false })));
  const clearAll = () => setList([]);

  return (
    <div className="dashboard-content">
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <Link to="/dashboard" className="secondary-hero-btn" style={{ padding: "8px 16px", fontSize: "14px" }}>
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <div style={{ display: "flex", gap: "10px" }}>
            <button className="secondary-hero-btn" onClick={markAllRead} style={{ fontSize: "13px", padding: "6px 12px" }}>
              <Check size={14} /> Mark All Read
            </button>
            <button className="secondary-hero-btn" onClick={clearAll} style={{ fontSize: "13px", padding: "6px 12px", color: "#ef4444" }}>
              <Trash2 size={14} /> Clear
            </button>
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="panel-header">
            <div>
              <span className="dashboard-badge">SYSTEM ALERTS</span>
              <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", marginTop: "4px" }}>Notifications</h1>
            </div>
            <Bell size={24} className="text-blue-600" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "20px" }}>
            {list.length > 0 ? (
              list.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: "16px",
                    borderRadius: "12px",
                    background: item.unread ? "#eff6ff" : "#f8fafc",
                    border: `1px solid ${item.unread ? "#bfdbfe" : "#e2e8f0"}`,
                    display: "flex",
                    alignItems: "flex-start",
                    justifySpace: "between",
                  }}
                >
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                      <strong style={{ fontSize: "15px", color: "#0f172a" }}>{item.title}</strong>
                      {item.unread && (
                        <span style={{ background: "#2563eb", color: "#ffffff", padding: "2px 8px", borderRadius: "10px", fontSize: "10px", fontWeight: "700" }}>NEW</span>
                      )}
                    </div>
                    <p style={{ fontSize: "13px", color: "#475569", margin: 0 }}>{item.message}</p>
                  </div>
                  <span style={{ fontSize: "12px", color: "#64748b", whiteSpace: "nowrap" }}>{item.time}</span>
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "32px", color: "#64748b" }}>No notifications at this time.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notifications;