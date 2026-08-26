import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axiosConfig";
import "../styles/Login.css";

function OfficerLogin() {
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

      if (response.data.role !== "OFFICER") {
        toast.error("This account is not an officer account.");
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

      navigate("/");
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
    <div className="auth-page officer-auth-page">
      <div className="auth-card card-surface officer-auth-card">
        <span className="officer-badge">🧰 Officer Access</span>
        <h2>Officer Login</h2>
        <p className="auth-subtext">Log in to view and resolve issues assigned to you.</p>

        <form onSubmit={handleSubmit}>
          <label className="field-label">Officer Email</label>
          <input
            type="email"
            name="email"
            placeholder="officer@civicpulse.com"
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

          <button type="submit" className="btn btn-primary officer-submit auth-submit" disabled={loading}>
            {loading ? "Logging in..." : "Login as Officer"}
          </button>
        </form>

        <p className="auth-switch">
          Not an officer? <Link to="/login">Go to user login</Link>
        </p>
      </div>
    </div>
  );
}

export default OfficerLogin;
