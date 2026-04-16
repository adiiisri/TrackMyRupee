import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, User, PlusCircle, Activity, Moon, Sun } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ExpensesManager from './pages/ExpensesManager';
import Budgets from './pages/Budgets';
import { Link } from 'react-router-dom';

// Layout Placeholder
const Layout = ({ children }) => {
  const { logout } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

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
          <Link to="/" style={{ fontWeight: 500, color: 'var(--accent-primary)', borderBottom: '2px solid var(--accent-primary)', paddingBottom: '0.5rem', marginTop: '0.5rem' }}>Dashboard</Link>
          <Link to="/expenses" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Expenses</Link>
          <Link to="/budgets" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Budgets</Link>
          <span style={{ fontWeight: 500, color: 'var(--text-muted)', cursor: 'not-allowed' }}>Subscriptions</span>
          <span style={{ fontWeight: 500, color: 'var(--text-muted)', cursor: 'not-allowed' }}>Goals</span>
        </nav>

        {/* RIGHT ACTIONS */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/expenses" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}>
             Add <PlusCircle size={18} />
          </Link>
          
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
      <Router>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/expenses" element={<ProtectedRoute><ExpensesManager /></ProtectedRoute>} />
          <Route path="/budgets" element={<ProtectedRoute><Budgets /></ProtectedRoute>} />
        </Routes>
      </Router>
    </ExpenseProvider>
  );
}

export default App;
