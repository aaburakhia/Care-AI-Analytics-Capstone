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
    
    try {
      console.log('Attempting login for:', email); // DEBUG
      
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: email,
        password: password,
      });
      
      console.log('Login response:', response.data); // DEBUG
      
      if (response.data.access_token) {
        login(response.data.access_token, email);
        window.location.href = '/profile';
      } else {
        setError('No access token received from server.');
      }
    } catch (err: any) {
      console.error('Login error:', err); // DEBUG
      
      if (err.response?.status === 401) {
        setError('Invalid email or password.');
      } else if (err.response?.data?.detail) {
        // Check if it's an email verification issue
        const detail = err.response.data.detail;
        if (detail.includes('Email not confirmed') || detail.includes('verify')) {
          setError('Please verify your email before logging in. Check your inbox for the verification link.');
        } else {
          setError(detail);
        }
      } else if (err.message === 'Network Error') {
        setError('Cannot connect to server. Please check your internet connection.');
      } else {
        setError('Login failed. Please try again later.');
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