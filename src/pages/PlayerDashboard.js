import React, { useEffect, useState } from "react";
import API from "../api/api";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
} from "@mui/material";
import Navbar from "../components/Navbar";

export default function PlayerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/bookings/player")
      .then((res) => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "success";
      case "PENDING":
        return "warning";
      case "CANCELLED":
        return "error";
      default:
        return "default";
    }
  };

  if (loading)
    return (
      <>
        <Navbar />
        <Container sx={{ mt: 10, textAlign: "center" }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading your bookings...
          </Typography>
        </Container>
      </>
    );

  return (
    <>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Bookings
        </Typography>

        {bookings.length === 0 ? (
          <Typography>No bookings found.</Typography>
        ) : (
          <Grid container spacing={3}>
            {bookings.map((b) => (
              <Grid item xs={12} sm={6} md={4} key={b.id}>
                <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6">
                      {b.recruiter?.teamName || "Unknown Recruiter"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Location: {b.recruiter?.location || "N/A"}
                    </Typography>
                    <Typography sx={{ mt: 1 }}>
                      Type: {b.type}
                    </Typography>
                    <Typography>Date: {b.date}</Typography>
                    <Chip
                      label={b.status}
                      color={getStatusColor(b.status)}
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
}
