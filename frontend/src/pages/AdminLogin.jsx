import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axiosConfig";
import "../styles/Login.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setLogin({
      ...login,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", login);

      if (!response.data.success) {
        toast.error(response.data.message);
        return;
      }

      if (response.data.role !== "ADMIN") {
        toast.error("This account is not an admin account. Please use the regular login.");
        return;
      }

      toast.success(response.data.message);

      localStorage.setItem("token", response.data.token);

      const user = {
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
      };

      localStorage.setItem("user", JSON.stringify(user));

      navigate("/admin-dashboard");
    } catch (error) {
      console.error(error);

      if (error.response) {
        toast.error(error.response.data.message || "Invalid email or password");
      } else {
        toast.error("Server not running or cannot connect");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page admin-auth-page">
      <div className="auth-card card-surface admin-auth-card">
        <span className="admin-badge">🛡️ Admin Access</span>
        <h2>Admin Login</h2>
        <p className="auth-subtext">Restricted to Smart Governance Platform administrators only.</p>

        <form onSubmit={handleSubmit}>
          <label className="field-label">Admin Email</label>
          <input
            type="email"
            name="email"
            placeholder="admin@civicpulse.com"
            value={login.email}
            onChange={handleChange}
            required
          />

          <label className="field-label">Password</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={login.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn btn-primary admin-submit auth-submit" disabled={loading}>
            {loading ? "Logging in..." : "Login as Admin"}
          </button>
        </form>

        <p className="auth-switch">
          Not an admin? <Link to="/login">Go to user login</Link>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
