import { useState } from "react";
import { ArrowLeft, GraduationCap, Plus, Search, X, BookOpen, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Academics() {
  const { user } = useSelector((state) => state.auth);
  const role = (user?.role || "student").toLowerCase();
  const canManage = role === "admin" || role === "administrator" || role === "faculty";

  const [showForm, setShowForm] = useState(false);
  const [courses, setCourses] = useState([
    { id: 1, code: "CS-601", name: "Advanced Data Structures & Algorithms", dept: "Computer Engineering", year: "Third Year", credits: 4, faculty: "Dr. A. Sharma" },
    { id: 2, code: "CS-602", name: "Database Management Systems", dept: "Computer Engineering", year: "Third Year", credits: 4, faculty: "Prof. R. Mehta" },
    { id: 3, code: "IT-701", name: "Cloud Computing & DevOps", dept: "Information Technology", year: "Final Year", credits: 3, faculty: "Dr. P. Verma" },
    { id: 4, code: "EX-503", name: "Embedded Systems & IoT", dept: "Electronics & Telecommunication", year: "Third Year", credits: 4, faculty: "Prof. S. Joshi" },
  ]);

  const [search, setSearch] = useState("");
  const [newCourse, setNewCourse] = useState({
    code: "",
    name: "",
    dept: "Computer Engineering",
    year: "Third Year",
    credits: 4,
    faculty: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCourses((prev) => [...prev, { ...newCourse, id: Date.now() }]);
    setNewCourse({ code: "", name: "", dept: "Computer Engineering", year: "Third Year", credits: 4, faculty: "" });
    setShowForm(false);
  };

  const filtered = courses.filter((c) =>
    `${c.code} ${c.name} ${c.dept} ${c.faculty}`.toLowerCase().includes(search.toLowerCase())
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
              Add Course
            </button>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", background: "#ffffff", padding: "28px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
          <div>
            <span className="dashboard-badge">ACADEMIC MANAGEMENT</span>
            <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", marginTop: "4px" }}>Course & Subject Roster</h1>
            <p style={{ color: "#64748b", fontSize: "15px", marginTop: "4px" }}>
              Explore academic curriculum, assigned faculty, credit allocations, and course schedules.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "14px", background: "#f8fafc", padding: "16px 24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <GraduationCap size={28} className="text-purple-600" />
            <div>
              <strong style={{ display: "block", fontSize: "22px", color: "#0f172a", lineHeight: "1" }}>{courses.length}</strong>
              <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Active Courses</span>
            </div>
          </div>
        </div>

        <div className="dashboard-search" style={{ width: "100%", maxWidth: "480px", marginBottom: "24px", padding: "10px 18px" }}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search course code, title, faculty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="cards-grid">
          {filtered.map((c) => (
            <div key={c.id} className="feature-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  <code style={{ background: "#eff6ff", color: "#1d4ed8", padding: "4px 8px", borderRadius: "6px", fontWeight: "700", fontSize: "12px" }}>{c.code}</code>
                  <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>{c.credits} Credits</span>
                </div>

                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>{c.name}</h3>
                <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>{c.dept} • {c.year}</p>
              </div>

              <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "12px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#334155" }}>
                <UserCheck size={16} className="text-emerald-600" />
                <span>Instructor: <strong>{c.faculty}</strong></span>
              </div>
            </div>
          ))}
        </div>

        {showForm && (
          <div className="student-modal-overlay">
            <div className="student-modal">
              <div className="student-modal-header">
                <div>
                  <span className="dashboard-badge">NEW CURRICULUM</span>
                  <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a" }}>Add Academic Course</h2>
                </div>
                <button onClick={() => setShowForm(false)} style={{ color: "#64748b" }}><X size={20} /></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="student-form-grid">
                  <div className="auth-field">
                    <label>Course Code</label>
                    <input type="text" name="code" value={newCourse.code} onChange={handleChange} placeholder="e.g. CS-501" required />
                  </div>
                  <div className="auth-field">
                    <label>Course Title</label>
                    <input type="text" name="name" value={newCourse.name} onChange={handleChange} placeholder="e.g. Computer Networks" required />
                  </div>
                  <div className="auth-field">
                    <label>Faculty Instructor</label>
                    <input type="text" name="faculty" value={newCourse.faculty} onChange={handleChange} placeholder="e.g. Dr. A. Kumar" required />
                  </div>
                  <div className="auth-field">
                    <label>Credits</label>
                    <input type="number" name="credits" value={newCourse.credits} onChange={handleChange} min="1" max="6" required />
                  </div>
                </div>

                <div className="student-form-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="add-student-btn"><Plus size={18} /> Add Course</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Academics;