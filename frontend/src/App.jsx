import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, User, PlusCircle, Activity, Moon, Sun, X, Shield, Laptop, Palmtree } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { ExpenseProvider, useExpense } from './context/ExpenseContext';
import { GoalProvider } from './context/GoalContext';
import { IncomeProvider } from './context/IncomeContext';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Bills', 'Other'];

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ExpensesManager from './pages/ExpensesManager';
import IncomesManager from './pages/IncomesManager';
import Budgets from './pages/Budgets';
import Goals from './pages/Goals';
import { NavLink, Link } from 'react-router-dom';

// Layout Placeholder
const Layout = ({ children }) => {
  const { logout } = useAuth();
  const { addExpense } = useExpense();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    amount: '', category: 'Food', date: new Date().toISOString().split('T')[0], description: '', isRecurring: false, recurringFrequency: 'none'
  });

  const handleGlobalAddSubmit = async (e) => {
    e.preventDefault();
    const res = await addExpense({ ...formData, amount: Number(formData.amount) });
    if (res.success) {
      setShowAddModal(false);
      setFormData({ amount: '', category: 'Food', date: new Date().toISOString().split('T')[0], description: '', isRecurring: false, recurringFrequency: 'none' });
    } else {
      alert(res.error);
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');
  
  return (
    <div className="layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ 
        padding: '1rem 2rem', 
        backgroundColor: 'var(--bg-secondary)', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: 'var(--shadow-sm)'
      }}>
        {/* LOGO */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity color="var(--accent-primary)" size={28} />
          <h2 style={{ fontSize: '1.25rem', fontFamily: 'Poppins, sans-serif', fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>
            TrackMyRupee
          </h2>
        </div>

        {/* CENTER LINKS */}
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <NavLink to="/" className="nav-link">Dashboard</NavLink>
          <NavLink to="/incomes" className="nav-link">Income</NavLink>
          <NavLink to="/expenses" className="nav-link">Expenses</NavLink>
          <NavLink to="/budgets" className="nav-link">Budgets</NavLink>
          <NavLink to="/goals" className="nav-link">Goals</NavLink>
        </nav>

        {/* RIGHT ACTIONS */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <button onClick={() => setShowAddModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
             Add <PlusCircle size={18} />
          </button>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', borderLeft: '1px solid var(--border-color)', paddingLeft: '1.5rem' }}>
            <button onClick={toggleTheme} title="Toggle Theme" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
              {theme === 'light' ? <Moon size={16} color="var(--text-secondary)" /> : <Sun size={16} color="var(--warning)" />}
            </button>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
               <Bell size={20} color="var(--text-secondary)" />
               <div style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, backgroundColor: 'var(--danger)', borderRadius: '50%' }} />
            </div>
            <button onClick={logout} title="Logout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
              <User size={16} color="var(--text-secondary)" />
            </button>
          </div>
        </div>
      </header>
      
      <main style={{ padding: '2rem 1rem', flex: 1, backgroundColor: 'var(--bg-primary)' }}>
        {children}
      </main>

      {/* Global Add Expense Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="card" style={{ padding: '2rem', width: '100%', maxWidth: '500px', position: 'relative' }}>
              <button onClick={() => setShowAddModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--text-muted)' }}><X size={20} /></button>
              <h3 style={{ marginBottom: '1.5rem' }}>Add New Expense</h3>
              <form onSubmit={handleGlobalAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Amount (₹)</label>
                    <input type="number" required value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Category</label>
                    <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Date</label>
                  <input type="date" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Description</label>
                  <input type="text" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" id="global-recurring" style={{ width: 'auto' }} checked={formData.isRecurring} onChange={(e) => setFormData({...formData, isRecurring: e.target.checked})} />
                  <label htmlFor="global-recurring" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Is Recurring?</label>
                </div>
                {formData.isRecurring && (
                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Frequency</label>
                    <select value={formData.recurringFrequency} onChange={(e) => setFormData({...formData, recurringFrequency: e.target.value})}>
                      <option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option>
                    </select>
                  </div>
                )}
                <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Save Expense</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
};

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
};

function App() {
  const { user } = useAuth();

  return (
    <ExpenseProvider>
      <IncomeProvider>
        <GoalProvider>
          <Router>
            <Routes>
              <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
              <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/incomes" element={<ProtectedRoute><IncomesManager /></ProtectedRoute>} />
              <Route path="/expenses" element={<ProtectedRoute><ExpensesManager /></ProtectedRoute>} />
              <Route path="/budgets" element={<ProtectedRoute><Budgets /></ProtectedRoute>} />
              <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
            </Routes>
          </Router>
        </GoalProvider>
      </IncomeProvider>
    </ExpenseProvider>
  );
}

export default App;
