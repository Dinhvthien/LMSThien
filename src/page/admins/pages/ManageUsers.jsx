import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Typography } from '@mui/material';

async function getUsers() {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/lms/users`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log('API Response:', data); // Log raw response for debugging
    // Extract the 'result' array, ensure it's an array
    return Array.isArray(data.result) ? data.result : [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getUsers().then(data => {
      console.log('Processed Users:', data); // Log processed data
      setUsers(data); // Set users to the result array
      setLoading(false);
    }).catch(err => {
      setError(err.message);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage Users
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Adress</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.fullName || 'N/A'}</TableCell>
                  <TableCell>{user.email || 'N/A'}</TableCell>
                  <TableCell>{user.username || 'N/A'}</TableCell>
                      <TableCell>{user.phone || 'N/A'}</TableCell>
                       <TableCell>{user.address || 'N/A'}</TableCell>
                  <TableCell>
                    <Button variant="outlined" color="primary" size="small">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography>No users found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ManageUsers;