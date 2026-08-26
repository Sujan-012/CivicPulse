import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "20px",
        background: "var(--bg)",
      }}
    >
      <h1 style={{ fontSize: "5rem", color: "var(--primary)", fontWeight: 800 }}>404</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "24px", fontSize: "1.05rem" }}>
        Oops, this page doesn't exist.
      </p>
      <Link to="/">
        <button className="btn btn-primary">← Back Home</button>
      </Link>
    </div>
  );
}

export default NotFound;
