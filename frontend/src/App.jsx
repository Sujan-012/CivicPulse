import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Navbar from "./components/Navbar";
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import OfficerLogin from "./pages/OfficerLogin";
import Register from "./pages/Register";
import ReportIssue from "./pages/ReportIssue";
import ViewIssues from "./pages/ViewIssues";
import IssueDetails from "./pages/IssueDetails";
import AdminDashboard from "./pages/AdminDashboard";
import ApplyDocument from "./pages/ApplyDocument";
import Announcements from "./pages/Announcements";
import NotFound from "./pages/NotFound";

function App() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
        // Logged in: sidebar dashboard layout for everything
        return (
            <>
                <DashboardLayout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        {user.role !== "OFFICER" && (
                            <Route path="/report" element={<ReportIssue />} />
                        )}
                        <Route path="/issues" element={<ViewIssues />} />
                        <Route path="/issues/:id" element={<IssueDetails />} />
                        {user.role !== "OFFICER" && (
                            <Route path="/apply" element={<ApplyDocument />} />
                        )}
                        <Route path="/announcements" element={<Announcements />} />
                        <Route
                            path="/admin-dashboard"
                            element={
                                <ProtectedRoute role="ADMIN">
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/login" element={<Navigate to="/" replace />} />
                        <Route path="/admin-login" element={<Navigate to="/" replace />} />
                        <Route path="/officer-login" element={<Navigate to="/" replace />} />
                        <Route path="/register" element={<Navigate to="/" replace />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </DashboardLayout>

                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    pauseOnHover
                    draggable
                    theme="colored"
                />
            </>
        );
    }

    // Logged out: top navbar layout for public pages
    return (
        <>
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/officer-login" element={<OfficerLogin />} />
                <Route path="/register" element={<Register />} />
                <Route path="/issues" element={<ViewIssues />} />
                <Route path="/issues/:id" element={<IssueDetails />} />
                <Route path="/report" element={<Navigate to="/login" replace />} />
                <Route path="/apply" element={<Navigate to="/login" replace />} />
                <Route path="/announcements" element={<Navigate to="/login" replace />} />
                <Route path="/admin-dashboard" element={<Navigate to="/admin-login" replace />} />
                <Route path="*" element={<NotFound />} />
            </Routes>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                draggable
                theme="colored"
            />
        </>
    );
}

export default App;
