import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "../styles/IssueDetails.css";

const statusBadgeClass = (status) => {
  if (status === "Pending") return "badge badge-pending";
  if (status === "In Progress") return "badge badge-progress";
  return "badge badge-resolved";
};

function IssueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [issue, setIssue] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchIssue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchIssue = async () => {
    try {
      const response = await api.get(`/issues/${id}`);
      setIssue(response.data);
    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  if (error) {
    return (
      <div className="details-container">
        <div className="details-card card-surface">
          <h2>Issue Not Found</h2>
          <button className="btn btn-outline back-btn" onClick={() => navigate("/issues")}>
            ← Back to Issues
          </button>
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="details-container">
        <div className="details-card card-surface">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="details-container">
      <div className="details-card card-surface">
        <div className="details-top">
          <h2>{issue.title}</h2>
          <span className={statusBadgeClass(issue.status)}>{issue.status}</span>
        </div>

        <div className="details-row">
          <span className="details-label">Description</span>
          <p>{issue.description}</p>
        </div>

        <div className="details-grid">
          <div>
            <span className="details-label">📍 Location</span>
            <p>{issue.location}</p>
          </div>

          <div>
            <span className="details-label">🏷️ Category</span>
            <p>{issue.category}</p>
          </div>

          <div>
            <span className="details-label">🕒 Reported</span>
            <p>{issue.createdDate ? new Date(issue.createdDate).toLocaleString() : "N/A"}</p>
          </div>
        </div>

        <a
          className="btn btn-outline back-btn"
          style={{ marginBottom: "10px" }}
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(issue.location)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          🗺️ Open Location in Maps
        </a>

        <button className="btn btn-outline back-btn" onClick={() => navigate("/issues")}>
          ← Back to Issues
        </button>
      </div>
    </div>
  );
}

export default IssueDetails;
