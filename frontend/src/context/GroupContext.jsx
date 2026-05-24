import { createContext, useState, useContext, useCallback } from 'react';
import api from '../utils/axiosInstance';
import { useAuth } from './AuthContext';

const GroupContext = createContext();

export const useGroup = () => {
  return useContext(GroupContext);
};

export const GroupProvider = ({ children }) => {
  const [groups, setGroups] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null);
  const [activeBalances, setActiveBalances] = useState(null);
  const [activeExpenses, setActiveExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchGroups = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await api.get('/groups');
      setGroups(data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchGroupExpenses = useCallback(async (groupId) => {
    try {
      const { data } = await api.get(`/groups/${groupId}/expenses`);
      setActiveExpenses(data);
    } catch (error) {
      console.error('Error fetching group expenses:', error);
    }
  }, []);

  const fetchGroupBalances = async (groupId) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/groups/${groupId}/balances`);
      setActiveBalances(data);
    } catch (error) {
      console.error('Error fetching group balances:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectGroup = async (group) => {
    setActiveGroup(group);
    if (group) {
      await Promise.all([
        fetchGroupBalances(group._id),
        fetchGroupExpenses(group._id)
      ]);
    } else {
      setActiveBalances(null);
      setActiveExpenses([]);
    }
  };

  const createGroup = async (groupData) => {
    try {
      const { data } = await api.post('/groups', groupData);
      setGroups((prev) => [data, ...prev]);
      setActiveGroup(data);
      await Promise.all([
        fetchGroupBalances(data._id),
        fetchGroupExpenses(data._id)
      ]);
      return { success: true, group: data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  const updateGroup = async (groupId, groupData) => {
    try {
      const { data } = await api.put(`/groups/${groupId}`, groupData);
      setGroups((prev) => prev.map((g) => (g._id === groupId ? data : g)));
      setActiveGroup(data);
      await Promise.all([
        fetchGroupBalances(groupId),
        fetchGroupExpenses(groupId)
      ]);
      return { success: true, group: data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  const deleteGroup = async (groupId) => {
    try {
      await api.delete(`/groups/${groupId}`);
      setGroups((prev) => prev.filter((g) => g._id !== groupId));
      if (activeGroup?._id === groupId) {
        setActiveGroup(null);
        setActiveBalances(null);
        setActiveExpenses([]);
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  const logGroupExpense = async (groupId, expenseData) => {
    try {
      const { data } = await api.post(`/groups/${groupId}/expenses`, expenseData);
      await Promise.all([
        fetchGroupBalances(groupId),
        fetchGroupExpenses(groupId)
      ]);
      return { success: true, expense: data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  const updateGroupExpense = async (groupId, expenseId, expenseData) => {
    try {
      const { data } = await api.put(`/groups/${groupId}/expenses/${expenseId}`, expenseData);
      await Promise.all([
        fetchGroupBalances(groupId),
        fetchGroupExpenses(groupId)
      ]);
      return { success: true, expense: data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  const deleteGroupExpense = async (groupId, expenseId) => {
    try {
      await api.delete(`/groups/${groupId}/expenses/${expenseId}`);
      await Promise.all([
        fetchGroupBalances(groupId),
        fetchGroupExpenses(groupId)
      ]);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  const value = {
    groups,
    activeGroup,
    activeBalances,
    activeExpenses,
    loading,
    fetchGroups,
    selectGroup,
    fetchGroupBalances,
    fetchGroupExpenses,
    createGroup,
    updateGroup,
    deleteGroup,
    logGroupExpense,
    updateGroupExpense,
    deleteGroupExpense,
  };

  return <GroupContext.Provider value={value}>{children}</GroupContext.Provider>;
};

