import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from './AuthContext';

const GoalContext = createContext();

export const useGoal = () => useContext(GoalContext);

export const GoalProvider = ({ children }) => {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGoals = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/api/goals');
      setGoals(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching goals');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addGoal = async (goalData) => {
    try {
      const { data } = await axiosInstance.post('/api/goals', goalData);
      setGoals(prev => [data, ...prev]);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Error creating goal' };
    }
  };

  const addFunds = async (goalId, amount) => {
    try {
      const { data } = await axiosInstance.put(`/api/goals/${goalId}/add-funds`, { amount });
      setGoals(prev => prev.map(g => g._id === goalId ? data : g));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Error adding funds' };
    }
  };

  const deleteGoal = async (goalId) => {
    try {
      await axiosInstance.delete(`/api/goals/${goalId}`);
      setGoals(prev => prev.filter(g => g._id !== goalId));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Error deleting goal' };
    }
  };

  useEffect(() => {
    if (user) {
      fetchGoals();
    } else {
      setGoals([]);
    }
  }, [user, fetchGoals]);

  return (
    <GoalContext.Provider value={{ goals, loading, error, fetchGoals, addGoal, addFunds, deleteGoal }}>
      {children}
    </GoalContext.Provider>
  );
};
