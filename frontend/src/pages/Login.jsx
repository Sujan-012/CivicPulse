import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axiosConfig";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [login, setLogin] = useState({
    email: location.state?.email || "",
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

      if (response.data.role === "ADMIN") {
        toast.info("This is an admin account. Redirecting to admin login...");
        setTimeout(() => navigate("/admin-login"), 1200);
        return;
      }

      if (response.data.role === "OFFICER") {
        toast.info("This is an officer account. Redirecting to officer login...");
        setTimeout(() => navigate("/officer-login"), 1200);
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
    <div className="auth-page">
      <div className="auth-card card-surface">
        <h2>Welcome Back</h2>
        <p className="auth-subtext">Login to report and track civic issues.</p>

        <form onSubmit={handleSubmit}>
          <label className="field-label">Email</label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
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

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register</Link>
        </p>

        <p className="auth-switch">
          Are you an admin? <Link to="/admin-login">Admin login</Link>
        </p>

        <p className="auth-switch">
          Are you an officer? <Link to="/officer-login">Officer login</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
