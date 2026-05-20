import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/axiosInstance';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const mockUser = {
  _id: 'mock-user-id',
  name: 'Demo User',
  email: 'demo@example.com',
  token: 'mock-token'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(mockUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Automatically set mock user on load
    setUser(mockUser);
    localStorage.setItem('userInfo', JSON.stringify(mockUser));
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setUser(mockUser);
    localStorage.setItem('userInfo', JSON.stringify(mockUser));
    return { success: true };
  };

  const register = async (name, email, password) => {
    setUser(mockUser);
    localStorage.setItem('userInfo', JSON.stringify(mockUser));
    return { success: true };
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
