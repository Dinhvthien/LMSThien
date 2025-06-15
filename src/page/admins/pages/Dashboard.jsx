import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';

function Dashboard() {
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h4">150</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Courses</Typography>
            <Typography variant="h4">25</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Active Sessions</Typography>
            <Typography variant="h4">10</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;