import { Link } from "react-router-dom";
import "../styles/Home.css";
import Features from "../components/Features";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-glow" />
        <span className="hero-badge">🏙️ Smart Civic Issue Reporting</span>

        <h1>
          Report it. Track it. <span className="hero-highlight">Fix your city.</span>
        </h1>

        <p>
          SGP-CSA — the Smart Governance Platform for Administrative Operations
          with Citizen Service Assistance — connects citizens with local authorities to report and resolve
          potholes, garbage dumps, water leakage, streetlight failures and more —
          transparently and in real time.
        </p>

        <div className="hero-actions">
          <Link to="/report">
            <button className="btn btn-primary">📝 Report an Issue</button>
          </Link>

          <Link to="/issues">
            <button className="btn btn-outline">🔍 Browse Reported Issues</button>
          </Link>
        </div>
      </section>

      <Features />

      <Footer />
    </>
  );
}

export default Home;
