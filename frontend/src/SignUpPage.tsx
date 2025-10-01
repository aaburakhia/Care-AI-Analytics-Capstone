// frontend/src/SignUpPage.tsx
import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Alert } from '@mui/material';
import axios from 'axios';

const API_URL = "https://care-ai-analytics-capstone.vercel.app"; 

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        email: email,
        password: password,
      });
      
      setMessage('Account created successfully! You can now log in.');
      setEmail('');
      setPassword('');
      
      // Auto-redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      
    } catch (err: any) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 400, margin: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>Create Account</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {message && <Alert severity="success">{message}</Alert>}
      <form onSubmit={handleSignUp}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          label="Password (Min 6 characters)"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
          inputProps={{ minLength: 6 }}
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Sign Up
        </Button>
      </form>
      <Button onClick={() => window.location.href = '/login'} sx={{ mt: 1 }}>
        Already have an account? Login
      </Button>
    </Box>
  );
};

export default SignUpPage;