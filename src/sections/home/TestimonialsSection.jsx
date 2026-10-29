import { Star } from "lucide-react";

function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "CampusConnect has made it much easier for us to manage students, academics and campus activities from one place.",
      name: "Dr. Ananya Sharma",
      role: "Head of Department",
      initials: "AS",
      dept: "Computer Engineering",
    },
    {
      quote:
        "Students now have quick access to attendance, events, academic information and placement opportunities.",
      name: "Rahul Mehta",
      role: "Placement Coordinator",
      initials: "RM",
      dept: "Training & Placement Cell",
    },
    {
      quote:
        "The platform gives our institution a much more organized and connected digital experience.",
      name: "Priya Deshmukh",
      role: "Faculty Member",
      initials: "PD",
      dept: "Information Technology",
    },
  ];

  return (
    <section className="testimonials-section" id="stories">
      <div className="container">
        {/* HEADER */}
        <div className="section-header">
          <span className="section-badge">CAMPUS STORIES</span>
          <h2>Trusted by Modern Campuses</h2>
          <p>
            See how CampusConnect helps institutions create a smarter and more connected campus experience.
          </p>
        </div>

        {/* CARDS GRID */}
        <div className="testimonials-cards-grid">
          {testimonials.map((t, idx) => (
            <div className="testimonial-card" key={idx}>
              <div className="testimonial-stars-row">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="star-icon" fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>

              <blockquote className="testimonial-quote">
                “{t.quote}”
              </blockquote>

              <div className="testimonial-author-row">
                <div className="testimonial-avatar-circle">
                  {t.initials}
                </div>
                <div>
                  <h3 className="author-name">{t.name}</h3>
                  <p className="author-role">{t.role} • {t.dept}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;