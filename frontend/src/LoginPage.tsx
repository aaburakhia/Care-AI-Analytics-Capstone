// frontend/src/LoginPage.tsx
import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Alert } from '@mui/material';
import axios from 'axios';

const API_URL = "https://care-ai-analytics-capstone.vercel.app";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await axios.post(`${API_URL}/token`, formData);
      
      localStorage.setItem('access_token', response.data.access_token);
      window.location.href = '/profile';
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 400, margin: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleLogin}>
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
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Login
        </Button>
      </form>
    </Box>
  );
};

export default LoginPage;