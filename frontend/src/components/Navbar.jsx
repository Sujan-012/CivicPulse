import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");

    if (!confirmLogout) return;

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    toast.success("Logged out successfully!");

    navigate("/");

    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-dot">📍</span>
          <span>SGP-CSA</span>
        </Link>

        <div className="nav-links">
          <NavLink to="/" end className="nav-link">
            Home
          </NavLink>

          {!user ? (
            <>
              <NavLink to="/login" className="nav-link">
                Login
              </NavLink>
              <NavLink to="/admin-login" className="nav-link">
                Admin
              </NavLink>
              <NavLink to="/officer-login" className="nav-link">
                Officer
              </NavLink>
              <NavLink to="/register" className="nav-link nav-cta">
                Register
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/report" className="nav-link">
                Report Issue
              </NavLink>

              <NavLink to="/issues" className="nav-link">
                View Issues
              </NavLink>

              {user.role === "ADMIN" && (
                <NavLink to="/admin-dashboard" className="nav-link">
                  Dashboard
                </NavLink>
              )}

              <span className="nav-user">Hi, {user.name?.split(" ")[0] || "User"}</span>

              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
