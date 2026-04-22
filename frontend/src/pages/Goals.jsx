import React, { useState } from 'react';
import { useGoal } from '../context/GoalContext';
import { Shield, Laptop, Palmtree, Plus, Edit2, Trash2, Home, Car, GraduationCap, Heart, Plane, Smartphone, Monitor, Coins } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Goals = () => {
  const { goals, addGoal, addFunds, deleteGoal, loading } = useGoal();
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showFundsModal, setShowFundsModal] = useState({ isOpen: false, goalId: null });
  const [formData, setFormData] = useState({ title: '', targetAmount: '', deadline: '', icon: 'Shield', color: '#10B981' });
  const [fundsAmount, setFundsAmount] = useState('');

  const totalSaved = goals.reduce((acc, goal) => acc + goal.savedAmount, 0);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    await addGoal({ ...formData, targetAmount: Number(formData.targetAmount) });
    setShowGoalModal(false);
    setFormData({ title: '', targetAmount: '', deadline: '', icon: 'Shield', color: '#10B981' });
  };

  const handleAddFundsSubmit = async (e) => {
    e.preventDefault();
    await addFunds(showFundsModal.goalId, Number(fundsAmount));
    setShowFundsModal({ isOpen: false, goalId: null });
    setFundsAmount('');
  };

  const renderIcon = (iconName, accentColor) => {
    switch(iconName) {
      case 'Laptop': return <Laptop size={20} color={accentColor || "#60A5FA"} />;
      case 'Palmtree': return <Palmtree size={20} color={accentColor || "#FBBF24"} />;
      case 'Home': return <Home size={20} color={accentColor || "#A78BFA"} />;
      case 'Car': return <Car size={20} color={accentColor || "#F87171"} />;
      case 'GraduationCap': return <GraduationCap size={20} color={accentColor || "#34D399"} />;
      case 'Heart': return <Heart size={20} color={accentColor || "#F43F5E"} />;
      case 'Plane': return <Plane size={20} color={accentColor || "#38BDF8"} />;
      case 'Smartphone': return <Smartphone size={20} color={accentColor || "#94A3B8"} />;
      case 'Monitor': return <Monitor size={20} color={accentColor || "#C084FC"} />;
      case 'Coins': return <Coins size={20} color={accentColor || "#FACC15"} />;
      default: return <Shield size={20} color={accentColor || "#60A5FA"} />;
    }
  };

  const formatCurrency = (val) => {
    if (val >= 100000) return (val / 100000).toFixed(1) + 'L';
    return val.toLocaleString();
  };

  return (
    <div className="container" style={{ padding: '0 1rem', maxWidth: '1200px' }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Savings Goals</h1>
          <p className="text-muted">Track your progress towards your financial dreams.</p>
        </div>
        <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', minWidth: '200px', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Total Saved</span>
          <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--success)' }}>₹{totalSaved.toLocaleString()}</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem' }}>Your Active Goals</h2>
        <button className="btn btn-primary" onClick={() => setShowGoalModal(true)} style={{ backgroundColor: 'var(--success)', border: 'none', color: '#000' }}>
          <Plus size={18} /> New Goal
        </button>
      </div>

      {/* INFO BANNER */}
      <div className="card" style={{ backgroundColor: '#0f3c4c', border: 'none', padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <div style={{ padding: '0.5rem', backgroundColor: '#164e63', borderRadius: '50%' }}>
          <Shield size={20} color="#38bdf8" />
        </div>
        <div>
          <h4 style={{ color: '#38bdf8', marginBottom: '0.25rem' }}>How We Track Savings</h4>
          <p style={{ color: '#bae6fd', fontSize: '0.875rem' }}>Savings contributions are deducted directly from your selected account balance to accurately reflect your available funds while helping you reach your goals.</p>
        </div>
      </div>

      {/* GOALS GRID */}
      {loading ? <p>Loading goals...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {goals.map(goal => {
            const percent = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100).toFixed(1);
            return (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={goal._id} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
                  <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '50%' }}>
                    {renderIcon(goal.icon, goal.color)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{goal.title}</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--success)' }}>Target: {new Date(goal.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                  <span>PROGRESS</span>
                  <span>SAVED</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{percent}%</span>
                  <span style={{ fontSize: '1rem', fontWeight: 600 }}>₹{goal.savedAmount.toLocaleString()} <span style={{ color: 'var(--text-muted)' }}>/ {formatCurrency(goal.targetAmount)}</span></span>
                </div>

                <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 1 }} style={{ height: '100%', backgroundColor: goal.color }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button onClick={() => setShowFundsModal({ isOpen: true, goalId: goal._id })} className="btn" style={{ backgroundColor: goal.color, color: '#000', fontSize: '0.875rem', padding: '0.4rem 0.75rem' }}>
                    <Plus size={16} /> Add Funds
                  </button>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn-outline" style={{ padding: '0.4rem', borderColor: 'var(--border-color)', color: 'var(--success)' }}><Edit2 size={16} /></button>
                    <button onClick={() => deleteGoal(goal._id)} className="btn-outline" style={{ padding: '0.4rem', borderColor: 'var(--border-color)', color: 'var(--danger)' }}><Trash2 size={16} /></button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* CREATE GOAL MODAL */}
      <AnimatePresence>
        {showGoalModal && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="card" style={{ padding: '2rem', width: '100%', maxWidth: '500px' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>New Savings Goal</h3>
              <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input required placeholder="Goal Title (e.g. MacBook Pro)" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                <input required type="number" placeholder="Target Amount (₹)" value={formData.targetAmount} onChange={e => setFormData({...formData, targetAmount: e.target.value})} />
                <input required type="date" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <select value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})}>
                    <option value="Shield">Safety / Shield</option>
                    <option value="Home">Real Estate / Home</option>
                    <option value="Car">Vehicle / Car</option>
                    <option value="GraduationCap">Education / College</option>
                    <option value="Laptop">Electronics / Laptop</option>
                    <option value="Smartphone">Electronics / Phone</option>
                    <option value="Palmtree">Vacation / Travel</option>
                    <option value="Plane">Flights / Travel</option>
                    <option value="Heart">Health / Wedding</option>
                    <option value="Coins">General Savings / Coins</option>
                  </select>
                  <select value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})}>
                    <option value="#10b981">Green</option>
                    <option value="#0ea5e9">Blue</option>
                    <option value="#eab308">Yellow</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create</button>
                  <button type="button" className="btn btn-outline" onClick={() => setShowGoalModal(false)}>Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD FUNDS MODAL */}
      <AnimatePresence>
        {showFundsModal.isOpen && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="card" style={{ padding: '2rem', width: '100%', maxWidth: '400px' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Contribute to Goal</h3>
              <form onSubmit={handleAddFundsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input required type="number" placeholder="Amount to add (₹)" value={fundsAmount} onChange={e => setFundsAmount(e.target.value)} />
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Deposit</button>
                  <button type="button" className="btn btn-outline" onClick={() => setShowFundsModal({ isOpen: false, goalId: null })}>Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Goals;
