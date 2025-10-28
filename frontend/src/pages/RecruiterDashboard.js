import React, { useEffect, useState } from "react";
import API from "../api/api";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Button,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Paper,
  Chip,
  Box,
} from "@mui/material";
import { deepPurple, green, grey, orange } from "@mui/material/colors";
import { People, CheckCircle, HourglassEmpty, SportsCricket } from "@mui/icons-material";
import Navbar from "../components/Navbar";

export default function RecruiterDashboard() {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [filters, setFilters] = useState({ city: "", role: "", status: "" });
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    API.get("/players")
      .then((res) => {
        console.log("Players from API:", res.data);
        setPlayers(res.data);
        setFilteredPlayers(res.data);
      })
      .catch((err) => {
        showToast(err.response?.data?.error || "Failed to fetch players", "error");
      });
  }, []);

  useEffect(() => {
    let filtered = [...players];
    if (filters.city) filtered = filtered.filter((p) => p.city === filters.city);
    if (filters.role) filtered = filtered.filter((p) => p.role === filters.role);
    if (filters.status) filtered = filtered.filter((p) => p.status === filters.status);
    if (search)
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    setFilteredPlayers(filtered);
  }, [filters, search, players]);

  const handleBook = async (playerId) => {
    try {
      await API.post("/bookings", { player: { id: playerId }, type: "PER_DAY" });
      showToast(`Booking successful for player ID: ${playerId}`, "success");

      setPlayers((prev) =>
        prev.map((p) => (p.id === playerId ? { ...p, status: "BOOKED" } : p))
      );
    } catch (err) {
      showToast(err.response?.data?.error || "Booking failed", "error");
    }
  };

  const showToast = (message, severity) => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = () => setToast({ ...toast, open: false });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "AVAILABLE":
        return green[500];
      case "BOOKED":
        return grey[500];
      case "PENDING":
        return orange[500];
      default:
        return deepPurple[300];
    }
  };

  return (
    <>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Available Players
        </Typography>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            background: "linear-gradient(135deg, #f3e5f5, #ede7f6)",
          }}
        >
          <Grid container spacing={2} justifyContent="space-around" alignItems="center">
            <Grid item xs={6} sm={3}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <People sx={{ color: "#673ab7", fontSize: 32 }} />
                <Typography variant="h6">Total</Typography>
                <Typography variant="h5" fontWeight="bold">{players.length}</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <SportsCricket sx={{ color: "#4caf50", fontSize: 32 }} />
                <Typography variant="h6">Available</Typography>
                <Typography variant="h5" fontWeight="bold">
                  {players.filter((p) => p.status === "AVAILABLE").length}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <CheckCircle sx={{ color: "#2196f3", fontSize: 32 }} />
                <Typography variant="h6">Booked</Typography>
                <Typography variant="h5" fontWeight="bold">
                  {players.filter((p) => p.status === "BOOKED").length}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <HourglassEmpty sx={{ color: "#ff9800", fontSize: 32 }} />
                <Typography variant="h6">Pending</Typography>
                <Typography variant="h5" fontWeight="bold">
                  {players.filter((p) => p.status === "PENDING").length}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Filter & Search */}
        <Paper elevation={2} sx={{ p: 2, mb: 4, borderRadius: 2, backgroundColor: "#f8f9fa" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Search by Name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined" sx={{ minWidth: 200 }}>
                <InputLabel id="city-label">City</InputLabel>
                <Select
                  labelId="city-label"
                  label="City"
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">All</MenuItem>
                  {[...new Set(players.map((p) => p.city))].map((city) => (
                    <MenuItem key={city} value={city}>
                      {city}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined" sx={{ minWidth: 200 }}>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  label="Role"
                  name="role"
                  value={filters.role}
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">All</MenuItem>
                  {[...new Set(players.map((p) => p.role))].map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined" sx={{ minWidth: 200 }}>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  label="Status"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">All</MenuItem>
                  {[...new Set(players.map((p) => p.status))].map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Player Cards */}
        <Grid container spacing={3}>
          {filteredPlayers.length ? (
            filteredPlayers.map((p) => (
              <Grid item xs={12} sm={6} md={4} key={p.id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: 4,
                    transition: "0.3s",
                    "&:hover": { boxShadow: 8, transform: "translateY(-4px)" },
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar
                        sx={{ bgcolor: deepPurple[500] }}
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${p.name}`}
                      />
                    }
                    title={
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {p.name}
                      </Typography>
                    }
                    subheader={p.role}
                    sx={{
                      background: "linear-gradient(90deg, #673ab7, #512da8)",
                      color: "white",
                    }}
                  />

                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>City:</strong> {p.city}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Wage:</strong> ₹{p.wage}
                    </Typography>

                    <Box sx={{ mt: 1, mb: 2 }}>
                      <Chip
                        label={p.status}
                        sx={{
                          backgroundColor: getStatusColor(p.status),
                          color: "white",
                          fontWeight: "bold",
                        }}
                      />
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        mt: 1,
                        background:
                          p.status === "AVAILABLE"
                            ? "linear-gradient(45deg, #4caf50, #2e7d32)"
                            : "linear-gradient(45deg, #9e9e9e, #616161)",
                      }}
                      onClick={() => handleBook(p.id)}
                      disabled={p.status !== "AVAILABLE"}
                    >
                      {p.status === "AVAILABLE" ? "Book Player" : "Not Available"}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography sx={{ ml: 2 }}>No players match the filters.</Typography>
          )}
        </Grid>
      </Container>

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
    </>
  );
}
