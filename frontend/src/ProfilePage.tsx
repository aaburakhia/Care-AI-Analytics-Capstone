// frontend/src/ProfilePage.tsx

import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Alert, CircularProgress } from '@mui/material'; // Assuming you use Material-UI for a clean look
import axios from 'axios';

// IMPORTANT: Replace this with the actual URL of your deployed FastAPI backend on Vercel
const API_URL = "https://care-ai-analytics-capstone.vercel.app/"; 

// --- Component Definition ---
const ProfilePage: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to handle the logout logic
  const handleLogout = () => {
    // 1. Clear the access_token from local storage
    localStorage.removeItem('access_token'); 
    
    // 2. Redirect the user back to the Login screen (assuming your router is set up for '/login')
    window.location.href = '/login'; 
  };

  // Effect to run when the component first loads
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        // If no token is found, redirect immediately to login
        window.location.href = '/login';
        return;
      }

      try {
        // Call the protected backend endpoint
        const response = await axios.get(`${API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Assuming the backend returns { "email": "user@example.com", "user_id": "..." }
        setUserEmail(response.data.email); 
        setError(null); // Clear any previous errors

      } catch (err) {
        // Handle token expiration or invalid token (401 Unauthorized)
        setError("Session expired or invalid. Please log in again.");
        handleLogout(); // Force logout
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []); // Empty dependency array means this runs once on mount

  // --- Rendering Logic ---
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
        <Box sx={{ padding: 4, maxWidth: 400, margin: 'auto' }}>
            <Alert severity="error">{error}</Alert>
            <Button 
                onClick={() => window.location.href = '/login'} 
                variant="contained" 
                sx={{ mt: 2, width: '100%' }}
            >
                Go to Login
            </Button>
        </Box>
    );
  }

  return (
    <Box sx={{ padding: 4, maxWidth: 400, margin: 'auto', textAlign: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        User Profile
      </Typography>
      
      <Typography variant="h6" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
        Email: {userEmail}
      </Typography>
      
      <Box sx={{ mt: 4 }}>
        <Button 
          variant="contained" 
          color="error" 
          onClick={handleLogout}
          fullWidth
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default ProfilePage;