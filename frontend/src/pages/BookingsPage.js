import React, { useEffect, useState } from "react";
import API from "../api/api";
import { Container, Typography, Grid, Card, CardContent } from "@mui/material";

export default function PlayerBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    API.get("/bookings/player")
      .then((res) => setBookings(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>My Bookings</Typography>
      <Grid container spacing={3}>
        {bookings.map((b) => (
          <Grid item xs={12} sm={6} md={4} key={b.id}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography><strong>Match:</strong> {b.matchName}</Typography>
                <Typography><strong>Date:</strong> {b.date}</Typography>
                <Typography><strong>Status:</strong> {b.status}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {bookings.length === 0 && <Typography>No bookings found</Typography>}
      </Grid>
    </Container>
  );
}
