import {
  Users,
  GraduationCap,
  BriefcaseBusiness,
  BarChart3,
  CalendarDays,
  ShieldCheck,
  MailCheck,
  Lock,
} from "lucide-react";

function FeaturesSection() {
  const features = [
    {
      icon: Users,
      title: "Student Management",
      description:
        "Comprehensive student database, roll numbers, department profiles, and verified credentials.",
    },
    {
      icon: GraduationCap,
      title: "Academic Portal",
      description:
        "Empower faculty and departments to record attendance, manage courses, and publish marks.",
    },
    {
      icon: BriefcaseBusiness,
      title: "Placement Drives",
      description:
        "Track corporate recruiters, placement offers, interview schedules, and student applications.",
    },
    {
      icon: BarChart3,
      title: "Campus Analytics",
      description:
        "Real-time institutional metrics, growth reporting, and department-level performance metrics.",
    },
    {
      icon: CalendarDays,
      title: "Event Hub",
      description:
        "Schedule tech fests, workshops, academic meetings, and broadcast announcements instantly.",
    },
    {
      icon: MailCheck,
      title: "Email & OTP Security",
      description:
        "Automated 6-digit email verification, 60s cooldown resend logic, and password reset.",
    },
    {
      icon: Lock,
      title: "Role-Based Access",
      description:
        "Strict authorization ensuring Students, Faculty, and Administrators access only permitted resources.",
    },
    {
      icon: ShieldCheck,
      title: "Enterprise Protection",
      description:
        "JWT token authentication, BCrypt password hashing, and server-side request authorization.",
    },
  ];

  return (
    <section id="features" className="section-wrapper">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">POWERFUL CAMPUS ECOSYSTEM</span>
          <h2>Everything Your Institution Needs</h2>
          <p>
            Eliminate disconnected systems. CampusConnect integrates academic, administrative, and placement workflows into one reliable platform.
          </p>
        </div>

        <div className="cards-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div className="feature-card" key={index}>
                <div className="card-icon">
                  <Icon size={24} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;