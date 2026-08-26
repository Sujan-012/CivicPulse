import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axiosConfig";
import "../styles/ApplyDocument.css";

const statusBadgeClass = (status) => {
  if (status === "Pending") return "badge badge-pending";
  if (status === "Under Review") return "badge badge-progress";
  if (status === "Approved") return "badge badge-resolved";
  return "badge badge-pending";
};

function ApplyDocument() {
  const [form, setForm] = useState({
    documentType: "Aadhar Card",
    applicantName: "",
    contactNumber: "",
    address: "",
    remarks: "",
  });

  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState([]);

  const fetchApplications = async () => {
    try {
      const response = await api.get("/applications");
      setApplications(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/applications", form);
      toast.success("Application submitted successfully!");

      setForm({
        documentType: "Aadhar Card",
        applicantName: "",
        contactNumber: "",
        address: "",
        remarks: "",
      });

      fetchApplications();
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (app) => {
    try {
      const response = await api.get(`/applications/${app.id}/download`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `${app.documentType}_${app.id}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast.error("Failed to download document");
    }
  };

  return (
    <div className="apply-container">
      <div className="apply-form-card card-surface">
        <h2>📄 Apply for a Government Document</h2>
        <p className="apply-subtext">
          Apply for Aadhar Card, Birth Certificate, or other civic documents online.
        </p>

        <form onSubmit={handleSubmit}>
          <label className="field-label">Document Type</label>
          <select name="documentType" value={form.documentType} onChange={handleChange} required>
            <option>Aadhar Card</option>
            <option>Birth Certificate</option>
            <option>Death Certificate</option>
            <option>Income Certificate</option>
            <option>Domicile Certificate</option>
            <option>Other</option>
          </select>

          <label className="field-label">Applicant Full Name</label>
          <input
            type="text"
            name="applicantName"
            placeholder="As per official records"
            value={form.applicantName}
            onChange={handleChange}
            required
          />

          <label className="field-label">Contact Number</label>
          <input
            type="tel"
            name="contactNumber"
            placeholder="10-digit mobile number"
            value={form.contactNumber}
            onChange={handleChange}
            required
          />

          <label className="field-label">Address</label>
          <textarea
            name="address"
            placeholder="Full residential address"
            rows={3}
            value={form.address}
            onChange={handleChange}
            required
          />

          <label className="field-label">Remarks (optional)</label>
          <textarea
            name="remarks"
            placeholder="Any additional details..."
            rows={2}
            value={form.remarks}
            onChange={handleChange}
          />

          <button type="submit" className="btn btn-primary apply-submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>

      <div className="apply-history card-surface">
        <h2>My Applications</h2>

        {applications.length === 0 ? (
          <p className="empty-row">You haven't applied for any documents yet.</p>
        ) : (
          <div className="apply-list">
            {applications.map((app) => (
              <div className="apply-item" key={app.id}>
                <div className="apply-item-top">
                  <strong>{app.documentType}</strong>
                  <span className={statusBadgeClass(app.status)}>{app.status}</span>
                </div>
                <p>{app.applicantName} · {app.contactNumber}</p>
                {app.status === "Approved" && (
                  <p className="apply-approved-note">
                    ✅ Your document has been approved and sent to you. Please check your registered
                    contact / email, or visit the municipal office to collect it.
                  </p>
                )}
                <p className="apply-date">
                  Applied: {app.createdDate ? new Date(app.createdDate).toLocaleDateString() : "N/A"}
                </p>
                {app.adminResponse && (
                  <p className="apply-admin-response">💬 Admin: {app.adminResponse}</p>
                )}
                {app.documentAvailable && (
                  <button className="btn btn-primary apply-download-btn" onClick={() => handleDownload(app)}>
                    ⬇️ Download Document
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ApplyDocument;
