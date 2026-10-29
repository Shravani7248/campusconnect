import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

function CTASection() {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-box">
          <span className="section-badge" style={{ color: "#38bdf8" }}>GET STARTED TODAY</span>

          <h2>
            Ready to Build a <br />
            <span style={{ color: "#ffffff" }}>Smarter Campus?</span>
          </h2>

          <p className="cta-subtitle">
            Bring students, faculty, administration and placement teams together with one powerful, connected platform.
          </p>

          <div className="cta-buttons-row">
            <Link to="/register" className="primary-hero-btn" style={{ background: "#2563eb" }}>
              Get Started Now
              <ArrowRight size={18} />
            </Link>

            <a href="#contact" className="secondary-hero-btn" style={{ background: "rgba(255, 255, 255, 0.1)", color: "#ffffff", borderColor: "rgba(255, 255, 255, 0.2)" }}>
              Contact Platform Team
            </a>
          </div>

          <div className="cta-trust-badge">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>Built for modern educational institutions & viva demonstration</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;