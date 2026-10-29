import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer-wrapper" id="contact">
      <div className="footer-container">
        <div className="footer-brand">
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div className="logo-box">C</div>
            <span style={{ fontSize: "20px", fontWeight: "800", color: "#ffffff" }}>CampusConnect</span>
          </div>
          <p>
            Centralized digital platform unifying students, faculty, placement officers, and institution administration for a smarter campus experience.
          </p>
        </div>

        <div className="footer-column">
          <h4>Platform</h4>
          <ul>
            <li><a href="#features">Student Portal</a></li>
            <li><a href="#features">Faculty Management</a></li>
            <li><a href="#features">Academic Records</a></li>
            <li><a href="#features">Placement Drives</a></li>
            <li><a href="#features">Event Hub</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Roles</h4>
          <ul>
            <li><a href="#roles">Student Account</a></li>
            <li><a href="#roles">Faculty Portal</a></li>
            <li><a href="#roles">Administrator Command</a></li>
            <li><Link to="/login">Account Login</Link></li>
            <li><Link to="/register">Register Institution</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Contact & Info</h4>
          <ul>
            <li><span>CampusConnect Platform</span></li>
            <li><span>Support: info@campusconnect.edu</span></li>
            <li><span>Location: Education Hub, Tech Campus</span></li>
            <li><Link to="/login">Security & Privacy</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div>© {new Date().getFullYear()} CampusConnect. All rights reserved. Smart Campus SaaS Platform.</div>
        <div>Built for Viva Demonstration & Real-World Campus Management</div>
      </div>
    </footer>
  );
}

export default Footer;