import { GraduationCap, Users, ShieldCheck, Check } from "lucide-react";
import { Link } from "react-router-dom";

function RoleSection() {
  const roles = [
    {
      tag: "ROLE 01",
      title: "Student Experience",
      description:
        "Centralized portal for students to access courses, academic progress, notifications, and campus events.",
      icon: <GraduationCap size={28} className="text-blue-600" />,
      features: [
        "Personalized Academic Dashboard",
        "View Enrolled Courses & Schedule",
        "Instant Campus Announcements",
        "Event Registration & Reminders",
        "Secure Email & OTP Verification",
      ],
      cta: "Student Access",
      link: "/login",
    },
    {
      tag: "ROLE 02",
      title: "Faculty Control",
      description:
        "Streamlined tools for educators to manage classes, record attendance, track student progress, and publish notices.",
      icon: <Users size={28} className="text-purple-600" />,
      features: [
        "Faculty Dashboard & Metrics",
        "Class & Course Roster Management",
        "Academic Announcements",
        "Student Progress Monitoring",
        "Departmental Collaboration",
      ],
      cta: "Faculty Access",
      link: "/login",
    },
    {
      tag: "ROLE 03",
      title: "Administrator Command",
      description:
        "Full campus administration capabilities to oversee departments, manage user roles, and monitor institution statistics.",
      icon: <ShieldCheck size={28} className="text-emerald-600" />,
      features: [
        "Full User & Role Governance",
        "Student CRUD Management",
        "Institution Analytics & Reports",
        "Departmental Administration",
        "Role-Based Security Enforcement",
      ],
      cta: "Admin Access",
      link: "/login",
    },
  ];

  return (
    <section className="section-wrapper" id="roles">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">ROLE-BASED GOVERNANCE</span>
          <h2>Built for Every Role Across Campus</h2>
          <p>
            CampusConnect enforces strict role-based permissions, giving students, faculty, and administrators the exact tools they need.
          </p>
        </div>

        <div className="role-cards-grid">
          {roles.map((role, idx) => (
            <div key={idx} className="role-card">
              <div>
                <div className="role-tag">{role.tag}</div>
                <div className="card-icon">{role.icon}</div>
                <h3>{role.title}</h3>
                <p>{role.description}</p>

                <ul className="role-features-list">
                  {role.features.map((feat, fIdx) => (
                    <li key={fIdx}>
                      <i><Check size={16} /></i>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link to={role.link} className="primary-hero-btn" style={{ justifyContent: "center" }}>
                {role.cta} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RoleSection;
