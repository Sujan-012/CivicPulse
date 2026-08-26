import { useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axiosConfig";
import "../styles/ReportIssue.css";

function ReportIssue() {
  const [issue, setIssue] = useState({
    title: "",
    description: "",
    location: "",
    category: "",
  });

  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setIssue((prev) => ({
          ...prev,
          location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        }));

        toast.success("Location captured!");
        setLocating(false);
      },
      (error) => {
        console.error(error);
        toast.error("Could not fetch your location. Please allow location access.");
        setLocating(false);
      }
    );
  };

  const handleChange = (e) => {
    setIssue({
      ...issue,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/issues", issue);

      console.log(response.data);

      toast.success("Issue reported successfully!");

      setIssue({
        title: "",
        description: "",
        location: "",
        category: "",
      });
    } catch (error) {
      console.error(error);

      if (error.response) {
        toast.error(error.response.data.message || "Failed to report issue");
      } else {
        toast.error("Server not running or cannot connect");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-container">
      <div className="report-card card-surface">
        <h2>📝 Report a Civic Issue</h2>
        <p className="report-subtext">
          Tell us what's wrong and where — we'll route it to the right team.
        </p>

        <form onSubmit={handleSubmit}>
          <label className="field-label">Issue Title</label>
          <input
            type="text"
            name="title"
            placeholder="e.g. Large pothole on Main Street"
            value={issue.title}
            onChange={handleChange}
            required
          />

          <label className="field-label">Description</label>
          <textarea
            name="description"
            placeholder="Describe the issue in detail..."
            rows={4}
            value={issue.description}
            onChange={handleChange}
            required
          />

          <label className="field-label">Location</label>
          <div className="location-row">
            <input
              type="text"
              name="location"
              placeholder="e.g. 5th Cross, Indiranagar"
              value={issue.location}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="btn btn-outline location-btn"
              onClick={handleUseMyLocation}
              disabled={locating}
            >
              {locating ? "📍..." : "📍 Use My Location"}
            </button>
          </div>

          <label className="field-label">Category</label>
          <select name="category" value={issue.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            <option value="Road">🛣️ Road</option>
            <option value="Garbage">🗑️ Garbage</option>
            <option value="Water Leakage">💧 Water Leakage</option>
            <option value="Street Light">💡 Street Light</option>
            <option value="Drainage">🚰 Drainage</option>
            <option value="Other">📌 Other</option>
          </select>

          <button type="submit" className="btn btn-primary report-submit" disabled={loading}>
            {loading ? "Submitting..." : "Report Issue"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReportIssue;
