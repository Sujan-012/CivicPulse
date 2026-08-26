import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axiosConfig";
import "../styles/Announcements.css";

function Announcements() {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "ADMIN";

  const [announcements, setAnnouncements] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const [loading, setLoading] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get("/announcements");
      setAnnouncements(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: form.title,
        description: form.description,
        dueDate: form.dueDate ? `${form.dueDate}T00:00:00` : null,
      };

      await api.post("/announcements", payload);
      toast.success("Announcement posted!");

      setForm({ title: "", description: "", dueDate: "" });
      fetchAnnouncements();
    } catch (error) {
      console.error(error);
      toast.error("Failed to post announcement");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this announcement?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/announcements/${id}`);
      toast.success("Announcement deleted");
      fetchAnnouncements();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete announcement");
    }
  };

  return (
    <div className="announce-container">
      {isAdmin && (
        <div className="announce-form-card card-surface">
          <h2>📢 Post an Announcement</h2>

          <form onSubmit={handleSubmit}>
            <label className="field-label">Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Water Bill Payment Deadline"
              value={form.title}
              onChange={handleChange}
              required
            />

            <label className="field-label">Description</label>
            <textarea
              name="description"
              placeholder="Details about the announcement..."
              rows={3}
              value={form.description}
              onChange={handleChange}
              required
            />

            <label className="field-label">Due Date (optional)</label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
            />

            <button type="submit" className="btn btn-primary announce-submit" disabled={loading}>
              {loading ? "Posting..." : "Post Announcement"}
            </button>
          </form>
        </div>
      )}

      <div className="announce-list-card card-surface">
        <h2>📰 Latest Announcements</h2>

        {announcements.length === 0 ? (
          <p className="empty-row">No announcements yet.</p>
        ) : (
          <div className="announce-list">
            {announcements.map((a) => (
              <div className="announce-item" key={a.id}>
                <div className="announce-item-top">
                  <h3>{a.title}</h3>
                  {isAdmin && (
                    <button className="announce-delete" onClick={() => handleDelete(a.id)}>
                      ✕
                    </button>
                  )}
                </div>

                <p>{a.description}</p>

                <div className="announce-meta">
                  {a.dueDate && (
                    <span className="announce-due">
                      ⏰ Due: {new Date(a.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  <span className="announce-posted">
                    Posted: {new Date(a.createdDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Announcements;
