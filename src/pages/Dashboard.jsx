import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
import api from "../services/api";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BriefcaseBusiness,
  CalendarDays,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  ArrowUpRight,
  Shield,
  BookOpen,
  Plus,
  Trash2,
  CheckCircle2,
  Menu,
  X,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// Graphical Analytics Datasets for System Administrator Dashboard
const monthlyTrendData = [
  { month: "Jan", students: 1200, placements: 45 },
  { month: "Feb", students: 1450, placements: 95 },
  { month: "Mar", students: 1800, placements: 180 },
  { month: "Apr", students: 2150, placements: 290 },
  { month: "May", students: 2450, placements: 386 },
];

const departmentDistData = [
  { dept: "Computer", count: 720, fill: "#2563eb" },
  { dept: "IT", count: 540, fill: "#38bdf8" },
  { dept: "ENTC", count: 480, fill: "#a855f7" },
  { dept: "Mechanical", count: 390, fill: "#f59e0b" },
  { dept: "Electrical", count: 320, fill: "#10b981" },
];

const rolePieData = [
  { name: "Students", value: 2450, color: "#2563eb" },
  { name: "Faculty", value: 142, color: "#f59e0b" },
  { name: "Administrators", value: 18, color: "#ef4444" },
];

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const userName = user?.name || "Campus User";
  const userRole = (user?.role || "student").toLowerCase();
  const isAdmin = userRole === "admin" || userRole === "administrator";
  const isFaculty = userRole === "faculty";
  const isStudent = !isAdmin && !isFaculty;

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [userSearchQuery, setUserSearchQuery] = useState("");

  // Fetch all users for Admin control center
  useEffect(() => {
    if (isAdmin) {
      const fetchAllUsers = async () => {
        try {
          setLoadingUsers(true);
          const res = await api.get("/users");
          if (res.data?.data) {
            setUsersList(res.data.data);
          }
        } catch (err) {
          console.error("Failed to fetch users list:", err.message);
        } finally {
          setLoadingUsers(false);
        }
      };
      fetchAllUsers();
    }
  }, [isAdmin]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      setUsersList((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user account?")) {
      try {
        await api.delete(`/users/${userId}`);
        setUsersList((prev) => prev.filter((u) => u._id !== userId));
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete user");
      }
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <div className="dashboard">
      {/* SIDEBAR */}
      <aside className={`dashboard-sidebar ${mobileSidebarOpen ? "open" : ""}`}>
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link to="/" className="dashboard-logo">
              <div className="dashboard-logo-box">C</div>
              <div>
                <div className="dashboard-logo-title">CampusConnect</div>
                <div className="dashboard-logo-subtitle">SMART CAMPUS</div>
              </div>
            </Link>
            <button className="mobile-menu-toggle" onClick={() => setMobileSidebarOpen(false)} style={{ color: "#ffffff", padding: "4px" }}>
              <X size={20} />
            </button>
          </div>

          <div className="dashboard-menu-title">MAIN NAVIGATION</div>

          <nav className="dashboard-nav">
            <Link to="/dashboard" className="active">
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>

            {(isAdmin || isFaculty) && (
              <Link to="/dashboard/students">
                <Users size={18} />
                <span>Students</span>
              </Link>
            )}

            <Link to="/dashboard/academics">
              <GraduationCap size={18} />
              <span>Academics</span>
            </Link>

            <Link to="/dashboard/placements">
              <BriefcaseBusiness size={18} />
              <span>Placements</span>
            </Link>

            <Link to="/dashboard/events">
              <CalendarDays size={18} />
              <span>Events</span>
            </Link>

            <Link to="/dashboard/analytics">
              <BarChart3 size={18} />
              <span>Analytics</span>
            </Link>
          </nav>
        </div>

        <div>
          <div className="dashboard-menu-title bottom-title">SETTINGS</div>
          <div className="dashboard-sidebar-bottom">
            <Link to="/dashboard/settings">
              <Settings size={18} />
              <span>Settings</span>
            </Link>

            <button onClick={handleLogout}>
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="dashboard-main">
        {/* TOPBAR */}
        <header className="dashboard-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button className="mobile-menu-toggle" onClick={() => setMobileSidebarOpen(true)}>
              <Menu size={22} />
            </button>

            <div className="dashboard-search">
              <Search size={16} />
              <input type="text" placeholder="Search campus, courses, students..." />
            </div>
          </div>

          <div className="dashboard-topbar-right">
            <Link to="/dashboard/notifications" className="notification-btn">
              <Bell size={18} />
              <span></span>
            </Link>

            <div className="dashboard-profile">
              <div className="profile-avatar">{userName.charAt(0).toUpperCase()}</div>
              <div className="profile-info">
                <strong>{userName}</strong>
                <span className={`role-badge-tag ${isAdmin ? "role-badge-admin" : isFaculty ? "role-badge-faculty" : "role-badge-student"}`}>
                  {isAdmin ? "Administrator" : isFaculty ? "Faculty" : "Student"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT BODY */}
        <section className="dashboard-content">
          {/* WELCOME HERO */}
          <div className="dashboard-welcome-section">
            <div>
              <span className="dashboard-badge">
                {isAdmin ? "SYSTEM CONTROL CENTER" : isFaculty ? "FACULTY PORTAL" : "STUDENT ACADEMIC HUB"}
              </span>
              <h1>
                Welcome back, <span>{userName}</span>
              </h1>
              <p>
                {isAdmin
                  ? "Manage institution governance, user accounts, and campus-wide metrics."
                  : isFaculty
                  ? "Track your assigned courses, student attendance, and academic activities."
                  : "View your active courses, upcoming deadlines, academic progress, and campus news."}
              </p>
            </div>

            <Link to="/dashboard/analytics" className="dashboard-primary-btn">
              View Analytics
              <ArrowUpRight size={16} />
            </Link>
          </div>

          {/* ROLE-TAILORED STATS */}
          <div className="dashboard-stats">
            {isAdmin ? (
              <>
                <Link to="/dashboard/students" className="dashboard-stat-card" style={{ textDecoration: "none" }}>
                  <div className="stat-top">
                    <div className="dashboard-stat-icon"><Users size={20} /></div>
                    <span className="stat-growth">+12%</span>
                  </div>
                  <span className="stat-label">Total Students</span>
                  <strong className="stat-number">2,450</strong>
                  <small>Registered across departments</small>
                </Link>

                <Link to="/dashboard/students" className="dashboard-stat-card" style={{ textDecoration: "none" }}>
                  <div className="stat-top">
                    <div className="dashboard-stat-icon"><Shield size={20} /></div>
                    <span className="stat-growth">Active</span>
                  </div>
                  <span className="stat-label">Faculty Members</span>
                  <strong className="stat-number">142</strong>
                  <small>Verified teaching staff</small>
                </Link>

                <Link to="/dashboard/academics" className="dashboard-stat-card" style={{ textDecoration: "none" }}>
                  <div className="stat-top">
                    <div className="dashboard-stat-icon"><GraduationCap size={20} /></div>
                    <span className="stat-growth">18</span>
                  </div>
                  <span className="stat-label">Departments</span>
                  <strong className="stat-number">18</strong>
                  <small>Engineering & Technology</small>
                </Link>

                <Link to="/dashboard/placements" className="dashboard-stat-card" style={{ textDecoration: "none" }}>
                  <div className="stat-top">
                    <div className="dashboard-stat-icon"><BriefcaseBusiness size={20} /></div>
                    <span className="stat-growth">91.2%</span>
                  </div>
                  <span className="stat-label">Placement Rate</span>
                  <strong className="stat-number">386</strong>
                  <small>Offers this session</small>
                </Link>
              </>
            ) : isFaculty ? (
              <>
                <div className="dashboard-stat-card">
                  <div className="stat-top">
                    <div className="dashboard-stat-icon"><BookOpen size={20} /></div>
                    <span className="stat-growth">Active</span>
                  </div>
                  <span className="stat-label">Assigned Classes</span>
                  <strong className="stat-number">4</strong>
                  <small>Semester 6 & 8</small>
                </div>

                <div className="dashboard-stat-card">
                  <div className="stat-top">
                    <div className="dashboard-stat-icon"><Users size={20} /></div>
                    <span className="stat-growth">180</span>
                  </div>
                  <span className="stat-label">Students Managed</span>
                  <strong className="stat-number">180</strong>
                  <small>Enrolled in your courses</small>
                </div>

                <div className="dashboard-stat-card">
                  <div className="stat-top">
                    <div className="dashboard-stat-icon"><GraduationCap size={20} /></div>
                    <span className="stat-growth">92.4%</span>
                  </div>
                  <span className="stat-label">Avg Attendance</span>
                  <strong className="stat-number">92.4%</strong>
                  <small>Across all subjects</small>
                </div>

                <div className="dashboard-stat-card">
                  <div className="stat-top">
                    <div className="dashboard-stat-icon"><CalendarDays size={20} /></div>
                    <span className="stat-growth">+3</span>
                  </div>
                  <span className="stat-label">Upcoming Lectures</span>
                  <strong className="stat-number">6</strong>
                  <small>This week</small>
                </div>
              </>
            ) : (
              <>
                <div className="dashboard-stat-card">
                  <div className="stat-top">
                    <div className="dashboard-stat-icon"><BookOpen size={20} /></div>
                    <span className="stat-growth">Current</span>
                  </div>
                  <span className="stat-label">Enrolled Courses</span>
                  <strong className="stat-number">6</strong>
                  <small>Computer Engineering</small>
                </div>

                <div className="dashboard-stat-card">
                  <div className="stat-top">
                    <div className="dashboard-stat-icon"><CheckCircle2 size={20} /></div>
                    <span className="stat-growth">+2.1%</span>
                  </div>
                  <span className="stat-label">Overall Attendance</span>
                  <strong className="stat-number">94.2%</strong>
                  <small>Eligible for exams</small>
                </div>

                <div className="dashboard-stat-card">
                  <div className="stat-top">
                    <div className="dashboard-stat-icon"><GraduationCap size={20} /></div>
                    <span className="stat-growth">Grade A</span>
                  </div>
                  <span className="stat-label">Academic CGPA</span>
                  <strong className="stat-number">8.84</strong>
                  <small>Out of 10.0</small>
                </div>

                <div className="dashboard-stat-card">
                  <div className="stat-top">
                    <div className="dashboard-stat-icon"><CalendarDays size={20} /></div>
                    <span className="stat-growth">4</span>
                  </div>
                  <span className="stat-label">Upcoming Events</span>
                  <strong className="stat-number">4</strong>
                  <small>Tech Fest & Workshops</small>
                </div>
              </>
            )}
          </div>

          {/* SYSTEM ADMINISTRATOR GRAPHICAL CONTROL HUB */}
          {isAdmin && (
            <>
              {/* GRAPHICAL ROW 1: REGISTRATION & PLACEMENT TRENDS + DEPARTMENT DISTRIBUTION */}
              <div className="dashboard-grid" style={{ marginBottom: "32px" }}>
                {/* Graph 1: Growth Velocity (Area Chart) */}
                <div className="dashboard-panel">
                  <div className="panel-header">
                    <div>
                      <h2>Registration & Placement Trajectory</h2>
                      <p>Monthly growth velocity for student enrolments & job offers</p>
                    </div>
                    <BarChart3 size={20} className="text-blue-600" />
                  </div>

                  <div style={{ width: "100%", height: "260px", marginTop: "16px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
                          </linearGradient>
                          <linearGradient id="colorPlacements" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                        <Tooltip
                          contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "10px", color: "#ffffff", fontSize: "13px" }}
                          itemStyle={{ color: "#38bdf8" }}
                        />
                        <Area type="monotone" dataKey="students" name="Students" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
                        <Area type="monotone" dataKey="placements" name="Placements" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPlacements)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Graph 2: Department Student Distribution (Bar Chart) */}
                <div className="dashboard-panel">
                  <div className="panel-header">
                    <div>
                      <h2>Department Distribution</h2>
                      <p>Student enrolment breakdown across engineering streams</p>
                    </div>
                    <GraduationCap size={20} className="text-purple-600" />
                  </div>

                  <div style={{ width: "100%", height: "260px", marginTop: "16px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={departmentDistData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="dept" stroke="#64748b" fontSize={11} tickLine={false} />
                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                        <Tooltip
                          contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "10px", color: "#ffffff", fontSize: "13px" }}
                        />
                        <Bar dataKey="count" name="Enrolled Students" radius={[6, 6, 0, 0]}>
                          {departmentDistData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* GRAPHICAL ROW 2: USER ROLE DONUT & TELEMETRY GAUGES */}
              <div className="dashboard-grid" style={{ marginBottom: "32px" }}>
                {/* Graph 3: User Role Distribution (Donut Chart) */}
                <div className="dashboard-panel">
                  <div className="panel-header">
                    <div>
                      <h2>User Role Breakdown</h2>
                      <p>Proportion of Students, Faculty, and System Administrators</p>
                    </div>
                    <Users size={20} className="text-blue-600" />
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", marginTop: "12px" }}>
                    <div style={{ width: "180px", height: "180px", position: "relative" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={rolePieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {rolePieData.map((entry, index) => (
                              <Cell key={`pie-cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "10px", color: "#ffffff", fontSize: "13px" }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                        <strong style={{ display: "block", fontSize: "20px", color: "#0f172a", lineHeight: "1" }}>2,610</strong>
                        <small style={{ fontSize: "10px", color: "#64748b", fontWeight: "700" }}>TOTAL USERS</small>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {rolePieData.map((r, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: r.color }}></span>
                          <div>
                            <strong style={{ display: "block", fontSize: "14px", color: "#0f172a" }}>{r.name}</strong>
                            <span style={{ fontSize: "12px", color: "#64748b" }}>{r.value.toLocaleString()} users ({((r.value / 2610) * 100).toFixed(1)}%)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Graph 4: Infrastructure & Telemetry Health Gauges */}
                <div className="dashboard-panel">
                  <div className="panel-header">
                    <div>
                      <h2>System Telemetry & Health Gauges</h2>
                      <p>Live operational status of backend services & databases</p>
                    </div>
                    <Shield size={20} className="text-emerald-600" />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "18px", marginTop: "12px" }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "700", marginBottom: "6px" }}>
                        <span style={{ color: "#0f172a" }}>Database Sync & Uptime</span>
                        <span style={{ color: "#10b981" }}>99.98% (Operational)</span>
                      </div>
                      <div style={{ height: "10px", background: "#f1f5f9", borderRadius: "9999px", overflow: "hidden" }}>
                        <div style={{ width: "99.98%", height: "100%", background: "linear-gradient(90deg, #10b981, #34d399)" }}></div>
                      </div>
                    </div>

                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "700", marginBottom: "6px" }}>
                        <span style={{ color: "#0f172a" }}>API Server Latency</span>
                        <span style={{ color: "#2563eb" }}>14 ms (Ultra-fast)</span>
                      </div>
                      <div style={{ height: "10px", background: "#f1f5f9", borderRadius: "9999px", overflow: "hidden" }}>
                        <div style={{ width: "92%", height: "100%", background: "linear-gradient(90deg, #2563eb, #38bdf8)" }}></div>
                      </div>
                    </div>

                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "700", marginBottom: "6px" }}>
                        <span style={{ color: "#0f172a" }}>Verified Student Accounts</span>
                        <span style={{ color: "#a855f7" }}>96.4% (Email Verified)</span>
                      </div>
                      <div style={{ height: "10px", background: "#f1f5f9", borderRadius: "9999px", overflow: "hidden" }}>
                        <div style={{ width: "96.4%", height: "100%", background: "linear-gradient(90deg, #a855f7, #c084fc)" }}></div>
                      </div>
                    </div>

                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "700", marginBottom: "6px" }}>
                        <span style={{ color: "#0f172a" }}>Placement Drive Conversion</span>
                        <span style={{ color: "#f59e0b" }}>91.2% Success</span>
                      </div>
                      <div style={{ height: "10px", background: "#f1f5f9", borderRadius: "9999px", overflow: "hidden" }}>
                        <div style={{ width: "91.2%", height: "100%", background: "linear-gradient(90deg, #f59e0b, #fbbf24)" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ADMIN USER MANAGEMENT PANEL */}
          {isAdmin && (
            <div className="dashboard-panel" style={{ marginBottom: "32px" }}>
              <div className="panel-header" style={{ flexWrap: "wrap", gap: "16px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                    <h2>User & Role Governance</h2>
                    <span style={{ background: "#eff6ff", color: "#2563eb", fontSize: "12px", fontWeight: "700", padding: "2px 10px", borderRadius: "9999px", border: "1px solid #bfdbfe" }}>
                      {usersList.length} Total Accounts
                    </span>
                  </div>
                  <p>Manage platform accounts and promote or demote user roles securely.</p>
                </div>

                <div className="dashboard-search" style={{ width: "260px" }}>
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Filter users..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="students-table-wrapper">
                <table className="students-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>System Role</th>
                      <th>Account Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingUsers ? (
                      <tr><td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>Loading users...</td></tr>
                    ) : usersList.filter(u => u.name?.toLowerCase().includes(userSearchQuery.toLowerCase()) || u.email?.toLowerCase().includes(userSearchQuery.toLowerCase())).length > 0 ? (
                      usersList
                        .filter(u => u.name?.toLowerCase().includes(userSearchQuery.toLowerCase()) || u.email?.toLowerCase().includes(userSearchQuery.toLowerCase()))
                        .map((u) => {
                          const isUserAdmin = u.role === "admin" || u.role === "administrator";
                          const isUserFaculty = u.role === "faculty";

                          return (
                            <tr key={u._id}>
                              <td>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                  <div className="profile-avatar" style={{ width: "36px", height: "36px", fontSize: "14px" }}>
                                    {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                                  </div>
                                  <div>
                                    <strong style={{ display: "block", fontSize: "14px", color: "#0f172a" }}>{u.name}</strong>
                                    <small style={{ fontSize: "11px", color: "#64748b" }}>ID: #{u._id?.substring(0, 8)}</small>
                                  </div>
                                </div>
                              </td>
                              <td style={{ fontWeight: "500" }}>{u.email}</td>
                              <td>
                                <select
                                  value={u.role}
                                  onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                  style={{
                                    padding: "6px 12px",
                                    borderRadius: "8px",
                                    border: isUserAdmin ? "1px solid #fca5a5" : isUserFaculty ? "1px solid #fde68a" : "1px solid #bfdbfe",
                                    background: isUserAdmin ? "#fee2e2" : isUserFaculty ? "#fef3c7" : "#eff6ff",
                                    color: isUserAdmin ? "#991b1b" : isUserFaculty ? "#92400e" : "#1e40af",
                                    fontSize: "13px",
                                    fontWeight: "700",
                                    outline: "none",
                                    cursor: "pointer"
                                  }}
                                >
                                  <option value="student">Student</option>
                                  <option value="faculty">Faculty</option>
                                  <option value="admin">Administrator</option>
                                </select>
                              </td>
                              <td>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#10b981", fontWeight: "600", fontSize: "12px", background: "#ecfdf5", padding: "4px 10px", borderRadius: "9999px", border: "1px solid #a7f3d0" }}>
                                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }}></span>
                                  Verified Active
                                </span>
                              </td>
                              <td>
                                <button className="delete-student-btn" onClick={() => handleDeleteUser(u._id)} title="Delete Account">
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                    ) : (
                      <tr><td colSpan="5" style={{ textAlign: "center", padding: "24px", color: "#64748b" }}>No matching user accounts found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MAIN GRID PANELS */}
          <div className="dashboard-grid">
            {/* LEFT PANEL */}
            <div className="dashboard-panel">
              <div className="panel-header">
                <div>
                  <h2>Campus Announcements</h2>
                  <p>Latest updates and notices across your institution</p>
                </div>
                <Link to="/dashboard/events" style={{ fontSize: "13px", color: "#2563eb", fontWeight: "600" }}>
                  View All →
                </Link>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ padding: "16px", borderRadius: "10px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                    <strong style={{ fontSize: "15px", color: "#0f172a" }}>Semester Examination Schedule Released</strong>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>2h ago</span>
                  </div>
                  <p style={{ fontSize: "13px", color: "#475569" }}>
                    The end-semester exam timetable is now published. Please review your exam hall tickets.
                  </p>
                </div>

                <div style={{ padding: "16px", borderRadius: "10px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                    <strong style={{ fontSize: "15px", color: "#0f172a" }}>Campus Placement Drive: TCS & Infosys</strong>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>5h ago</span>
                  </div>
                  <p style={{ fontSize: "13px", color: "#475569" }}>
                    Registration for the upcoming placement drive is open for final-year engineering students.
                  </p>
                </div>

                <div style={{ padding: "16px", borderRadius: "10px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                    <strong style={{ fontSize: "15px", color: "#0f172a" }}>Annual AI & ML Innovation Workshop</strong>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>1d ago</span>
                  </div>
                  <p style={{ fontSize: "13px", color: "#475569" }}>
                    Join industry experts for a 2-day hands-on workshop on generative AI and cloud technologies.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT QUICK ACTIONS PANEL */}
            <div className="dashboard-panel">
              <div className="panel-header">
                <div>
                  <h2>Quick Actions</h2>
                  <p>Frequently used tools</p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {(isAdmin || isFaculty) && (
                  <Link
                    to="/dashboard/students"
                    style={{ display: "flex", alignItems: "center", justifyBetween: "space-between", padding: "14px", background: "#eff6ff", borderRadius: "10px", color: "#1d4ed8", fontWeight: "600", fontSize: "14px" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <Users size={18} />
                      <span>Manage Students</span>
                    </div>
                    <ArrowUpRight size={16} />
                  </Link>
                )}

                <Link
                  to="/dashboard/academics"
                  style={{ display: "flex", alignItems: "center", justifyBetween: "space-between", padding: "14px", background: "#f5f3ff", borderRadius: "10px", color: "#6d28d9", fontWeight: "600", fontSize: "14px" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <GraduationCap size={18} />
                    <span>Academic Records</span>
                  </div>
                  <ArrowUpRight size={16} />
                </Link>

                <Link
                  to="/dashboard/placements"
                  style={{ display: "flex", alignItems: "center", justifyBetween: "space-between", padding: "14px", background: "#ecfdf5", borderRadius: "10px", color: "#047857", fontWeight: "600", fontSize: "14px" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <BriefcaseBusiness size={18} />
                    <span>Placement Portal</span>
                  </div>
                  <ArrowUpRight size={16} />
                </Link>

                <Link
                  to="/dashboard/events"
                  style={{ display: "flex", alignItems: "center", justifyBetween: "space-between", padding: "14px", background: "#fff7ed", borderRadius: "10px", color: "#c2410c", fontWeight: "600", fontSize: "14px" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <CalendarDays size={18} />
                    <span>Campus Events</span>
                  </div>
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;