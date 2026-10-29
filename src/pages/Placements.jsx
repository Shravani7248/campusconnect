import { useState } from "react";
import { ArrowLeft, BriefcaseBusiness, Plus, Search, X, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Placements() {
  const { user } = useSelector((state) => state.auth);
  const role = (user?.role || "student").toLowerCase();
  const canManage = role === "admin" || role === "administrator" || role === "faculty";

  const [showForm, setShowForm] = useState(false);
  const [appliedIds, setAppliedIds] = useState([]);
  const [drives, setDrives] = useState([
    { id: 1, company: "Tata Consultancy Services (TCS)", role: "Software Development Engineer", pkg: "7.5 LPA", location: "Pune / Mumbai", date: "2026-09-10", eligibility: "CGPA 7.0+" },
    { id: 2, company: "Infosys Technologies", role: "Systems Engineer", pkg: "6.8 LPA", location: "Bengaluru", date: "2026-09-15", eligibility: "CGPA 6.5+" },
    { id: 3, company: "Accenture", role: "Application Development Analyst", pkg: "8.2 LPA", location: "Hyderabad / Pune", date: "2026-09-22", eligibility: "CGPA 7.5+" },
  ]);

  const [search, setSearch] = useState("");
  const [newDrive, setNewDrive] = useState({ company: "", role: "", pkg: "", location: "", date: "", eligibility: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDrive((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setDrives((prev) => [...prev, { ...newDrive, id: Date.now() }]);
    setNewDrive({ company: "", role: "", pkg: "", location: "", date: "", eligibility: "" });
    setShowForm(false);
  };

  const handleApply = (id) => {
    if (!appliedIds.includes(id)) {
      setAppliedIds((prev) => [...prev, id]);
    }
  };

  const filtered = drives.filter((d) =>
    `${d.company} ${d.role} ${d.location}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-content">
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <Link to="/dashboard" className="secondary-hero-btn" style={{ padding: "8px 16px", fontSize: "14px" }}>
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          {canManage && (
            <button className="add-student-btn" onClick={() => setShowForm(true)}>
              <Plus size={18} />
              Add Placement Drive
            </button>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", background: "#ffffff", padding: "28px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
          <div>
            <span className="dashboard-badge">CAREER & PLACEMENTS</span>
            <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", marginTop: "4px" }}>Placement Opportunities</h1>
            <p style={{ color: "#64748b", fontSize: "15px", marginTop: "4px" }}>
              Explore corporate recruitment drives, salary packages, eligibility criteria, and interview dates.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "14px", background: "#f8fafc", padding: "16px 24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <BriefcaseBusiness size={28} className="text-emerald-600" />
            <div>
              <strong style={{ display: "block", fontSize: "22px", color: "#0f172a", lineHeight: "1" }}>386</strong>
              <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Offers Issued</span>
            </div>
          </div>
        </div>

        <div className="dashboard-search" style={{ width: "100%", maxWidth: "480px", marginBottom: "24px", padding: "10px 18px" }}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search company, job role, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="cards-grid">
          {filtered.map((d) => {
            const isApplied = appliedIds.includes(d.id);
            return (
              <div key={d.id} className="feature-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                    <span style={{ background: "#ecfdf5", color: "#047857", padding: "4px 10px", borderRadius: "20px", fontWeight: "700", fontSize: "12px" }}>
                      Package: {d.pkg}
                    </span>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>Drive Date: <strong>{d.date}</strong></span>
                  </div>

                  <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", marginBottom: "6px" }}>{d.company}</h3>
                  <h4 style={{ fontSize: "14px", fontWeight: "600", color: "#2563eb", marginBottom: "12px" }}>{d.role}</h4>
                  <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>Location: {d.location} • Eligibility: {d.eligibility}</p>
                </div>

                <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "12px", color: "#10b981", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}>
                    <CheckCircle size={14} /> Open for Applications
                  </span>
                  <button
                    onClick={() => handleApply(d.id)}
                    className="primary-hero-btn"
                    style={{
                      padding: "6px 14px",
                      fontSize: "12px",
                      background: isApplied ? "#10b981" : "#0f172a",
                    }}
                  >
                    {isApplied ? "✓ Application Submitted" : "Apply Now →"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {showForm && (
          <div className="student-modal-overlay">
            <div className="student-modal">
              <div className="student-modal-header">
                <div>
                  <span className="dashboard-badge">CORPORATE DRIVE</span>
                  <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a" }}>Add Placement Drive</h2>
                </div>
                <button onClick={() => setShowForm(false)} style={{ color: "#64748b" }}><X size={20} /></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="student-form-grid">
                  <div className="auth-field">
                    <label>Company Name</label>
                    <input type="text" name="company" value={newDrive.company} onChange={handleChange} placeholder="e.g. Google" required />
                  </div>
                  <div className="auth-field">
                    <label>Job Designation</label>
                    <input type="text" name="role" value={newDrive.role} onChange={handleChange} placeholder="e.g. Software Engineer" required />
                  </div>
                  <div className="auth-field">
                    <label>Salary Package</label>
                    <input type="text" name="pkg" value={newDrive.pkg} onChange={handleChange} placeholder="e.g. 12 LPA" required />
                  </div>
                  <div className="auth-field">
                    <label>Location</label>
                    <input type="text" name="location" value={newDrive.location} onChange={handleChange} placeholder="e.g. Bengaluru" required />
                  </div>
                </div>

                <div className="student-form-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="add-student-btn"><Plus size={18} /> Publish Drive</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Placements;