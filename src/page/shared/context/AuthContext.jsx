// shared/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';
 const apiUrl = import.meta.env.VITE_API_URL;
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
const navigate = useNavigate();

  // Load token từ localStorage khi load app
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      verifyToken(savedToken); // Kiểm tra token ngay khi load
    }
  }, []);

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    navigate.push('/login');
  };

  const verifyToken = async (tokenToCheck) => {
    console.log("1");
    try {
      const res = await axios.post(`${apiUrl}/lms/auth/introspect`, {
        token: tokenToCheck,
      });

      if (!res.data.active) {
        await refreshAccessToken(tokenToCheck);
      }
    } catch (err) {
      console.error('Introspect error:', err);
      logout();
    }
  };

  const refreshAccessToken = async (expiredToken) => {
    console.log("2");
    try {
      const res = await axios.post(`${apiUrl}/lms/auth/refresh`, {
        token: expiredToken,
      });

      const newToken = res.data.token;
      setToken(newToken);
      localStorage.setItem('token', newToken);
    } catch (err) {
      console.error('Token refresh failed:', err);
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, verifyToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
