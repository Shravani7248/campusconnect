import { useState } from "react";
import { ArrowLeft, CalendarDays, Plus, Search, X, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Events() {
  const { user } = useSelector((state) => state.auth);
  const role = (user?.role || "student").toLowerCase();
  const canManage = role === "admin" || role === "administrator" || role === "faculty";

  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState([
    { id: 1, title: "Annual Campus Tech Fest 2026", type: "Technical Fest", date: "2026-09-18", time: "09:30 AM", venue: "Main Auditorium", organizer: "Student Tech Council" },
    { id: 2, title: "Generative AI & LLM Hands-on Workshop", type: "Workshop", date: "2026-09-25", time: "10:00 AM", venue: "Computer Lab 4", organizer: "Department of CS" },
    { id: 3, title: "Higher Education & Global Overseas Seminar", type: "Seminar", date: "2026-10-02", time: "02:00 PM", venue: "Seminar Hall B", organizer: "Guidance Cell" },
  ]);

  const [search, setSearch] = useState("");
  const [newEvent, setNewEvent] = useState({ title: "", type: "Workshop", date: "", time: "", venue: "", organizer: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEvents((prev) => [...prev, { ...newEvent, id: Date.now() }]);
    setNewEvent({ title: "", type: "Workshop", date: "", time: "", venue: "", organizer: "" });
    setShowForm(false);
  };

  const filtered = events.filter((ev) =>
    `${ev.title} ${ev.type} ${ev.venue} ${ev.organizer}`.toLowerCase().includes(search.toLowerCase())
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
              Publish Event
            </button>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", background: "#ffffff", padding: "28px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
          <div>
            <span className="dashboard-badge">CAMPUS ACTIVITIES</span>
            <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", marginTop: "4px" }}>Events & Workshops</h1>
            <p style={{ color: "#64748b", fontSize: "15px", marginTop: "4px" }}>
              Stay updated with institution tech fests, seminars, academic workshops, and student activities.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "14px", background: "#f8fafc", padding: "16px 24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <CalendarDays size={28} className="text-orange-600" />
            <div>
              <strong style={{ display: "block", fontSize: "22px", color: "#0f172a", lineHeight: "1" }}>{events.length}</strong>
              <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Upcoming Events</span>
            </div>
          </div>
        </div>

        <div className="dashboard-search" style={{ width: "100%", maxWidth: "480px", marginBottom: "24px", padding: "10px 18px" }}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search event title, venue, organizer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="cards-grid">
          {filtered.map((ev) => (
            <div key={ev.id} className="feature-card">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <span style={{ background: "#fff7ed", color: "#c2410c", padding: "4px 10px", borderRadius: "20px", fontWeight: "700", fontSize: "12px" }}>
                  {ev.type}
                </span>
                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>{ev.date}</span>
              </div>

              <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", marginBottom: "10px" }}>{ev.title}</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#475569", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><Clock size={14} /> {ev.time}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><MapPin size={14} /> {ev.venue}</div>
              </div>

              <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "12px", fontSize: "12px", color: "#64748b" }}>
                Organized by: <strong style={{ color: "#0f172a" }}>{ev.organizer}</strong>
              </div>
            </div>
          ))}
        </div>

        {showForm && (
          <div className="student-modal-overlay">
            <div className="student-modal">
              <div className="student-modal-header">
                <div>
                  <span className="dashboard-badge">CAMPUS ANNOUNCEMENT</span>
                  <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a" }}>Create Campus Event</h2>
                </div>
                <button onClick={() => setShowForm(false)} style={{ color: "#64748b" }}><X size={20} /></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="student-form-grid">
                  <div className="auth-field">
                    <label>Event Title</label>
                    <input type="text" name="title" value={newEvent.title} onChange={handleChange} placeholder="e.g. AI Hackathon" required />
                  </div>
                  <div className="auth-field">
                    <label>Venue Location</label>
                    <input type="text" name="venue" value={newEvent.venue} onChange={handleChange} placeholder="e.g. Auditorium" required />
                  </div>
                  <div className="auth-field">
                    <label>Date</label>
                    <input type="date" name="date" value={newEvent.date} onChange={handleChange} required />
                  </div>
                  <div className="auth-field">
                    <label>Time</label>
                    <input type="text" name="time" value={newEvent.time} onChange={handleChange} placeholder="e.g. 10:00 AM" required />
                  </div>
                </div>

                <div className="student-form-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="add-student-btn"><Plus size={18} /> Publish Event</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Events;