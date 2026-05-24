import { useState, useEffect } from 'react';
import { useGroup } from '../context/GroupContext';
import { useAuth } from '../context/AuthContext';
import { Plus, Users, RefreshCw, Send, CheckCircle2, UserPlus, Trash2, Edit2, Settings, X, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Bills', 'Other'];

const GroupsManager = () => {
  const {
    groups,
    activeGroup,
    activeBalances,
    activeExpenses,
    loading,
    fetchGroups,
    selectGroup,
    createGroup,
    updateGroup,
    deleteGroup,
    logGroupExpense,
    updateGroupExpense,
    deleteGroupExpense,
  } = useGroup();

  const { user } = useAuth();

  // Tab: 'log', 'history', or 'balances'
  const [activeTab, setActiveTab] = useState('log');

  // Create Group Form State
  const [newGroupName, setNewGroupName] = useState('');
  const [memberEmailInput, setMemberEmailInput] = useState('');
  const [invitedMembers, setInvitedMembers] = useState([]);

  // Edit Group / Member Management State
  const [isEditingGroup, setIsEditingGroup] = useState(false);
  const [editGroupName, setEditGroupName] = useState('');
  const [editGroupMembers, setEditGroupMembers] = useState([]);
  const [editMemberEmailInput, setEditMemberEmailInput] = useState('');

  // Log Expense Form State
  const [expenseFormData, setExpenseFormData] = useState({
    amount: '',
    category: 'Food',
    description: '',
    paidBy: '',
    splitType: 'equal', // 'equal' or 'unequal'
  });
  const [unequalSplits, setUnequalSplits] = useState({});

  // Edit Expense Form State
  const [editingExpense, setEditingExpense] = useState(null);
  const [editExpenseFormData, setEditExpenseFormData] = useState({
    amount: '',
    category: 'Food',
    description: '',
    paidBy: '',
    splitType: 'equal',
    date: '',
  });
  const [editExpenseUnequalSplits, setEditExpenseUnequalSplits] = useState({});

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  // Set default payer and splits when activeGroup changes
  useEffect(() => {
    if (activeGroup && user) {
      setExpenseFormData((prev) => ({
        ...prev,
        paidBy: user._id,
      }));

      // Initialize unequal splits map
      const initialSplits = {};
      activeGroup.members.forEach((m) => {
        initialSplits[m._id] = '';
      });
      setUnequalSplits(initialSplits);

      // Revert editing panels
      setIsEditingGroup(false);
      setEditingExpense(null);
    }
  }, [activeGroup, user]);

  // Member invites (Create Group)
  const handleAddMemberEmail = (e) => {
    e.preventDefault();
    const trimmed = memberEmailInput.trim().toLowerCase();
    if (!trimmed) return;
    if (!trimmed.includes('@')) return alert('Please enter a valid email address');
    if (invitedMembers.includes(trimmed)) return alert('This email is already added');
    if (trimmed === user?.email) return alert('You are already included automatically as the creator');

    setInvitedMembers((prev) => [...prev, trimmed]);
    setMemberEmailInput('');
  };

  const handleRemoveInvitedEmail = (email) => {
    setInvitedMembers((prev) => prev.filter((e) => e !== email));
  };

  const handleCreateGroupSubmit = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return alert('Group name is required');

    const res = await createGroup({
      name: newGroupName.trim(),
      members: invitedMembers,
    });

    if (res.success) {
      setNewGroupName('');
      setInvitedMembers([]);
      setActiveTab('log');
    } else {
      alert(res.error || 'Failed to create group');
    }
  };

  // Member edits (Manage Group)
  const handleStartEditGroup = () => {
    if (!activeGroup) return;
    setEditGroupName(activeGroup.name);
    // Initialize with current group member email/ids
    setEditGroupMembers(activeGroup.members.map(m => m.email || m._id));
    setIsEditingGroup(true);
  };

  const handleAddEditMemberEmail = (e) => {
    e.preventDefault();
    const trimmed = editMemberEmailInput.trim().toLowerCase();
    if (!trimmed) return;
    if (!trimmed.includes('@')) return alert('Please enter a valid email address');
    if (editGroupMembers.includes(trimmed)) return alert('This email is already added');

    setEditGroupMembers((prev) => [...prev, trimmed]);
    setEditMemberEmailInput('');
  };

  const handleRemoveEditMember = (identifier) => {
    // Cannot remove group creator
    const creatorMember = activeGroup.members.find(m => m._id === activeGroup.creator);
    const isCreator = identifier === activeGroup.creator || (creatorMember && (identifier === creatorMember.email || identifier === creatorMember._id));
    if (isCreator) {
      return alert('Group creator cannot be removed from the circle');
    }
    setEditGroupMembers((prev) => prev.filter((m) => m !== identifier && m !== identifier._id));
  };

  const handleUpdateGroupSubmit = async (e) => {
    e.preventDefault();
    if (!editGroupName.trim()) return alert('Group name is required');

    const res = await updateGroup(activeGroup._id, {
      name: editGroupName.trim(),
      members: editGroupMembers,
    });

    if (res.success) {
      alert('Group members updated successfully!');
      setIsEditingGroup(false);
    } else {
      alert(res.error || 'Failed to update group members');
    }
  };

  const handleDeleteGroup = async (groupObj) => {
    const targetGroup = groupObj || activeGroup;
    if (!targetGroup) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete the group "${targetGroup.name}"? This will permanently delete all logged expenses and balance standings. This action CANNOT be undone.`
    );
    if (!confirmDelete) return;

    const res = await deleteGroup(targetGroup._id);
    if (res.success) {
      alert('Group circle deleted successfully!');
    } else {
      alert(res.error || 'Failed to delete group circle');
    }
  };

  // Unequal split total calculator (Log Expense)
  const getUnequalSplitsTotal = () => {
    return Object.values(unequalSplits).reduce((sum, val) => sum + (Number(val) || 0), 0);
  };

  const getUnequalSplitsRemaining = () => {
    const totalAmount = Number(expenseFormData.amount) || 0;
    return Number((totalAmount - getUnequalSplitsTotal()).toFixed(2));
  };

  // Log Expense Submission
  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    const amount = Number(expenseFormData.amount);
    if (!amount || amount <= 0) return alert('Please enter a valid amount');
    if (!expenseFormData.description.trim()) return alert('Please enter a description');

    let payload = {
      amount,
      category: expenseFormData.category,
      description: expenseFormData.description.trim(),
      paidBy: expenseFormData.paidBy,
    };

    if (expenseFormData.splitType === 'unequal') {
      const remaining = getUnequalSplitsRemaining();
      if (Math.abs(remaining) > 0.01) {
        return alert(`The sum of split shares must exactly match the bill of ₹${amount}. Current mismatch: ₹${remaining}`);
      }

      payload.splits = Object.keys(unequalSplits).map((memberId) => ({
        user: memberId,
        amount: Number(unequalSplits[memberId]) || 0,
      }));
    }

    const res = await logGroupExpense(activeGroup._id, payload);
    if (res.success) {
      alert('Group expense logged successfully!');
      setExpenseFormData({
        amount: '',
        category: 'Food',
        description: '',
        paidBy: user?._id || '',
        splitType: 'equal',
      });
      const resetSplits = {};
      activeGroup.members.forEach((m) => {
        resetSplits[m._id] = '';
      });
      setUnequalSplits(resetSplits);
      setActiveTab('history');
    } else {
      alert(res.error || 'Failed to log expense');
    }
  };

  // Edit Expense Setup
  const handleStartEditExpense = (expense) => {
    setEditingExpense(expense);
    setEditExpenseFormData({
      amount: expense.amount.toString(),
      category: expense.category,
      description: expense.description,
      paidBy: expense.paidBy?._id || expense.paidBy,
      splitType: expense.splits && expense.splits.length > 0 ? 'unequal' : 'equal',
      date: new Date(expense.date).toISOString().split('T')[0],
    });

    const splitsMap = {};
    activeGroup.members.forEach((m) => {
      const foundSplit = expense.splits?.find((s) => (s.user?._id || s.user).toString() === m._id.toString());
      splitsMap[m._id] = foundSplit ? foundSplit.amount.toString() : '';
    });
    setEditExpenseUnequalSplits(splitsMap);
  };

  // Unequal split total calculator (Edit Expense)
  const getEditUnequalSplitsTotal = () => {
    return Object.values(editExpenseUnequalSplits).reduce((sum, val) => sum + (Number(val) || 0), 0);
  };

  const getEditUnequalSplitsRemaining = () => {
    const totalAmount = Number(editExpenseFormData.amount) || 0;
    return Number((totalAmount - getEditUnequalSplitsTotal()).toFixed(2));
  };

  // Edit Expense Submission
  const handleEditExpenseSubmit = async (e) => {
    e.preventDefault();
    const amount = Number(editExpenseFormData.amount);
    if (!amount || amount <= 0) return alert('Please enter a valid amount');
    if (!editExpenseFormData.description.trim()) return alert('Please enter a description');

    let payload = {
      amount,
      category: editExpenseFormData.category,
      description: editExpenseFormData.description.trim(),
      paidBy: editExpenseFormData.paidBy,
      date: editExpenseFormData.date,
    };

    if (editExpenseFormData.splitType === 'unequal') {
      const remaining = getEditUnequalSplitsRemaining();
      if (Math.abs(remaining) > 0.01) {
        return alert(`The sum of split shares must exactly match the bill of ₹${amount}. Current mismatch: ₹${remaining}`);
      }

      payload.splits = Object.keys(editExpenseUnequalSplits).map((memberId) => ({
        user: memberId,
        amount: Number(editExpenseUnequalSplits[memberId]) || 0,
      }));
    } else {
      payload.splits = []; // triggers equal split recalculation on backend
    }

    const res = await updateGroupExpense(activeGroup._id, editingExpense._id, payload);
    if (res.success) {
      alert('Group expense updated successfully!');
      setEditingExpense(null);
    } else {
      alert(res.error || 'Failed to update expense');
    }
  };

  // Delete Group Expense
  const handleDeleteExpense = async (expenseId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this group expense? This will recalculate everyone\'s balances.');
    if (!confirmDelete) return;

    const res = await deleteGroupExpense(activeGroup._id, expenseId);
    if (res.success) {
      alert('Expense deleted successfully!');
    } else {
      alert(res.error || 'Failed to delete expense');
    }
  };

  // Interactive Settle Up Action
  const handleSettleUp = async (settlement) => {
    const confirmSettle = window.confirm(
      `Log settlement payment: Did ${settlement.from.name} pay ${settlement.to.name} ₹${settlement.amount.toLocaleString()}?`
    );
    if (!confirmSettle) return;

    const payload = {
      amount: settlement.amount,
      category: 'Other',
      description: `Settlement: ${settlement.from.name} to ${settlement.to.name}`,
      paidBy: settlement.from._id,
      splits: [
        { user: settlement.from._id, amount: settlement.amount },
        { user: settlement.to._id, amount: 0 },
      ],
    };

    activeGroup.members.forEach((m) => {
      if (m._id !== settlement.from._id && m._id !== settlement.to._id) {
        payload.splits.push({ user: m._id, amount: 0 });
      }
    });

    const res = await logGroupExpense(activeGroup._id, payload);
    if (res.success) {
      alert('Settlement logged! Balance updated.');
    } else {
      alert(res.error || 'Failed to settle balance');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container animate-fade-in"
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', padding: '1rem 0' }}
    >
      {/* LEFT COLUMN: Groups Management */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Create Group Form Card */}
        <div className="card" style={{ padding: '2rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Users color="var(--accent-primary)" size={24} /> Create a Splitting Group
          </h3>
          <form onSubmit={handleCreateGroupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Group Circle Name</label>
              <input
                type="text"
                placeholder="e.g. Goa Trip, Flatmates Room 1"
                required
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                style={{ marginTop: '0.25rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Invite Members (by email)</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                <input
                  type="email"
                  placeholder="friend@example.com"
                  value={memberEmailInput}
                  onChange={(e) => setMemberEmailInput(e.target.value)}
                />
                <button type="button" onClick={handleAddMemberEmail} className="btn btn-outline" style={{ padding: '0.75rem 1rem' }}>
                  <UserPlus size={18} />
                </button>
              </div>

              {/* Tag badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                <AnimatePresence>
                  {invitedMembers.map((email) => (
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      key={email}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.75rem',
                        backgroundColor: 'var(--accent-light)',
                        color: 'var(--accent-hover)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '12px',
                        fontWeight: 600,
                      }}
                    >
                      {email}
                      <button
                        type="button"
                        onClick={() => handleRemoveInvitedEmail(email)}
                        style={{ color: 'var(--accent-hover)', display: 'inline-flex', padding: 0, fontSize: '0.75rem' }}
                      >
                        ×
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              Create Group Circle
            </button>
          </form>
        </div>

        {/* List of Active Group Circles */}
        <div className="card" style={{ padding: '2rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
          <h3 style={{ marginBottom: '1.25rem' }}>Your Group Circles</h3>
          {loading && groups.length === 0 ? (
            <p>Loading groups...</p>
          ) : groups.length === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Users size={36} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
              <p style={{ fontSize: '0.875rem' }}>No group circles joined yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {groups.map((group) => {
                const isActive = activeGroup?._id === group._id;
                return (
                  <motion.div
                    key={group._id}
                    onClick={() => selectGroup(group)}
                    whileHover={{ scale: 1.02 }}
                    style={{
                      padding: '1rem 3rem 1rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      background: isActive ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                      borderColor: isActive ? 'var(--accent-primary)' : 'var(--border-color)',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <h4 style={{ color: isActive ? 'var(--accent-hover)' : 'var(--text-primary)', margin: 0 }}>
                        {group.name}
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        {group.members.length} members • Created by {group.creator === user?._id ? 'You' : 'Friend'}
                      </p>
                    </div>
                    {group.creator === user?._id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteGroup(group);
                        }}
                        title="Delete Group Circle"
                        style={{
                          position: 'absolute',
                          right: '1rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'var(--danger)',
                          padding: '0.25rem',
                          display: 'inline-flex',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Active Workspace */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">
          {!activeGroup ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="card"
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4rem 2rem',
                border: '1px solid var(--border-color)',
                textAlign: 'center',
                color: 'var(--text-muted)',
                background: 'var(--bg-secondary)',
              }}
            >
              <Users size={64} style={{ marginBottom: '1.5rem', color: 'var(--accent-primary)', opacity: 0.7 }} />
              <h3>No Circle Selected</h3>
              <p style={{ maxWidth: '300px', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                Select an existing group circle from the left list or create a brand new one to start splitting bills!
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              key={activeGroup._id}
              className="card"
              style={{
                padding: '2rem',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
              }}
            >
              {/* Header with Manage Members action */}
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', position: 'relative' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-hover)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Active Workspace
                </span>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                  <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{activeGroup.name}</h2>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button
                      onClick={handleStartEditGroup}
                      title="Manage Members"
                      style={{ color: 'var(--accent-primary)', padding: '0.25rem', display: 'inline-flex' }}
                    >
                      <Settings size={20} />
                    </button>
                    {activeGroup.creator === user?._id && (
                      <button
                        onClick={() => handleDeleteGroup(activeGroup)}
                        title="Delete Group Circle"
                        style={{ color: 'var(--danger)', padding: '0.25rem', display: 'inline-flex' }}
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.75rem' }}>
                  {activeGroup.members.map((m) => (
                    <span
                      key={m._id}
                      style={{
                        fontSize: '0.7rem',
                        padding: '0.15rem 0.4rem',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-secondary)',
                        fontWeight: 500,
                      }}
                      title={m.email}
                    >
                      {m.name} {m._id === user?._id && '(You)'}
                    </span>
                  ))}
                </div>
              </div>

              {/* Inline Edit Group Panel */}
              <AnimatePresence>
                {isEditingGroup && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{
                      padding: '1.25rem',
                      border: '1px solid var(--accent-primary)',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-tertiary)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ margin: 0 }}>Manage Group Circle</h4>
                      <button onClick={() => setIsEditingGroup(false)} style={{ color: 'var(--text-muted)' }}><X size={18} /></button>
                    </div>

                    <form onSubmit={handleUpdateGroupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Circle Name</label>
                        <input
                          type="text"
                          value={editGroupName}
                          onChange={(e) => setEditGroupName(e.target.value)}
                          required
                          style={{ padding: '0.5rem', fontSize: '0.875rem', marginTop: '0.25rem' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Invite New Member</label>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                          <input
                            type="email"
                            placeholder="newfriend@example.com"
                            value={editMemberEmailInput}
                            onChange={(e) => setEditMemberEmailInput(e.target.value)}
                            style={{ padding: '0.5rem', fontSize: '0.875rem' }}
                          />
                          <button type="button" onClick={handleAddEditMemberEmail} className="btn btn-outline" style={{ padding: '0.5rem 0.75rem' }}>
                            <UserPlus size={16} />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Active Members List (Click × to remove)</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                          {editGroupMembers.map((m) => {
                            const creatorMember = activeGroup.members.find(mem => mem._id === activeGroup.creator);
                            const isCreator = m === activeGroup.creator || (creatorMember && (m === creatorMember.email || m === creatorMember._id));
                            return (
                              <span
                                key={m._id || m}
                                style={{
                                  fontSize: '0.75rem',
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '12px',
                                  backgroundColor: isCreator ? 'var(--bg-secondary)' : 'var(--danger-light)',
                                  color: isCreator ? 'var(--text-secondary)' : 'var(--danger)',
                                  border: '1px solid var(--border-color)',
                                  fontWeight: 600,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                }}
                              >
                                {m.name || m.email || m}
                                {!isCreator && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveEditMember(m)}
                                    style={{ color: 'var(--danger)', display: 'inline-flex', padding: 0, fontSize: '0.75rem' }}
                                  >
                                    ×
                                  </button>
                                )}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.875rem' }}>
                          Save Changes
                        </button>
                        <button type="button" onClick={() => setIsEditingGroup(false)} className="btn btn-outline" style={{ flex: 1, padding: '0.5rem', fontSize: '0.875rem' }}>
                          Cancel
                        </button>
                      </div>

                      {activeGroup.creator === user?._id && (
                        <button
                          type="button"
                          onClick={handleDeleteGroup}
                          className="btn"
                          style={{
                            backgroundColor: 'var(--danger-light)',
                            color: 'var(--danger)',
                            border: '1px solid var(--danger)',
                            padding: '0.5rem',
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.25rem',
                            marginTop: '0.5rem',
                            width: '100%',
                          }}
                        >
                          <Trash2 size={16} /> Delete Group Circle
                        </button>
                      )}
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tab Pills */}
              <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--bg-tertiary)', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
                <button
                  onClick={() => setActiveTab('log')}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    backgroundColor: activeTab === 'log' ? 'var(--bg-secondary)' : 'transparent',
                    color: activeTab === 'log' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    boxShadow: activeTab === 'log' ? 'var(--shadow-sm)' : 'none',
                  }}
                >
                  Log Bill
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    backgroundColor: activeTab === 'history' ? 'var(--bg-secondary)' : 'transparent',
                    color: activeTab === 'history' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    boxShadow: activeTab === 'history' ? 'var(--shadow-sm)' : 'none',
                  }}
                >
                  History
                </button>
                <button
                  onClick={() => setActiveTab('balances')}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    backgroundColor: activeTab === 'balances' ? 'var(--bg-secondary)' : 'transparent',
                    color: activeTab === 'balances' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    boxShadow: activeTab === 'balances' ? 'var(--shadow-sm)' : 'none',
                  }}
                >
                  Balances
                </button>
              </div>

              {/* Tab Workspace */}
              <div style={{ flex: 1 }}>
                {activeTab === 'log' ? (
                  /* Log Group Bill Form */
                  <form onSubmit={handleExpenseSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Total Bill (₹)</label>
                        <input
                          type="number"
                          required
                          value={expenseFormData.amount}
                          onChange={(e) => setExpenseFormData({ ...expenseFormData, amount: e.target.value })}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Paid By</label>
                        <select
                          value={expenseFormData.paidBy}
                          onChange={(e) => setExpenseFormData({ ...expenseFormData, paidBy: e.target.value })}
                        >
                          {activeGroup.members.map((m) => (
                            <option key={m._id} value={m._id}>
                              {m._id === user?._id ? 'You' : m.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Category</label>
                        <select
                          value={expenseFormData.category}
                          onChange={(e) => setExpenseFormData({ ...expenseFormData, category: e.target.value })}
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Splitting Option</label>
                        <select
                          value={expenseFormData.splitType}
                          onChange={(e) => setExpenseFormData({ ...expenseFormData, splitType: e.target.value })}
                        >
                          <option value="equal">Equally (All Members)</option>
                          <option value="unequal">Unequally (Custom Shares)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Bill Description</label>
                      <input
                        type="text"
                        placeholder="e.g. Dinner, Airbnb room, Fuel"
                        required
                        value={expenseFormData.description}
                        onChange={(e) => setExpenseFormData({ ...expenseFormData, description: e.target.value })}
                      />
                    </div>

                    {/* Unequal custom split entries */}
                    {expenseFormData.splitType === 'unequal' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        style={{
                          border: '1px dashed var(--border-color)',
                          borderRadius: 'var(--radius-md)',
                          padding: '1rem',
                          backgroundColor: 'var(--bg-tertiary)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.75rem',
                        }}
                      >
                        <h4 style={{ fontSize: '0.875rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                          Specify Member Owes
                        </h4>
                        {activeGroup.members.map((m) => (
                          <div key={m._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{m.name}</span>
                            <div style={{ position: 'relative', width: '120px' }}>
                              <span style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>₹</span>
                              <input
                                type="number"
                                placeholder="0"
                                value={unequalSplits[m._id] || ''}
                                onChange={(e) => setUnequalSplits({ ...unequalSplits, [m._id]: e.target.value })}
                                style={{ padding: '0.35rem 0.5rem 0.35rem 1.25rem', textAlign: 'right', fontSize: '0.875rem' }}
                              />
                            </div>
                          </div>
                        ))}

                        <div
                          style={{
                            borderTop: '1px solid var(--border-color)',
                            paddingTop: '0.75rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                          }}
                        >
                          <span>Sum: ₹{getUnequalSplitsTotal().toLocaleString()}</span>
                          <span
                            style={{
                              color: Math.abs(getUnequalSplitsRemaining()) <= 0.01 ? 'var(--success)' : 'var(--danger)',
                            }}
                          >
                            {Math.abs(getUnequalSplitsRemaining()) <= 0.01
                              ? 'Sum matches bill perfectly!'
                              : `Remaining: ₹${getUnequalSplitsRemaining().toLocaleString()}`}
                          </span>
                        </div>
                      </motion.div>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
                      Log Group Expense <Send size={18} />
                    </button>
                  </form>
                ) : activeTab === 'history' ? (
                  /* Expenses History Tab */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h4 style={{ margin: 0 }}>Expenses History</h4>
                    {activeExpenses.length === 0 ? (
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                        No expenses logged in this group circle yet.
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {activeExpenses.map((exp) => {
                          const expPayer = exp.paidBy?.name || 'Someone';
                          const isSettlement = exp.description?.startsWith('Settlement:');
                          const canEdit = exp.user === user?._id || (exp.paidBy?._id || exp.paidBy) === user?._id;

                          return (
                            <motion.div
                              key={exp._id}
                              style={{
                                padding: '1.25rem',
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: isSettlement ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem',
                                borderLeft: isSettlement ? '4px solid var(--success)' : '4px solid var(--accent-primary)',
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                  <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1rem' }}>
                                    {exp.description}
                                  </h4>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {new Date(exp.date).toLocaleDateString()} • {exp.category}
                                  </span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.15rem' }}>
                                    ₹{exp.amount.toLocaleString()}
                                  </span>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                                    paid by {exp.paidBy?._id === user?._id ? 'You' : expPayer}
                                  </div>
                                </div>
                              </div>

                              {/* Splits list display */}
                              {!isSettlement && exp.splits && exp.splits.length > 0 && (
                                <div
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.25rem',
                                    fontSize: '0.75rem',
                                    padding: '0.5rem 0.75rem',
                                    backgroundColor: 'var(--bg-tertiary)',
                                    borderRadius: 'var(--radius-sm)',
                                  }}
                                >
                                  <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Spits Division:</span>
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1rem' }}>
                                    {exp.splits.map((s) => (
                                      <span key={s._id || s.user?._id}>
                                        {s.user?.name || 'User'}: <strong>₹{s.amount.toLocaleString()}</strong>
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Edit & Delete Action Buttons */}
                              {canEdit && (
                                <div style={{ display: 'flex', gap: '0.5rem', alignSelf: 'flex-end', marginTop: '0.25rem' }}>
                                  <button
                                    onClick={() => handleStartEditExpense(exp)}
                                    title="Edit Amount/Details"
                                    style={{
                                      color: 'var(--accent-primary)',
                                      padding: '0.25rem 0.5rem',
                                      fontSize: '0.75rem',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.25rem',
                                      border: '1px solid var(--border-color)',
                                      borderRadius: 'var(--radius-sm)',
                                    }}
                                  >
                                    <Edit2 size={12} /> Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteExpense(exp._id)}
                                    title="Delete Bill"
                                    style={{
                                      color: 'var(--danger)',
                                      padding: '0.25rem 0.5rem',
                                      fontSize: '0.75rem',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.25rem',
                                      border: '1px solid var(--border-color)',
                                      borderRadius: 'var(--radius-sm)',
                                    }}
                                  >
                                    <Trash2 size={12} /> Delete
                                  </button>
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Balances & Settlement suggested transactions tab */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    {/* Balances Bubble Grid */}
                    <div>
                      <h4 style={{ marginBottom: '0.75rem' }}>Group Standings</h4>
                      {activeBalances?.balances?.length === 0 ? (
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>No balances logged yet.</p>
                      ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
                          {activeBalances?.balances?.map((b) => {
                            const isCreditor = b.netBalance > 0.01;
                            const isDebtor = b.netBalance < -0.01;
                            
                            let bubbleBg = 'var(--bg-tertiary)';
                            let bubbleColor = 'var(--text-secondary)';
                            let text = 'Settled';

                            if (isCreditor) {
                              bubbleBg = 'var(--accent-light)';
                              bubbleColor = 'var(--accent-hover)';
                              text = `Owed: +₹${b.netBalance.toLocaleString()}`;
                            } else if (isDebtor) {
                              bubbleBg = 'var(--danger-light)';
                              bubbleColor = 'var(--danger)';
                              text = `Owes: -₹${Math.abs(b.netBalance).toLocaleString()}`;
                            }

                            return (
                              <div
                                key={b.user._id}
                                style={{
                                  padding: '1rem 0.5rem',
                                  borderRadius: 'var(--radius-md)',
                                  backgroundColor: bubbleBg,
                                  color: bubbleColor,
                                  textAlign: 'center',
                                  border: '1px solid transparent',
                                  borderColor: isCreditor ? 'var(--accent-primary)' : isDebtor ? 'var(--danger)' : 'var(--border-color)',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '0.25rem',
                                }}
                              >
                                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{b.user.name}</span>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{text}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Settlement flow minimization */}
                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                      <h4 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Suggested Settle Up (Minimal Transact)
                      </h4>
                      {!activeBalances?.suggestedSettlements || activeBalances.suggestedSettlements.length === 0 ? (
                        <div
                          style={{
                            padding: '1.5rem',
                            border: '1px dashed var(--success)',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'var(--success-light)',
                            color: 'var(--success)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                          }}
                        >
                          <CheckCircle2 size={20} /> Group is completely settled up!
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {activeBalances.suggestedSettlements.map((settlement, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0.75rem 1rem',
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: 'var(--bg-tertiary)',
                              }}
                            >
                              <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                                <strong>{settlement.from.name}</strong> owes <strong>{settlement.to.name}</strong>{' '}
                                <span style={{ color: 'var(--danger)', fontWeight: 700 }}>
                                  ₹{settlement.amount.toLocaleString()}
                                </span>
                              </div>
                              <button
                                onClick={() => handleSettleUp(settlement)}
                                className="btn btn-primary"
                                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', fontWeight: 700, gap: '0.25rem' }}
                              >
                                Settle Up <RefreshCw size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Edit Group Expense Modal (Glassmorphic) */}
      <AnimatePresence>
        {editingExpense && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card"
              style={{
                padding: '2rem',
                width: '100%',
                maxWidth: '500px',
                position: 'relative',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              <button
                onClick={() => setEditingExpense(null)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
              <h3 style={{ marginBottom: '1.5rem' }}>Edit Group Expense</h3>

              <form onSubmit={handleEditExpenseSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Total Bill (₹)</label>
                    <input
                      type="number"
                      required
                      value={editExpenseFormData.amount}
                      onChange={(e) => setEditExpenseFormData({ ...editExpenseFormData, amount: e.target.value })}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Paid By</label>
                    <select
                      value={editExpenseFormData.paidBy}
                      onChange={(e) => setEditExpenseFormData({ ...editExpenseFormData, paidBy: e.target.value })}
                    >
                      {activeGroup.members.map((m) => (
                        <option key={m._id} value={m._id}>
                          {m._id === user?._id ? 'You' : m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Category</label>
                    <select
                      value={editExpenseFormData.category}
                      onChange={(e) => setEditExpenseFormData({ ...editExpenseFormData, category: e.target.value })}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Splitting Option</label>
                    <select
                      value={editExpenseFormData.splitType}
                      onChange={(e) => setEditExpenseFormData({ ...editExpenseFormData, splitType: e.target.value })}
                    >
                      <option value="equal">Equally (All Members)</option>
                      <option value="unequal">Unequally (Custom Shares)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Date</label>
                  <input
                    type="date"
                    required
                    value={editExpenseFormData.date}
                    onChange={(e) => setEditExpenseFormData({ ...editExpenseFormData, date: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Bill Description</label>
                  <input
                    type="text"
                    required
                    value={editExpenseFormData.description}
                    onChange={(e) => setEditExpenseFormData({ ...editExpenseFormData, description: e.target.value })}
                  />
                </div>

                {/* Edit Unequal custom split entries */}
                {editExpenseFormData.splitType === 'unequal' && (
                  <div
                    style={{
                      border: '1px dashed var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      backgroundColor: 'var(--bg-tertiary)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      maxHeight: '180px',
                      overflowY: 'auto'
                    }}
                  >
                    <h4 style={{ fontSize: '0.875rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', margin: 0 }}>
                      Specify Member Owes
                    </h4>
                    {activeGroup.members.map((m) => (
                      <div key={m._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{m.name}</span>
                        <div style={{ position: 'relative', width: '120px' }}>
                          <span style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>₹</span>
                          <input
                            type="number"
                            placeholder="0"
                            value={editExpenseUnequalSplits[m._id] || ''}
                            onChange={(e) => setEditExpenseUnequalSplits({ ...editExpenseUnequalSplits, [m._id]: e.target.value })}
                            style={{ padding: '0.35rem 0.5rem 0.35rem 1.25rem', textAlign: 'right', fontSize: '0.875rem' }}
                          />
                        </div>
                      </div>
                    ))}

                    <div
                      style={{
                        borderTop: '1px solid var(--border-color)',
                        paddingTop: '0.75rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                      }}
                    >
                      <span>Sum: ₹{getEditUnequalSplitsTotal().toLocaleString()}</span>
                      <span style={{ color: Math.abs(getEditUnequalSplitsRemaining()) <= 0.01 ? 'var(--success)' : 'var(--danger)' }}>
                        {Math.abs(getEditUnequalSplitsRemaining()) <= 0.01
                          ? 'Sum matches perfectly!'
                          : `Remaining: ₹${getEditUnequalSplitsRemaining().toLocaleString()}`}
                      </span>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    Save Changes
                  </button>
                  <button type="button" className="btn btn-outline" onClick={() => setEditingExpense(null)} style={{ flex: 1 }}>
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GroupsManager;
