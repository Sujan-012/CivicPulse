import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axiosConfig";
import "../styles/ViewIssues.css";

const statusBadgeClass = (status) => {
  if (status === "Pending") return "badge badge-pending";
  if (status === "Assigned") return "badge badge-pending";
  if (status === "In Progress") return "badge badge-progress";
  return "badge badge-resolved";
};

function ViewIssues() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isOfficer = user?.role === "OFFICER";

  const [issues, setIssues] = useState([]);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    category: "",
    location: "",
  });

  const [editingIssue, setEditingIssue] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    category: "",
  });

  const fetchIssues = async (currentFilters = filters) => {
    try {
      const params = new URLSearchParams();

      if (currentFilters.search) params.append("search", currentFilters.search);
      if (currentFilters.status) params.append("status", currentFilters.status);
      if (currentFilters.category) params.append("category", currentFilters.category);
      if (currentFilters.location) params.append("location", currentFilters.location);

      const response = await api.get(
        `/issues${params.toString() ? `?${params.toString()}` : ""}`
      );

      setIssues(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch issues");
    }
  };

  const acceptAssignment = async (id) => {
    try {
      await api.put(`/issues/${id}/accept`);
      toast.success("Assignment accepted! Status set to In Progress.");
      fetchIssues();
    } catch (error) {
      console.error(error);
      toast.error("Failed to accept assignment");
    }
  };

  const updateStatus = async (id, currentStatus) => {
    let newStatus = "";

    if (currentStatus === "Pending") {
      newStatus = "In Progress";
    } else if (currentStatus === "In Progress") {
      newStatus = "Resolved";
    } else {
      toast.info("Issue is already resolved");
      return;
    }

    try {
      await api.put(`/issues/${id}/status?status=${newStatus}`);
      toast.success("Status updated successfully!");
      fetchIssues();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  const deleteIssue = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this issue?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/issues/${id}`);
      toast.success("Issue deleted successfully!");
      fetchIssues();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete issue");
    }
  };

  const openEditForm = (issue) => {
    setEditingIssue(issue);

    setFormData({
      title: issue.title,
      description: issue.description,
      location: issue.location,
      category: issue.category,
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const updateIssue = async () => {
    try {
      await api.put(`/issues/${editingIssue.id}`, formData);
      toast.success("Issue updated successfully!");
      setEditingIssue(null);
      fetchIssues();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update issue");
    }
  };

  useEffect(() => {
    fetchIssues(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.status, filters.category, filters.location]);

  return (
    <div className="issues-container">
      <div className="page-shell">
        <div className="issues-header">
          <h2>Reported Issues</h2>
          <p>{issues.length} issue{issues.length !== 1 ? "s" : ""} found</p>
        </div>

        <div className="filter-controls card-surface">
          <input
            type="text"
            name="search"
            placeholder="🔍 Search by title, location, or category"
            value={filters.search}
            onChange={handleFilterChange}
          />

          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={filters.category}
            onChange={handleFilterChange}
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={filters.location}
            onChange={handleFilterChange}
          />
        </div>

        {issues.length === 0 ? (
          <div className="no-issues card-surface">
            <p>🕵️ No issues found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="issues-grid">
            {issues.map((issue) => (
              <div className="issue-card card-surface" key={issue.id}>
                <div className="issue-card-top">
                  <h3>{issue.title}</h3>
                  <span className={statusBadgeClass(issue.status)}>{issue.status}</span>
                </div>

                <p className="issue-desc">{issue.description}</p>

                <div className="issue-meta">
                  <span>📍 {issue.location}</span>
                  <span>🏷️ {issue.category}</span>
                  {issue.assignedOfficer && <span>🧰 {issue.assignedOfficer.name}</span>}
                </div>

                <p className="issue-date">
                  Reported: {issue.createdDate ? new Date(issue.createdDate).toLocaleString() : "N/A"}
                </p>

                <div className="button-group">
                  <button className="btn btn-outline" onClick={() => navigate(`/issues/${issue.id}`)}>
                    View Details
                  </button>

                  {!isOfficer && (
                    <button className="btn btn-outline" onClick={() => openEditForm(issue)}>
                      Edit
                    </button>
                  )}

                  <a
                    className="btn btn-outline"
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(issue.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    🗺️ Map
                  </a>

                  {isOfficer && issue.status === "Assigned" ? (
                    <button className="btn btn-primary" onClick={() => acceptAssignment(issue.id)}>
                      ✅ Accept Assignment
                    </button>
                  ) : (
                    <button className="btn btn-primary" onClick={() => updateStatus(issue.id, issue.status)}>
                      Advance Status
                    </button>
                  )}

                  {!isOfficer && (
                    <button className="btn btn-danger" onClick={() => deleteIssue(issue.id)}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingIssue && (
        <div className="edit-modal">
          <div className="edit-card card-surface">
            <h2>Edit Issue</h2>

            <label className="field-label">Title</label>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
            />

            <label className="field-label">Description</label>
            <textarea
              name="description"
              placeholder="Description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
            />

            <label className="field-label">Location</label>
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
            />

            <label className="field-label">Category</label>
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
            />

            <div className="modal-buttons">
              <button className="btn btn-primary" onClick={updateIssue}>
                Save Changes
              </button>

              <button className="btn btn-outline" onClick={() => setEditingIssue(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewIssues;
