// frontend/src/AuthContext.tsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// IMPORTANT: Replace this with the actual LIVE URL of your BACKEND API on Vercel
const API_URL = "https://care-ai-analytics-capstone.vercel.app";

// 1. Define the shape of the context data
interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  isLoading: boolean;
  login: (token: string, email: string) => void;
  logout: () => void;
}

// 2. Create the Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Create the Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Effect to check for an existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // We can't easily verify the token without calling the backend here, 
      // so for the MVP, we assume the token's presence means the user is logged in.
      // In a real app, you would call /users/me here to validate the token.
      setIsAuthenticated(true);
      // For now, we'll leave userEmail null and let LoginPage/ProfilePage fetch it.
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, email: string) => {
    localStorage.setItem('access_token', token);
    setUserEmail(email);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUserEmail(null);
    setIsAuthenticated(false);
    // Redirect the user to the login page
    window.location.href = '/login'; 
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    userEmail,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Create a custom hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};