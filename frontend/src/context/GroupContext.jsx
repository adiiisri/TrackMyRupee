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

  const selectGroup = async (group) => {
    setActiveGroup(group);
    if (group) {
      await fetchGroupBalances(group._id);
    } else {
      setActiveBalances(null);
    }
  };

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

  const createGroup = async (groupData) => {
    try {
      const { data } = await api.post('/groups', groupData);
      setGroups((prev) => [data, ...prev]);
      setActiveGroup(data);
      await fetchGroupBalances(data._id);
      return { success: true, group: data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  const logGroupExpense = async (groupId, expenseData) => {
    try {
      const { data } = await api.post(`/groups/${groupId}/expenses`, expenseData);
      await fetchGroupBalances(groupId);
      return { success: true, expense: data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  const value = {
    groups,
    activeGroup,
    activeBalances,
    loading,
    fetchGroups,
    selectGroup,
    fetchGroupBalances,
    createGroup,
    logGroupExpense,
  };

  return <GroupContext.Provider value={value}>{children}</GroupContext.Provider>;
};
