import { ArrowRight, Layers, Zap, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";

function AboutSection() {
  const items = [
    {
      num: "01",
      title: "One Connected Platform",
      desc: "Manage your complete campus ecosystem from one centralized platform.",
      icon: <Layers size={20} className="text-blue-600" />,
    },
    {
      num: "02",
      title: "Smart & Efficient",
      desc: "Reduce manual work with organized, intelligent digital workflows.",
      icon: <Zap size={20} className="text-purple-600" />,
    },
    {
      num: "03",
      title: "Secure & Scalable",
      desc: "Designed to securely support institutions of every size.",
      icon: <Shield size={20} className="text-emerald-600" />,
    },
    {
      num: "04",
      title: "Made for Everyone",
      desc: "Students, faculty, administration and placement teams — all connected.",
      icon: <Users size={20} className="text-cyan-600" />,
    },
  ];

  const handleExploreClick = () => {
    const featuresElement = document.getElementById("features");
    if (featuresElement) {
      featuresElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="about-section" id="about">
      <div className="container">
        <div className="about-layout">
          {/* LEFT COLUMN */}
          <div className="about-left-col">
            <span className="section-badge">WHY CAMPUSCONNECT</span>
            
            <h2 className="about-main-title">
              Built to make <br />
              <span className="gradient-heading">campus life simpler.</span>
            </h2>

            <p className="about-description">
              CampusConnect brings students, faculty, administration and placement teams together on one intelligent platform.
            </p>

            <p className="about-description-sub">
              From academic management and attendance to events, communication and placements, everything stays connected in one secure digital ecosystem.
            </p>

            <div className="about-action-wrapper">
              <button onClick={handleExploreClick} className="primary-hero-btn">
                Explore Platform
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN (2x2 GRID / FLEX CARDS) */}
          <div className="about-right-col">
            <div className="about-cards-grid">
              {items.map((item, idx) => (
                <div className="about-feature-item" key={idx}>
                  <div className="item-header">
                    <span className="item-number">{item.num}</span>
                    <div className="item-icon-box">{item.icon}</div>
                  </div>
                  <h3 className="item-title">{item.title}</h3>
                  <p className="item-desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;