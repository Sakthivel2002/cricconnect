import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    // ✅ Clear everything from localStorage
    localStorage.clear();

    // ✅ Navigate back to login
    navigate("/login", { replace: true });
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#0d47a1" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          CricConnect
        </Typography>

        {role === "RECRUITER" && (
          <>
            <Button color="inherit" href="/recruiter-dashboard">
              Players
            </Button>
            <Button color="inherit" href="/bookings">
              My Bookings
            </Button>
          </>
        )}

        {role === "PLAYER" && (
          <Button color="inherit" href="/player-dashboard">
            My Bookings
          </Button>
        )}


        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
