import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axiosConfig";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalIssues: 0,
    pendingIssues: 0,
    inProgressIssues: 0,
    resolvedIssues: 0,
  });

  const [issues, setIssues] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [officerForm, setOfficerForm] = useState({ name: "", email: "", password: "" });
  const [creatingOfficer, setCreatingOfficer] = useState(false);
  const [applications, setApplications] = useState([]);

  const [uploadModal, setUploadModal] = useState(null); // application object or null
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const fetchApplications = async () => {
    try {
      const response = await api.get("/applications");
      setApplications(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get("/issues/dashboard/stats");
      setStats(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRecentIssues = async (currentSearch = search, currentStatus = statusFilter) => {
    try {
      const params = new URLSearchParams();

      if (currentSearch) params.append("search", currentSearch);
      if (currentStatus && currentStatus !== "All") params.append("status", currentStatus);

      const response = await api.get(
        `/issues${params.toString() ? `?${params.toString()}` : ""}`
      );

      setIssues(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchOfficers = async () => {
    try {
      const response = await api.get("/users/officers");
      setOfficers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    fetchRecentIssues(search, statusFilter);
    fetchOfficers();
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter]);

  const handleOfficerFormChange = (e) => {
    setOfficerForm({ ...officerForm, [e.target.name]: e.target.value });
  };

  const handleCreateOfficer = async (e) => {
    e.preventDefault();
    setCreatingOfficer(true);

    try {
      const response = await api.post("/users/officers", officerForm);

      if (!response.data.success) {
        toast.error(response.data.message);
        return;
      }

      toast.success("Officer account created!");
      setOfficerForm({ name: "", email: "", password: "" });
      fetchOfficers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create officer account");
    } finally {
      setCreatingOfficer(false);
    }
  };

  const handleAssign = async (issueId, officerId) => {
    if (!officerId) return;

    try {
      await api.put(`/issues/${issueId}/assign?officerId=${officerId}`);
      toast.success("Issue assigned to officer!");
      fetchRecentIssues();
      fetchDashboardStats();
    } catch (error) {
      console.error(error);
      toast.error("Failed to assign issue");
    }
  };

  const updateApplicationStatus = async (id, status) => {
    if (status === "Approved") {
      const app = applications.find((a) => a.id === id);
      setUploadModal(app);
      setUploadMessage("Your document is ready. Download it below.");
      return;
    }

    try {
      let response = "";

      if (status === "Rejected") {
        response = window.prompt("Reason for rejection:", "") || "";
      }

      const params = new URLSearchParams({ status });
      if (response) params.append("response", response);

      await api.put(`/applications/${id}/status?${params.toString()}`);

      toast.success(`Application marked as ${status}`);

      fetchApplications();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update application");
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();

    if (!uploadFile) {
      toast.error("Please choose a file to upload");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("response", uploadMessage);

      await api.post(`/applications/${uploadModal.id}/upload-document`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Document uploaded and sent to citizen!");

      setUploadModal(null);
      setUploadFile(null);
      setUploadMessage("");
      fetchApplications();
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  const filteredIssues = issues;

  return (
    <div className="dashboard-container">
      <div className="page-shell">
        <h2 className="dashboard-title">📊 Admin Dashboard</h2>

        <div className="dashboard-grid">
          <div className="dashboard-card total">
            <span className="dashboard-icon">📋</span>
            <h3>Total Issues</h3>
            <h1>{stats.totalIssues}</h1>
          </div>

          <div className="dashboard-card pending">
            <span className="dashboard-icon">⏳</span>
            <h3>Pending</h3>
            <h1>{stats.pendingIssues}</h1>
          </div>

          <div className="dashboard-card progress">
            <span className="dashboard-icon">🔧</span>
            <h3>In Progress</h3>
            <h1>{stats.inProgressIssues}</h1>
          </div>

          <div className="dashboard-card resolved">
            <span className="dashboard-icon">✅</span>
            <h3>Resolved</h3>
            <h1>{stats.resolvedIssues}</h1>
          </div>
        </div>

        <div className="quick-actions card-surface">
          <h2>Quick Actions</h2>

          <div className="action-buttons">
            <button className="btn btn-primary" onClick={() => navigate("/report")}>
              📝 Report Issue
            </button>

            <button className="btn btn-outline" onClick={() => navigate("/issues")}>
              🔍 View All Issues
            </button>
          </div>
        </div>

        <div className="officer-section card-surface">
          <h2>🧰 Manage Officers</h2>

          <form className="officer-form" onSubmit={handleCreateOfficer}>
            <input
              type="text"
              name="name"
              placeholder="Officer Name"
              value={officerForm.name}
              onChange={handleOfficerFormChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Officer Email"
              value={officerForm.email}
              onChange={handleOfficerFormChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={officerForm.password}
              onChange={handleOfficerFormChange}
              required
            />
            <button type="submit" className="btn btn-primary" disabled={creatingOfficer}>
              {creatingOfficer ? "Creating..." : "+ Add Officer"}
            </button>
          </form>

          <div className="officer-list">
            {officers.length === 0 ? (
              <p className="empty-row">No officer accounts yet. Create one above.</p>
            ) : (
              officers.map((officer) => (
                <span className="officer-chip" key={officer.id}>
                  👤 {officer.name} <small>({officer.email})</small>
                </span>
              ))
            )}
          </div>
        </div>

        <div className="officer-section card-surface">
          <h2>📄 Document Applications</h2>

          {applications.length === 0 ? (
            <p className="empty-row">No applications submitted yet.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Document</th>
                    <th>Contact</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td>{app.applicantName}</td>
                      <td>{app.documentType}</td>
                      <td>{app.contactNumber}</td>
                      <td>
                        <span
                          className={
                            app.status === "Approved"
                              ? "badge badge-resolved"
                              : app.status === "Rejected"
                              ? "badge badge-pending"
                              : "badge badge-progress"
                          }
                        >
                          {app.status}
                        </span>
                      </td>
                      <td>
                        <select
                          value=""
                          onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                        >
                          <option value="">Update status...</option>
                          <option value="Under Review">Mark Under Review</option>
                          <option value="Approved">✅ Approve & Send Document</option>
                          <option value="Rejected">❌ Reject</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="filter-container card-surface">
          <input
            type="text"
            placeholder="🔍 Search issues..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option>All</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
        </div>

        <div className="recent-issues card-surface">
          <h2>Recent Issues</h2>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Assigned Officer</th>
                </tr>
              </thead>

              <tbody>
                {filteredIssues.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-row">
                      No Issues Found
                    </td>
                  </tr>
                ) : (
                  filteredIssues.map((issue) => (
                    <tr key={issue.id}>
                      <td>{issue.title}</td>
                      <td>{issue.category}</td>
                      <td>{issue.location}</td>
                      <td>
                        <span
                          className={
                            issue.status === "Pending"
                              ? "badge badge-pending"
                              : issue.status === "In Progress"
                              ? "badge badge-progress"
                              : "badge badge-resolved"
                          }
                        >
                          {issue.status}
                        </span>
                      </td>
                      <td>
                        <select
                          defaultValue={issue.assignedOfficer?.id || ""}
                          onChange={(e) => handleAssign(issue.id, e.target.value)}
                        >
                          <option value="">
                            {issue.assignedOfficer ? issue.assignedOfficer.name : "Unassigned"}
                          </option>
                          {officers
                            .filter((o) => o.id !== issue.assignedOfficer?.id)
                            .map((o) => (
                              <option key={o.id} value={o.id}>
                                {o.name}
                              </option>
                            ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {uploadModal && (
        <div className="edit-modal">
          <div className="edit-card card-surface">
            <h2>📎 Upload Document for {uploadModal.applicantName}</h2>
            <p className="upload-modal-sub">
              {uploadModal.documentType} · Uploading will mark this application as Approved
              and the citizen will be able to download the file.
            </p>

            <form onSubmit={handleUploadSubmit}>
              <label className="field-label">Choose File (PDF/Image)</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setUploadFile(e.target.files[0])}
                required
              />

              <label className="field-label">Message to Citizen</label>
              <textarea
                rows={3}
                value={uploadMessage}
                onChange={(e) => setUploadMessage(e.target.value)}
              />

              <div className="modal-buttons">
                <button type="submit" className="btn btn-primary" disabled={uploading}>
                  {uploading ? "Uploading..." : "Upload & Approve"}
                </button>

                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setUploadModal(null);
                    setUploadFile(null);
                    setUploadMessage("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
