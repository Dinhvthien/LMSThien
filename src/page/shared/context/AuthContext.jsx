import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Hàm gọi API introspect
const introspectToken = async (token) => {
  console.log('Calling introspect API with token:', token);
  try {
    const response = await axios.post(`${API_BASE_URL}/lms/auth/introspect`, { token });
    console.log('Introspect API response:', response.data);
    return response.data; // { result: { valid: boolean } }
  } catch (error) {
    console.error('Introspect API error:', error.message);
    return { result: { valid: false } };
  }
};

// Hàm gọi API refresh
const refreshToken = async (token) => {
  console.log('Calling refresh API with token:', token);
  try {
    const response = await axios.post(`${API_BASE_URL}/lms/auth/refresh`, { token });
    console.log('Refresh API response:', response.data);
    return response.data; // { result: { token: string } }
  } catch (error) {
    console.error('Refresh API error:', error.message);
    throw error;
  }
};

// Hàm gọi API logout
const logoutToken = async (token) => {
  console.log('Calling logout API with token:', token);
  try {
    await axios.post(`${API_BASE_URL}/lms/auth/logout`, { token });
    console.log('Logout API called successfully');
  } catch (error) {
    console.error('Logout API error:', error.message);
  }
};

// Tạo AuthContext
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hàm đăng nhập
  const login = async (username, password) => {
    console.log('Attempting login with username:', username);
    try {
      const response = await axios.post(`${API_BASE_URL}/lms/auth/authenticate`, {
        username,
        password,
      });
      console.log('Login successful, token:', response.data.result.token);
      localStorage.setItem('token', response.data.result.token);
      setToken(response.data.result.token);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login failed:', error.message);
      return false;
    }
  };

  // Hàm đăng xuất
  const logout = async () => {
    console.log('Logging out, clearing token');
    try {
      if (token) {
        await logoutToken(token);
      }
      localStorage.removeItem('token');
      setToken(null);
      setIsAuthenticated(false);
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error.message);
      localStorage.removeItem('token');
      setToken(null);
      setIsAuthenticated(false);
      window.location.href = '/login';
    }
  };

  // Kiểm tra trạng thái xác thực khi tải lại trang
  useEffect(() => {
    console.log('Page reloaded, starting authentication check');
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      console.log('Retrieved token from localStorage:', storedToken);

      if (!storedToken) {
        console.log('No token found, setting isAuthenticated to false');
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      // Gọi API introspect
      const introspectResponse = await introspectToken(storedToken);
      if (introspectResponse.result?.valid) {
        console.log('Token is valid, setting isAuthenticated to true');
        setToken(storedToken);
        setIsAuthenticated(true);
        setLoading(false);
        return;
      }

      // Nếu token không hợp lệ, thử làm mới
      console.log('Token is invalid, attempting to refresh');
      try {
        const refreshResponse = await refreshToken(storedToken);
        console.log('Token refreshed successfully, updating localStorage and state');
        localStorage.setItem('token', refreshResponse.result.token);
        setToken(refreshResponse.result.token);
        setIsAuthenticated(true);
      } catch (error) {
        console.log('Refresh failed, logging out');
        await logout(); // Đăng xuất tự động khi refresh thất bại
        error;
      } finally {
        console.log('Authentication check completed, setting loading to false');
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

// Hook để sử dụng AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};