import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { User, PlusCircle, Activity, Moon, Sun, X, Menu, Shield, Laptop, Palmtree } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { ExpenseProvider, useExpense } from './context/ExpenseContext';
import { GoalProvider } from './context/GoalContext';
import { IncomeProvider } from './context/IncomeContext';
import { GroupProvider } from './context/GroupContext';
import GroupsManager from './pages/GroupsManager';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Bills', 'Other'];

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ExpensesManager from './pages/ExpensesManager';
import IncomesManager from './pages/IncomesManager';
import Budgets from './pages/Budgets';
import Goals from './pages/Goals';
import Landing from './pages/Landing';
import Footer from './components/Footer';
import { NavLink, Link } from 'react-router-dom';

// Layout Placeholder
const Layout = ({ children }) => {
  const { logout } = useAuth();
  const { addExpense } = useExpense();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '', category: 'Food', date: new Date().toISOString().split('T')[0], description: '', isRecurring: false, recurringFrequency: 'none', paymentMode: 'Cash'
  });

  const location = useLocation();

  const handleGlobalAddSubmit = async (e) => {
    e.preventDefault();
    const res = await addExpense({ ...formData, amount: Number(formData.amount) });
    if (res.success) {
      setShowAddModal(false);
      setFormData({ amount: '', category: 'Food', date: new Date().toISOString().split('T')[0], description: '', isRecurring: false, recurringFrequency: 'none', paymentMode: 'Cash' });
    } else {
      alert(res.error);
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');
  
  return (
    <div className="layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="dashboard-header">
        {/* LOGO */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
          <Activity color="var(--accent-primary)" size={28} />
          <h2 className="logo-text">
            TrackMyRupee
          </h2>
        </Link>

        {/* CENTER LINKS */}
        <nav className="dashboard-nav">
          <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
          <NavLink to="/incomes" className="nav-link">Income</NavLink>
          <NavLink to="/expenses" className="nav-link">Expenses</NavLink>
          <NavLink to="/groups" className="nav-link">Split Bill</NavLink>
          <NavLink to="/budgets" className="nav-link">Budgets</NavLink>
          <NavLink to="/goals" className="nav-link">Goals</NavLink>
        </nav>

        {/* RIGHT ACTIONS */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={() => setShowAddModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
             <span className="add-btn-text">Add</span> <PlusCircle size={20} />
          </button>
          
          <div className="header-user-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center', borderLeft: '1px solid var(--border-color)', paddingLeft: '1.5rem' }}>
            <button onClick={toggleTheme} title="Toggle Theme" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
              {theme === 'light' ? <Moon size={16} color="var(--text-secondary)" /> : <Sun size={16} color="var(--warning)" />}
            </button>
            <button onClick={logout} title="Logout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
              <User size={16} color="var(--text-secondary)" />
            </button>
          </div>

          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none', color: 'var(--text-primary)', padding: '0.25rem' }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mobile-nav-container"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderBottom: '1px solid var(--border-color)',
              padding: '1.5rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxShadow: 'var(--shadow-md)',
              position: 'sticky',
              top: '70px',
              zIndex: 49
            }}
          >
            <NavLink to="/dashboard" className="mobile-nav-link">Dashboard</NavLink>
            <NavLink to="/incomes" className="mobile-nav-link">Income</NavLink>
            <NavLink to="/expenses" className="mobile-nav-link">Expenses</NavLink>
            <NavLink to="/groups" className="mobile-nav-link">Split Bill</NavLink>
            <NavLink to="/budgets" className="mobile-nav-link">Budgets</NavLink>
            <NavLink to="/goals" className="mobile-nav-link">Goals</NavLink>

            <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '0.5rem 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Appearance & Session</span>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button onClick={toggleTheme} title="Toggle Theme" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
                  {theme === 'light' ? <Moon size={18} color="var(--text-secondary)" /> : <Sun size={18} color="var(--warning)" />}
                </button>
                <button onClick={logout} title="Logout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
                  <User size={18} color="var(--text-secondary)" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Payment Mode</label>
                    <select value={formData.paymentMode || 'Cash'} onChange={(e) => setFormData({...formData, paymentMode: e.target.value})}>
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI (Online)</option>
                      <option value="Card">Card (Online)</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Date</label>
                    <input type="date" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                  </div>
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
      <Footer />
    </div>
  )
};

const CursorInteraction = () => {
  useEffect(() => {
    const handleMouseDown = (e) => {
      // 1. Create a circular expanding ripple
      const ripple = document.createElement('div');
      ripple.className = 'click-ripple';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      document.body.appendChild(ripple);

      setTimeout(() => {
        if (ripple.parentNode) {
          document.body.removeChild(ripple);
        }
      }, 600);

      // 2. Create exploding multi-sparks burst (8 directions)
      const sparkCount = 8;
      for (let i = 0; i < sparkCount; i++) {
        const spark = document.createElement('div');
        spark.className = 'click-spark';
        spark.style.left = `${e.clientX}px`;
        spark.style.top = `${e.clientY}px`;

        // Calculate radial translation angle & range
        const angle = (i * (360 / sparkCount) + Math.random() * 20) * (Math.PI / 180);
        const distance = 40 + Math.random() * 50; // shoot 40px to 90px
        const sparkX = Math.cos(angle) * distance;
        const sparkY = Math.sin(angle) * distance;
        const duration = 0.5 + Math.random() * 0.3; // 500ms to 800ms

        spark.style.setProperty('--spark-x', `${sparkX}px`);
        spark.style.setProperty('--spark-y', `${sparkY}px`);
        spark.style.setProperty('--spark-duration', `${duration}s`);
        
        // Match emerald green, sapphire blue, or amethyst purple colors
        const rand = Math.random();
        if (rand < 0.33) {
          spark.style.backgroundColor = '#10B981';
        } else if (rand < 0.66) {
          spark.style.backgroundColor = '#3b82f6';
        } else {
          spark.style.backgroundColor = '#8b5cf6';
        }

        document.body.appendChild(spark);

        setTimeout(() => {
          if (spark.parentNode) {
            document.body.removeChild(spark);
          }
        }, duration * 1000);
      }
    };

    window.addEventListener('mousedown', handleMouseDown, true);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown, true);
    };
  }, []);

  return null;
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
          <GroupProvider>
            <CursorInteraction />
            <Router>
              <Routes>
                <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
                <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
                <Route path="/" element={<Landing />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/incomes" element={<ProtectedRoute><IncomesManager /></ProtectedRoute>} />
                <Route path="/expenses" element={<ProtectedRoute><ExpensesManager /></ProtectedRoute>} />
                <Route path="/groups" element={<ProtectedRoute><GroupsManager /></ProtectedRoute>} />
                <Route path="/budgets" element={<ProtectedRoute><Budgets /></ProtectedRoute>} />
                <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
              </Routes>
            </Router>
          </GroupProvider>
        </GoalProvider>
      </IncomeProvider>
    </ExpenseProvider>
  );
}

export default App;
