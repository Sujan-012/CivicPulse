import "../styles/Features.css";

const featureList = [
  {
    icon: "📝",
    title: "Report an Issue",
    desc: "Report potholes, garbage dumps, water leakage, streetlight failures and more in seconds.",
  },
  {
    icon: "📍",
    title: "Track in Real Time",
    desc: "Follow the exact status of every issue you report — Pending, In Progress, or Resolved.",
  },
  {
    icon: "📊",
    title: "Live City Dashboard",
    desc: "Admins get a live dashboard with statistics, filters, and full issue management tools.",
  },
  {
    icon: "🔐",
    title: "Secure & Role-Based",
    desc: "JWT-secured accounts with role-based access for Citizens and Administrators.",
  },
];

function Features() {
  return (
    <section className="features">
      <div className="page-shell">
        <div className="section-heading">
          <h2>Why Choose Our Platform?</h2>
          <p>Everything you need to make your neighborhood better, faster.</p>
        </div>

        <div className="feature-container">
          {featureList.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
