function ContactSection() {
  return (
    <section id="contact" className="contact-section">

      <div className="contact-container">

        <div className="contact-header">
          <div className="section-badge">
            GET IN TOUCH
          </div>

          <h2>
            Let's build a smarter
            <span> campus together.</span>
          </h2>

          <p>
            Have questions about CampusConnect or want to
            bring your institution onto the platform?
            We'd love to hear from you.
          </p>
        </div>

        <div className="contact-content">

          <div className="contact-info">

            <div className="contact-info-card">
              <div className="contact-icon">✉</div>

              <div>
                <h3>Email us</h3>
                <p>hello@campusconnect.com</p>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon">☎</div>

              <div>
                <h3>Call us</h3>
                <p>+91 98765 43210</p>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon">⌖</div>

              <div>
                <h3>Our location</h3>
                <p>Pune, Maharashtra, India</p>
              </div>
            </div>

          </div>

          <form className="contact-form">

            <div className="form-row">

              <div className="form-group">
                <label>Full Name</label>

                <input
                  type="text"
                  placeholder="Enter your name"
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>

                <input
                  type="email"
                  placeholder="Enter your email"
                />
              </div>

            </div>

            <div className="form-group">
              <label>Institution</label>

              <input
                type="text"
                placeholder="Enter institution name"
              />
            </div>

            <div className="form-group">
              <label>Message</label>

              <textarea
                rows="5"
                placeholder="Tell us how we can help..."
              />
            </div>

            <button
              type="submit"
              className="contact-submit"
            >
              Send Message
              <span>→</span>
            </button>

          </form>

        </div>

      </div>

    </section>
  );
}

export default ContactSection;