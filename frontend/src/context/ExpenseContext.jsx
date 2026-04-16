import { createContext, useState, useContext, useCallback } from 'react';
import api from '../utils/axiosInstance';
import { useAuth } from './AuthContext';

const ExpenseContext = createContext();

export const useExpense = () => {
  return useContext(ExpenseContext);
};

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchExpenses = useCallback(async (filters = {}) => {
    if (!user) return;
    setLoading(true);
    try {
      let query = '?';
      if (filters.category && filters.category !== 'All') query += `category=${filters.category}&`;
      if (filters.month) query += `month=${filters.month}&`;
      if (filters.year) query += `year=${filters.year}&`;
      
      const { data } = await api.get(`/expenses${query}`);
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addExpense = async (expenseData) => {
    try {
      const { data } = await api.post('/expenses', expenseData);
      setExpenses((prev) => [data, ...prev]);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  const deleteExpense = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      setExpenses((prev) => prev.filter(e => e._id !== id));
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };

  const fetchBudgets = useCallback(async (month, year) => {
    if(!user) return;
    try {
      const { data } = await api.get(`/budgets?month=${month}&year=${year}`);
      setBudgets(data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  }, [user]);

  const saveBudget = async (budgetData) => {
    try {
      const { data } = await api.post('/budgets', budgetData);
      // Update local state
      setBudgets(prev => {
        const existing = prev.findIndex(b => b.category === data.category);
        if(existing >= 0) {
          const newBudgets = [...prev];
          newBudgets[existing] = data;
          return newBudgets;
        }
        return [...prev, data];
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  const value = {
    expenses,
    budgets,
    loading,
    fetchExpenses,
    addExpense,
    deleteExpense,
    fetchBudgets,
    saveBudget
  };

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
};
