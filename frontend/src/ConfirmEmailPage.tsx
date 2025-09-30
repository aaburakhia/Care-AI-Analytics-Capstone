// frontend/src/ConfirmEmailPage.tsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ConfirmEmailPage: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase adds the token to the URL fragment (after #)
    const hash = window.location.hash;
    
    if (hash && hash.includes('access_token')) {
      // Extract token from URL
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      
      if (accessToken) {
        setStatus('success');
        setMessage('Email verified successfully! You can now log in.');
      } else {
        setStatus('error');
        setMessage('Invalid verification link.');
      }
    } else {
      setStatus('error');
      setMessage('No verification token found.');
    }
  }, []);

  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Verifying your email...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4, maxWidth: 400, margin: 'auto', textAlign: 'center' }}>
      {status === 'success' ? (
        <>
          <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>
          <Button variant="contained" fullWidth onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </>
      ) : (
        <>
          <Alert severity="error" sx={{ mb: 2 }}>{message}</Alert>
          <Button variant="outlined" fullWidth onClick={() => navigate('/signup')}>
            Back to Sign Up
          </Button>
        </>
      )}
    </Box>
  );
};

export default ConfirmEmailPage;