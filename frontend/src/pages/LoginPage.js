import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import {
  Snackbar,
  Alert,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
} from "@mui/material";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", form);
      const { token, role, email } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("email", email);

      setToast({ open: true, message: "Login successful!", severity: "success" });

      setTimeout(() => {
        if (role === "RECRUITER") {
          navigate("/recruiter-dashboard");
        } else if (role === "PLAYER") {
          navigate("/player-dashboard");
        } else {
          navigate("/login");
        }
      }, 1000);
    } catch (err) {
      setToast({
        open: true,
        message: err.response?.data?.error || "Login failed",
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
        background: "linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)",
      }}
    >
      <Paper
        elevation={12}
        sx={{
          p: 5,
          borderRadius: 3,
          width: "100%",
          maxWidth: 400,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" mb={3} fontWeight="bold" color="primary">
          Login
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Email"
            name="email"
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            onChange={handleChange}
            fullWidth
            required
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 1, py: 1.5 }}
            color="success"
          >
            Login
          </Button>
        </Box>

        <Typography sx={{ mt: 2 }}>
          New user?{" "}
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate("/register")}
          >
            Create an account now
          </Link>
        </Typography>
      </Paper>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
