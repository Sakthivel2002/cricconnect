import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Register from "./pages/RegisterPage";
import Login from "./pages/LoginPage";
import PlayerDashboard from "./pages/PlayerDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import Bookings from "./pages/BookingsPage";

function App() {
  // ✅ Use React state instead of static localStorage reads
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  // ✅ Sync when storage changes (like logout/login)
  useEffect(() => {
    const syncAuth = () => {
      setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    };
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  // ✅ Force recheck when localStorage is changed in same tab
  useEffect(() => {
    const interval = setInterval(() => {
      const storedToken = localStorage.getItem("token");
      const storedRole = localStorage.getItem("role");
      if (storedToken !== token || storedRole !== role) {
        setToken(storedToken);
        setRole(storedRole);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [token, role]);

  const Dashboard = () => {
    if (!token) return <Navigate to="/login" replace />;
    if (role === "PLAYER") return <PlayerDashboard />;
    if (role === "RECRUITER") return <RecruiterDashboard />;
    return <Navigate to="/login" replace />;
  };

  const RecruiterRoute = ({ children }) =>
    token && role === "RECRUITER" ? children : <Navigate to="/login" replace />;

  const PlayerRoute = ({ children }) =>
    token && role === "PLAYER" ? children : <Navigate to="/login" replace />;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="/recruiter-dashboard"
          element={
            <RecruiterRoute>
              <RecruiterDashboard />
            </RecruiterRoute>
          }
        />
        <Route
          path="/player-dashboard"
          element={
            <PlayerRoute>
              <PlayerDashboard />
            </PlayerRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <RecruiterRoute>
              <Bookings />
            </RecruiterRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
