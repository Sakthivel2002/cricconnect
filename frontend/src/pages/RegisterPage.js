import { useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- for navigation
import api from "../api/api";
import { Snackbar, Alert, Paper, Typography, TextField, Button, Box, MenuItem, Link } from "@mui/material";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "PLAYER",
    name: "",
    city: "",
    playerRole: "",
    wage: "",
    teamName: "",
    location: "",
  });
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/register", form);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.user.role);

      setToast({ open: true, message: "Registered successfully!", severity: "success" });
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setToast({
        open: true,
        message: err.response?.data?.error || "Registration failed",
        severity: "error",
      });
    }
  };

  const handleCloseToast = () => setToast({ ...toast, open: false });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%)",
        p: 0,
        m: 0,
        overflow: "hidden",
      }}
    >
      <Paper elevation={12} sx={{ p: 5, borderRadius: 3, width: "100%", maxWidth: 450 }}>
        <Typography variant="h4" mb={3} fontWeight="bold" color="secondary">
          Register
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="Email" name="email" onChange={handleChange} fullWidth required />
          <TextField label="Password" type="password" name="password" onChange={handleChange} fullWidth required />

          <TextField select label="Role" name="role" value={form.role} onChange={handleChange} fullWidth>
            <MenuItem value="PLAYER">Player</MenuItem>
            <MenuItem value="RECRUITER">Recruiter</MenuItem>
          </TextField>

          {form.role === "PLAYER" ? (
            <>
              <TextField name="name" onChange={handleChange} label="Name" fullWidth />
              <TextField name="city" onChange={handleChange} label="City" fullWidth />
              <TextField name="playerRole" onChange={handleChange} label="Role" fullWidth />
              <TextField name="wage" type="number" onChange={handleChange} label="Wage" fullWidth />
            </>
          ) : (
            <>
              <TextField name="teamName" onChange={handleChange} label="Team Name" fullWidth />
              <TextField name="location" onChange={handleChange} label="Location" fullWidth />
            </>
          )}

          <Button type="submit" variant="contained" sx={{ mt: 1.5, py: 1.5 }} color="primary">
            Register
          </Button>
        </Box>

        {/* Already a user? redirect */}
        <Typography sx={{ mt: 2 }}>
          Already an user?{" "}
          <Link component="button" variant="body2" onClick={() => navigate("/login")}>
            Login here
          </Link>
        </Typography>
      </Paper>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
