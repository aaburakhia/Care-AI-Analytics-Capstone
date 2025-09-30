import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useAuth } from './AuthContext'; 

// IMPORTANT: Replace this with the actual LIVE URL of your BACKEND API on Vercel
// This must be the URL that shows the FastAPI "API is running!" message.
const API_URL = "https://care-ai-analytics-capstone.vercel.app"; 

const ProfilePage: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get the necessary state and functions from the AuthContext
  const { isAuthenticated, isLoading: isAuthLoading, logout } = useAuth(); 

  const handleLogout = () => {
    logout(); // Use the logout function from the context
  };

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        // If no token, redirect immediately to login
        window.location.href = '/login';
        return;
      }

      try {
        // *** CORRECT: Call the protected backend endpoint ***
        const response = await axios.get(`${API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // This line now gets the real email from your working backend!
        setUserEmail(response.data.email); 
        setError(null); 

      } catch (err: any) {
        // Handle token expiration or invalid token (401 Unauthorized)
        setError("Session expired or invalid. Please log in again.");
        logout(); // Force logout using the context function
      } finally {
        setIsLoading(false);
      }
    };
    
    // Only run the fetch if we are not in the initial AuthProvider loading state
    if (!isAuthLoading) {
        loadUser();
    }
  }, [isAuthLoading, logout]); // Added dependencies for correctness

  // --- Rendering Logic ---
  if (isLoading || isAuthLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  }

  if (error) {
    return (
        <Box sx={{ padding: 4, maxWidth: 400, margin: 'auto' }}>
            <Alert severity="error">{error}</Alert>
            <Button onClick={() => window.location.href = '/login'} variant="contained" sx={{ mt: 2, width: '100%' }}>Go to Login</Button>
        </Box>
    );
  }

  // If we have an email, show the profile
  if (userEmail) {
    return (
        <Box sx={{ padding: 4, maxWidth: 400, margin: 'auto', textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>User Profile</Typography>
          <Typography variant="h6" color="text.secondary" sx={{ wordBreak: 'break-all' }}>Email: {userEmail}</Typography>
          <Box sx={{ mt: 4 }}>
            <Button variant="contained" color="error" onClick={handleLogout} fullWidth>Logout</Button>
          </Box>
        </Box>
    );
  }
  
  // Fallback if something went wrong but not an error state (should redirect to login)
  return null;
};

export default ProfilePage;