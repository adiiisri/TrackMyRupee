import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/axiosInstance';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        try {
          setUser(JSON.parse(userInfo));
        } catch (e) {
          localStorage.removeItem('userInfo');
        }
      }

      // Check url for oauth token
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (token) {
        try {
          // Set temporary token in localStorage so axios request interceptor picks it up
          localStorage.setItem('userInfo', JSON.stringify({ token }));
          const { data } = await api.get('/auth/me');
          const fullUser = { ...data, token };
          localStorage.setItem('userInfo', JSON.stringify(fullUser));
          setUser(fullUser);
        } catch (error) {
          console.error('OAuth profile fetch failed:', error);
          localStorage.removeItem('userInfo');
          setUser(null);
        }
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Network error connecting to backend'
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Network error connecting to backend'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
