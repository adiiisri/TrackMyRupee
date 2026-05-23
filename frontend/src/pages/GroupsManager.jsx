import { useState, useEffect } from 'react';
import { useGroup } from '../context/GroupContext';
import { useAuth } from '../context/AuthContext';
import { Plus, Users, DollarSign, RefreshCw, Send, CheckCircle2, UserPlus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Bills', 'Other'];

const GroupsManager = () => {
  const {
    groups,
    activeGroup,
    activeBalances,
    loading,
    fetchGroups,
    selectGroup,
    createGroup,
    logGroupExpense,
  } = useGroup();

  const { user } = useAuth();

  // Tab: 'log' or 'balances'
  const [activeTab, setActiveTab] = useState('log');

  // Create Group Form State
  const [newGroupName, setNewGroupName] = useState('');
  const [memberEmailInput, setMemberEmailInput] = useState('');
  const [invitedMembers, setInvitedMembers] = useState([]);

  // Log Expense Form State
  const [expenseFormData, setExpenseFormData] = useState({
    amount: '',
    category: 'Food',
    description: '',
    paidBy: '',
    splitType: 'equal', // 'equal' or 'unequal'
  });

  const [unequalSplits, setUnequalSplits] = useState({});

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  // Set default payer when activeGroup changes
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
    }
  }, [activeGroup, user]);

  // Handle adding an email pill
  const handleAddMemberEmail = (e) => {
    e.preventDefault();
    const trimmed = memberEmailInput.trim().toLowerCase();
    if (!trimmed) return;
    if (!trimmed.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }
    if (invitedMembers.includes(trimmed)) {
      alert('This email is already added');
      return;
    }
    if (trimmed === user?.email) {
      alert('You are already included automatically as the creator');
      return;
    }
    setInvitedMembers((prev) => [...prev, trimmed]);
    setMemberEmailInput('');
  };

  const handleRemoveInvitedEmail = (emailToRemove) => {
    setInvitedMembers((prev) => prev.filter((email) => email !== emailToRemove));
  };

  // Handle Group Creation
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

  // Unequal split total calculator
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

      // Build splits array
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
      // Re-initialize splits
      const resetSplits = {};
      activeGroup.members.forEach((m) => {
        resetSplits[m._id] = '';
      });
      setUnequalSplits(resetSplits);
      setActiveTab('balances');
    } else {
      alert(res.error || 'Failed to log expense');
    }
  };

  // Interactive Settle Up Action
  const handleSettleUp = async (settlement) => {
    const confirmSettle = window.confirm(
      `Log settlement payment: Did ${settlement.from.name} pay ${settlement.to.name} ₹${settlement.amount.toLocaleString()}?`
    );
    if (!confirmSettle) return;

    // Log a settlement expense: Paid by the debtor, splits has debtor owing the amount and creditor owing 0
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

    // Any other group members not part of settlement owe 0
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
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      background: isActive ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                      borderColor: isActive ? 'var(--accent-primary)' : 'var(--border-color)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <h4 style={{ color: isActive ? 'var(--accent-hover)' : 'var(--text-primary)', margin: 0 }}>
                      {group.name}
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      {group.members.length} members • Created by {group.creator === user?._id ? 'You' : 'Friend'}
                    </p>
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
              {/* Header */}
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-hover)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Active Workspace
                </span>
                <h2 style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>{activeGroup.name}</h2>
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
                  Balances & Settle Up
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
    </motion.div>
  );
};

export default GroupsManager;
