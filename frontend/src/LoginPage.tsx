// frontend/src/LoginPage.tsx
import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Alert } from '@mui/material';
import axios from 'axios';
import { useAuth } from './AuthContext';

const API_URL = "https://care-ai-analytics-capstone.vercel.app";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Email:', email);
    console.log('API URL:', API_URL);
    
    try {
      console.log('Sending request to backend...');
      
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: email,
        password: password,
      });
      
      console.log('Backend response:', response.data);
      console.log('Access token received:', response.data.access_token ? 'YES' : 'NO');
      
      if (response.data.access_token) {
        console.log('Calling login() from context...');
        login(response.data.access_token, response.data.email || email);
        
        console.log('Redirecting to /profile...');
        window.location.href = '/profile';
      } else {
        console.error('No access token in response!');
        setError('No access token received from server.');
      }
    } catch (err: any) {
      console.error('=== LOGIN ERROR ===');
      console.error('Full error:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      
      if (err.response?.status === 401) {
        setError('Invalid email or password.');
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.message === 'Network Error') {
        setError('Cannot connect to server. Please check your internet connection.');
      } else {
        setError(`Login failed: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 400, margin: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <form onSubmit={handleLogin}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required
          disabled={isLoading}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          variant="contained" 
          fullWidth 
          sx={{ mt: 2 }}
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
      <Button 
        onClick={() => window.location.href = '/signup'} 
        sx={{ mt: 1 }}
        disabled={isLoading}
      >
        Don't have an account? Sign Up
      </Button>
    </Box>
  );
};

export default LoginPage;