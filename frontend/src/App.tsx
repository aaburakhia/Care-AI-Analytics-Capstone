// frontend/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import LoginPage from './LoginPage';
import ProfilePage from './ProfilePage';
import SignUpPage from './SignUpPage';
import ConfirmEmailPage from './ConfirmEmailPage'; // NEW IMPORT

const ProtectedRoute: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading User Session...</div>;
    }
    
    return isAuthenticated ? <ProfilePage /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/confirm-email" element={<ConfirmEmailPage />} /> {/* NEW ROUTE */}
          <Route path="/profile" element={<ProtectedRoute />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;