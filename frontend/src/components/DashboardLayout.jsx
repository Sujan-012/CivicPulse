import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/DashboardLayout.css";

function DashboardLayout({ children }) {
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

  const navItems = [{ to: "/", label: "Home", icon: "🏠", end: true }];

  if (user?.role !== "OFFICER") {
    navItems.push({ to: "/report", label: "Report Issue", icon: "📝" });
  }

  navItems.push({
    to: "/issues",
    label: user?.role === "OFFICER" ? "My Assigned Issues" : "View Issues",
    icon: "📋",
  });

  if (user?.role !== "OFFICER") {
    navItems.push({ to: "/apply", label: "Apply for Documents", icon: "📄" });
  }

  navItems.push({ to: "/announcements", label: "Announcements", icon: "📢" });

  if (user?.role === "ADMIN") {
    navItems.push({ to: "/admin-dashboard", label: "Dashboard", icon: "📊" });
  }

  return (
    <div className="dash-shell">
      <aside className="dash-sidebar">
        <div className="dash-brand">
          <span className="brand-dot">📍</span>
          <span>SGP-CSA</span>
        </div>

        <nav className="dash-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => "dash-nav-link" + (isActive ? " active" : "")}
            >
              <span className="dash-nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="dash-sidebar-footer">
          <div className="dash-user">
            <div className="dash-user-avatar">{(user?.name || "U")[0].toUpperCase()}</div>
            <div>
              <div className="dash-user-name">{user?.name || "User"}</div>
              <div className="dash-user-role">
                {user?.role === "ADMIN" ? "Administrator" : user?.role === "OFFICER" ? "Officer" : "Citizen"}
              </div>
            </div>
          </div>

          <button className="dash-logout" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      <div className="dash-main">
        <header className="dash-topbar">
          <span className="dash-topbar-title">Welcome back, {user?.name?.split(" ")[0] || "there"} 👋</span>
        </header>

        <main className="dash-content">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
