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
    // Check if user is logged in
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    
    // Check url for oauth token
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if(token) {
      // Simulate getting user details from token/api in real app
      // For now just structure it so that the token is saved.
      // This part would ideally invoke an API /me to get user details
      const mockOAuthUser = { token, email: 'oauth@google.com', name: 'Google User' };
      localStorage.setItem('userInfo', JSON.stringify(mockOAuthUser));
      setUser(mockOAuthUser);
      window.history.replaceState({}, document.title, "/"); 
    }

    setLoading(false);
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
