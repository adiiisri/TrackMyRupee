import { createContext, useState, useContext, useCallback } from 'react';
import api from '../utils/axiosInstance';
import { useAuth } from './AuthContext';

const IncomeContext = createContext();

export const useIncome = () => {
  return useContext(IncomeContext);
};

export const IncomeProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchIncomes = useCallback(async (filters = {}) => {
    if (!user) return;
    setLoading(true);
    try {
      let query = '?';
      if (filters.source && filters.source !== 'All') query += `source=${filters.source}&`;
      if (filters.month) query += `month=${filters.month}&`;
      if (filters.year) query += `year=${filters.year}&`;
      if (filters.search) query += `search=${filters.search}&`;
      
      const { data } = await api.get(`/incomes${query}`);
      setIncomes(data);
    } catch (error) {
      console.error('Error fetching incomes:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addIncome = async (incomeData) => {
    try {
      const { data } = await api.post('/incomes', incomeData);
      setIncomes((prev) => [data, ...prev]);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  const deleteIncome = async (id) => {
    try {
      await api.delete(`/incomes/${id}`);
      setIncomes((prev) => prev.filter(i => i._id !== id));
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };

  const value = {
    incomes,
    loading,
    fetchIncomes,
    addIncome,
    deleteIncome,
  };

  return <IncomeContext.Provider value={value}>{children}</IncomeContext.Provider>;
};
