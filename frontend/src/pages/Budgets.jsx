import { useState, useEffect } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { Settings, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Bills', 'Other'];

const Budgets = () => {
  const { budgets, fetchBudgets, saveBudget, expenses, fetchExpenses } = useExpense();
  
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  const [formData, setFormData] = useState({
    category: 'Food',
    amount: ''
  });

  useEffect(() => {
    fetchBudgets(currentMonth, currentYear);
    fetchExpenses({ month: currentMonth, year: currentYear });
  }, [currentMonth, currentYear, fetchBudgets, fetchExpenses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveBudget({
      category: formData.category,
      amount: Number(formData.amount),
      month: currentMonth,
      year: currentYear
    });
    setFormData({ ...formData, amount: '' });
  };

  const getCategorySpent = (category) => {
    return expenses
      .filter(e => e.category === category)
      .reduce((acc, curr) => acc + curr.amount, 0);
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="container" style={{ padding: '0 1rem', maxWidth: '1200px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2>Manage Budgets</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <select value={currentMonth} onChange={(e) => setCurrentMonth(Number(e.target.value))}>
            {Array.from({length: 12}, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('default', { month: 'long' })}</option>
            ))}
          </select>
          <select value={currentYear} onChange={(e) => setCurrentYear(Number(e.target.value))}>
            {[currentYear - 1, currentYear, currentYear + 1].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Set Budget Form */}
        <motion.div variants={itemVariants} className="card" style={{ padding: '1.5rem', alignSelf: 'start' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={20} /> Set Category Budget
          </h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Category</label>
              <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Budget Amount (₹)</label>
              <input type="number" required value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} placeholder="e.g. 5000" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Save Budget</button>
          </form>
        </motion.div>

        {/* Budgets List & Progress */}
        <motion.div variants={itemVariants} className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Budget Usage Overview</h3>
          
          {budgets.length === 0 ? (
            <p className="text-muted">No budgets set for this month.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {budgets.map(b => {
                const spent = getCategorySpent(b.category);
                const percent = Math.min((spent / b.amount) * 100, 100);
                const isWarning = percent >= 80;
                
                return (
                  <motion.div variants={itemVariants} key={b._id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {b.category}
                        {isWarning && <AlertTriangle size={16} color="var(--warning)" />}
                      </span>
                      <span>₹{spent.toLocaleString()} / ₹{b.amount.toLocaleString()}</span>
                    </div>
                    
                    <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 1 }} style={{ 
                        height: '100%', 
                        backgroundColor: percent >= 100 ? 'var(--danger)' : isWarning ? 'var(--warning)' : 'var(--success)'
                      }} />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Budgets;
