import { useState } from "react";
import { ArrowLeft, User, Bell, Shield, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Settings() {
  const { user } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: user?.name || "Campus User",
    email: user?.email || "user@campusconnect.edu",
    emailAlerts: true,
    securityAlerts: true,
  });

  const [savedMsg, setSavedMsg] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSavedMsg("Account preferences updated successfully!");
    setTimeout(() => setSavedMsg(""), 3000);
  };

  return (
    <div className="dashboard-content">
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <Link to="/dashboard" className="secondary-hero-btn" style={{ padding: "8px 16px", fontSize: "14px" }}>
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>

        {savedMsg && (
          <div style={{ padding: "12px 16px", backgroundColor: "#f0fdf4", border: "1px solid #86efac", borderRadius: "10px", color: "#16a34a", fontSize: "14px", marginBottom: "20px" }}>
            {savedMsg}
          </div>
        )}

        <div className="dashboard-panel">
          <div className="panel-header">
            <div>
              <span className="dashboard-badge">PREFERENCES</span>
              <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", marginTop: "4px" }}>Account Settings</h1>
            </div>
          </div>

          <form onSubmit={handleSave} style={{ marginTop: "24px" }}>
            <div className="auth-field">
              <label><User size={14} style={{ display: "inline", marginRight: "6px" }} /> Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required />
            </div>

            <div className="auth-field">
              <label>Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} disabled style={{ background: "#f1f5f9", cursor: "not-allowed" }} />
              <small style={{ fontSize: "11px", color: "#64748b" }}>Email address is verified and tied to your account identity.</small>
            </div>

            <div style={{ margin: "24px 0", borderTop: "1px solid #e2e8f0", paddingTop: "20px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "12px" }}>Notification Preferences</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#334155", cursor: "pointer" }}>
                  <input type="checkbox" name="emailAlerts" checked={form.emailAlerts} onChange={handleChange} />
                  <span>Receive email alerts for new campus announcements and exam dates</span>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#334155", cursor: "pointer" }}>
                  <input type="checkbox" name="securityAlerts" checked={form.securityAlerts} onChange={handleChange} />
                  <span>Security alerts when logging in from a new device</span>
                </label>
              </div>
            </div>

            <button type="submit" className="add-student-btn" style={{ width: "100%", justifyContent: "center" }}>
              <Save size={18} /> Save Settings
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Settings;