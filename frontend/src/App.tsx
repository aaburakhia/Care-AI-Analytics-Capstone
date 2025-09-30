// frontend/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext'; // <-- Import AuthProvider and useAuth hook
import LoginPage from './LoginPage'; 
import ProfilePage from './ProfilePage';
import SignUpPage from './SignUpPage'; // <-- Make sure this file exists!

// --- Protected Route Component ---
// This component checks the login status from the AuthContext before showing a page.
const ProtectedRoute: React.FC = () => {
    // Use the hook to get the state
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
        // Show a simple loading indicator while checking for a token
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading User Session...</div>; 
    }

    // If authenticated, show the profile. If not, redirect to login.
    return isAuthenticated ? <ProfilePage /> : <Navigate to="/login" replace />;
};


function App() {
  return (
    // Wrap the entire app in the AuthProvider so all components can check the login status
    <AuthProvider> 
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} /> {/* NEW ROUTE */}
          
          {/* Protected Route - Only accessible if authenticated */}
          <Route path="/profile" element={<ProtectedRoute />} /> 
          
          {/* Default Route: Redirects to /login if not authenticated, or /profile if authenticated */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;