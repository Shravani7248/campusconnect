import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudents, createStudent, deleteStudent, clearStudentError, clearStudentSuccess } from "../redux/slices/studentSlice";
import {
  ArrowLeft,
  Plus,
  Search,
  X,
  Users,
  Trash2,
  Lock,
} from "lucide-react";
import { Link } from "react-router-dom";

function Students() {
  const dispatch = useDispatch();

  const { list: students, loading, error, successMessage } = useSelector(
    (state) => state.students
  );
  const { user: reduxUser } = useSelector((state) => state.auth);

  let user = reduxUser;
  if (!user) {
    try {
      const stored = localStorage.getItem("campusconnect_user");
      user = stored ? JSON.parse(stored) : null;
    } catch {
      user = null;
    }
  }

  const role = (user?.role || "student").toLowerCase();
  const canModify = role === "admin" || role === "administrator" || role === "faculty";

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const [student, setStudent] = useState({
    name: "",
    email: "",
    department: "",
    year: "",
    rollNo: "",
  });

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearStudentError());
        dispatch(clearStudentSuccess());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(createStudent(student));
    if (createStudent.fulfilled.match(result)) {
      setStudent({
        name: "",
        email: "",
        department: "",
        year: "",
        rollNo: "",
      });
      setShowForm(false);
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteStudent(id));
  };

  const filteredStudents = students.filter((item) =>
    `${item.name} ${item.email} ${item.department} ${item.rollNo || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-content">
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* TOPBAR */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <Link to="/dashboard" className="secondary-hero-btn" style={{ padding: "8px 16px", fontSize: "14px" }}>
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          {canModify ? (
            <button
              className="add-student-btn"
              onClick={() => setShowForm(true)}
            >
              <Plus size={18} />
              Add Student Record
            </button>
          ) : (
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#64748b", background: "#f1f5f9", padding: "6px 12px", borderRadius: "8px" }}>
              <Lock size={14} />
              Read-Only Access
            </div>
          )}
        </div>

        {/* Notifications */}
        {error && (
          <div style={{ padding: "12px 16px", backgroundColor: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "10px", color: "#dc2626", fontSize: "14px", marginBottom: "20px" }}>
            {error}
          </div>
        )}

        {successMessage && (
          <div style={{ padding: "12px 16px", backgroundColor: "#f0fdf4", border: "1px solid #86efac", borderRadius: "10px", color: "#16a34a", fontSize: "14px", marginBottom: "20px" }}>
            {successMessage}
          </div>
        )}

        {/* HEADER */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", background: "#ffffff", padding: "28px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
          <div>
            <span className="dashboard-badge">STUDENT DIRECTORY</span>
            <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", marginTop: "4px" }}>Student Records</h1>
            <p style={{ color: "#64748b", fontSize: "15px", marginTop: "4px" }}>
              {canModify
                ? "Manage student enrollments, academic details, and institutional profiles."
                : "View enrolled student profiles and academic department listings."}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "14px", background: "#f8fafc", padding: "16px 24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <Users size={28} className="text-blue-600" />
            <div>
              <strong style={{ display: "block", fontSize: "22px", color: "#0f172a", lineHeight: "1" }}>{students.length}</strong>
              <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Total Students</span>
            </div>
          </div>
        </div>

        {/* SEARCH FILTER */}
        <div className="dashboard-search" style={{ width: "100%", maxWidth: "480px", marginBottom: "24px", padding: "10px 18px" }}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search students by name, roll number, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="students-table-wrapper" style={{ background: "#ffffff" }}>
          <table className="students-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll No.</th>
                <th>Department</th>
                <th>Year</th>
                <th>Email</th>
                {canModify && <th>Actions</th>}
              </tr>
            </thead>

            <tbody>
              {loading && students.length === 0 ? (
                <tr>
                  <td colSpan={canModify ? "6" : "5"} style={{ textAlign: "center", padding: "32px", color: "#64748b" }}>
                    Loading student records...
                  </td>
                </tr>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div className="profile-avatar" style={{ width: "36px", height: "36px", fontSize: "14px" }}>
                          {item.name ? item.name.charAt(0).toUpperCase() : "S"}
                        </div>
                        <strong style={{ color: "#0f172a" }}>{item.name}</strong>
                      </div>
                    </td>

                    <td><code style={{ background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px", fontSize: "13px" }}>{item.rollNo || "N/A"}</code></td>
                    <td>{item.department}</td>
                    <td><span style={{ background: "#eff6ff", color: "#1d4ed8", padding: "2px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }}>{item.year}</span></td>
                    <td>{item.email}</td>

                    {canModify && (
                      <td>
                        <button
                          className="delete-student-btn"
                          onClick={() => handleDelete(item._id)}
                          title="Delete Student Record"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={canModify ? "6" : "5"} style={{ textAlign: "center", padding: "32px", color: "#64748b" }}>
                    No matching student records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ADD STUDENT MODAL */}
        {showForm && (
          <div className="student-modal-overlay">
            <div className="student-modal">
              <div className="student-modal-header">
                <div>
                  <span className="dashboard-badge">NEW ENROLLMENT</span>
                  <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a" }}>Add Student Record</h2>
                  <p style={{ fontSize: "13px", color: "#64748b" }}>Enter student details to add to database.</p>
                </div>

                <button
                  onClick={() => setShowForm(false)}
                  style={{ color: "#64748b", padding: "4px" }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="student-form-grid">
                  <div className="auth-field">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={student.name}
                      onChange={handleChange}
                      placeholder="Enter student full name"
                      required
                    />
                  </div>

                  <div className="auth-field">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={student.email}
                      onChange={handleChange}
                      placeholder="student@campusconnect.edu"
                      required
                    />
                  </div>

                  <div className="auth-field">
                    <label>Roll Number</label>
                    <input
                      type="text"
                      name="rollNo"
                      value={student.rollNo}
                      onChange={handleChange}
                      placeholder="e.g. CS2026-042"
                      required
                    />
                  </div>

                  <div className="auth-field">
                    <label>Department</label>
                    <select
                      name="department"
                      value={student.department}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Department</option>
                      <option value="Computer Engineering">Computer Engineering</option>
                      <option value="Electronics & Telecommunication">Electronics & Telecommunication</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                    </select>
                  </div>

                  <div className="auth-field" style={{ gridColumn: "span 2" }}>
                    <label>Academic Year</label>
                    <select
                      name="year"
                      value={student.year}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Academic Year</option>
                      <option value="First Year">First Year</option>
                      <option value="Second Year">Second Year</option>
                      <option value="Third Year">Third Year</option>
                      <option value="Final Year">Final Year</option>
                    </select>
                  </div>
                </div>

                <div className="student-form-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="add-student-btn"
                    disabled={loading}
                  >
                    <Plus size={18} />
                    {loading ? "Adding Record..." : "Save Student"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Students;