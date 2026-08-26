import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axiosConfig";
import "../styles/Login.css";
import "../styles/Register.css";

function Register() {
  const navigate = useNavigate();

  const [register, setRegister] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setRegister({
      ...register,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/register", register);

      toast.success(response.data.message);

      setTimeout(() => {
        navigate("/login", {
          state: {
            email: register.email,
          },
        });
      }, 1200);
    } catch (error) {
      console.error(error);

      if (error.response) {
        toast.error(error.response.data.message || "Registration failed");
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
        <h2>Create Account</h2>
        <p className="auth-subtext">Join the Smart Governance Platform and start improving your community.</p>

        <form onSubmit={handleSubmit}>
          <label className="field-label">Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Jane Doe"
            value={register.name}
            onChange={handleChange}
            required
          />

          <label className="field-label">Email</label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={register.email}
            onChange={handleChange}
            required
          />

          <label className="field-label">Password</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={register.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
