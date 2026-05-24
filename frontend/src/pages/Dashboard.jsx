import { useState, useEffect, useMemo } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { useIncome } from '../context/IncomeContext';
import { Link } from 'react-router-dom';
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, CheckCircle, ExternalLink, Activity, Trophy, PlusCircle } from 'lucide-react';

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

const Dashboard = () => {
  const { expenses, fetchExpenses, budgets, fetchBudgets, loading, addExpense } = useExpense();
  const { incomes, fetchIncomes } = useIncome();

  const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Bills', 'Other'];

  const [quickExpense, setQuickExpense] = useState({
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    description: '',
    isRecurring: false,
    recurringFrequency: 'none',
    paymentMode: 'Cash'
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleQuickSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const res = await addExpense({
        ...quickExpense,
        amount: Number(quickExpense.amount)
      });

      if (res.success) {
        setSuccessMessage('Expense added successfully!');
        setQuickExpense({
          amount: '',
          category: 'Food',
          date: new Date().toISOString().split('T')[0],
          description: '',
          isRecurring: false,
          recurringFrequency: 'none',
          paymentMode: 'Cash'
        });

        // Re-fetch budgets for the month so budget pace stays calibrated
        const today = new Date();
        fetchBudgets(today.getMonth() + 1, today.getFullYear());

        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(res.error || 'Failed to add expense.');
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchIncomes();
    const today = new Date();
    fetchBudgets(today.getMonth() + 1, today.getFullYear());
  }, [fetchExpenses, fetchIncomes, fetchBudgets]);

  const totalExpenses = useMemo(() => expenses.reduce((acc, curr) => acc + curr.amount, 0), [expenses]);
  const totalIncome = useMemo(() => incomes.reduce((acc, curr) => acc + curr.amount, 0), [incomes]);
  const totalBudget = useMemo(() => budgets.reduce((acc, curr) => acc + curr.amount, 0), [budgets]);
  
  // Account vs Cash Income
  const totalIncomeAccount = useMemo(() => 
    incomes.filter(i => i.paymentMode === 'UPI' || i.paymentMode === 'Card' || !i.paymentMode)
           .reduce((acc, curr) => acc + curr.amount, 0), 
    [incomes]
  );
  const totalIncomeCash = useMemo(() => 
    incomes.filter(i => i.paymentMode === 'Cash')
           .reduce((acc, curr) => acc + curr.amount, 0), 
    [incomes]
  );

  // Account vs Cash Expenses
  const totalExpensesAccount = useMemo(() => 
    expenses.filter(e => e.paymentMode === 'UPI' || e.paymentMode === 'Card')
            .reduce((acc, curr) => acc + curr.amount, 0), 
    [expenses]
  );
  const totalExpensesCash = useMemo(() => 
    expenses.filter(e => e.paymentMode === 'Cash' || !e.paymentMode)
            .reduce((acc, curr) => acc + curr.amount, 0), 
    [expenses]
  );
  
  const availableBalance = totalIncome - totalExpenses;
  const accountBalance = totalIncomeAccount - totalExpensesAccount;
  const cashBalance = totalIncomeCash - totalExpensesCash;
  
  const budgetStatus = totalBudget - totalExpenses;
  const isUnderBudget = budgetStatus >= 0;

  const expenseByCategory = useMemo(() => {
    const categories = {};
    expenses.forEach(e => {
      categories[e.category] = (categories[e.category] || 0) + e.amount;
    });
    return Object.keys(categories).map((key, index) => ({
      name: key,
      value: categories[key],
      color: COLORS[index % COLORS.length]
    })).sort((a,b) => b.value - a.value);
  }, [expenses]);

  const chartData = useMemo(() => {
    const sorted = [...expenses].reverse();
    return sorted.map((e, index) => ({
      date: new Date(e.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      amount: e.amount,
      average: (sorted.slice(Math.max(0, index - 6), index + 1).reduce((acc, val) => acc + val.amount, 0)) / Math.min(index + 1, 7)
    }));
  }, [expenses]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div className="container" variants={containerVariants} initial="hidden" animate="show" style={{ maxWidth: '1400px' }}>
      
      {/* Balances Section Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        
        {/* Account Balance (UPI / Card) Card */}
        <motion.div 
          variants={itemVariants} 
          className="card" 
          style={{ 
            padding: '1.75rem', 
            background: 'var(--bg-secondary)', 
            borderLeft: '6px solid var(--accent-primary)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
            Account Balance (UPI / Card)
          </p>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: '0.5rem 0', color: 'var(--accent-hover)' }}>
            ₹{accountBalance.toLocaleString()}
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Online Income: <span style={{ color: 'var(--success)', fontWeight: 600 }}>+₹{totalIncomeAccount.toLocaleString()}</span> <br />
            Online Spends: <span style={{ color: 'var(--danger)', fontWeight: 600 }}>-₹{totalExpensesAccount.toLocaleString()}</span>
          </p>
        </motion.div>

        {/* Cash Balance Card */}
        <motion.div 
          variants={itemVariants} 
          className="card" 
          style={{ 
            padding: '1.75rem', 
            background: 'var(--bg-secondary)', 
            borderLeft: '6px solid var(--warning)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
            Cash in Hand
          </p>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: '0.5rem 0', color: 'var(--warning)' }}>
            ₹{cashBalance.toLocaleString()}
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Cash Income: <span style={{ color: 'var(--success)', fontWeight: 600 }}>+₹{totalIncomeCash.toLocaleString()}</span> <br />
            Cash Spends: <span style={{ color: 'var(--danger)', fontWeight: 600 }}>-₹{totalExpensesCash.toLocaleString()}</span>
          </p>
        </motion.div>

        {/* Total Available Balance Card */}
        <motion.div 
          variants={itemVariants} 
          className="card" 
          style={{ 
            padding: '1.75rem', 
            background: 'var(--bg-secondary)', 
            borderLeft: '6px solid #64748b',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
            Total Net Balance
          </p>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: '0.5rem 0', color: availableBalance >= 0 ? 'var(--text-primary)' : 'var(--danger)' }}>
            ₹{availableBalance.toLocaleString()}
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Total Income: <span style={{ color: 'var(--success)', fontWeight: 600 }}>+₹{totalIncome.toLocaleString()}</span> <br />
            Total Spends: <span style={{ color: 'var(--danger)', fontWeight: 600 }}>-₹{totalExpenses.toLocaleString()}</span>
          </p>
        </motion.div>

      </div>

      {/* Top Row: 3 Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        
        {/* Card 1: Spending Pace */}
        <motion.div variants={itemVariants} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={18} color="var(--text-muted)" /> Spending Pace
            </h3>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.75rem', borderRadius: '1rem', backgroundColor: isUnderBudget ? 'var(--accent-light)' : 'var(--danger-light)', color: isUnderBudget ? 'var(--accent-hover)' : 'var(--danger)' }}>
              {isUnderBudget ? 'On Track' : 'Off Track'}
            </span>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: isUnderBudget ? 'var(--accent-primary)' : 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <CheckCircle size={24} /> ₹{Math.abs(budgetStatus).toLocaleString()} {isUnderBudget ? 'under budget' : 'over budget'}
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>vs ideal pace for day {new Date().getDate()}/31</p>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
             <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>₹{Math.round(totalExpenses / Math.max(1, new Date().getDate())).toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ day</span></h2>
             <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '0.25rem' }}>Your Burn Rate</p>
          </div>

          <div style={{ marginTop: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              <span>Budget Used</span>
              <span style={{ color: isUnderBudget ? 'var(--accent-primary)' : 'var(--danger)' }}>{totalBudget > 0 ? Math.round((totalExpenses/totalBudget)*100) : 0}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((totalExpenses/Math.max(totalBudget, 1))*100, 100)}%` }} transition={{ duration: 1, delay: 0.5 }} style={{ height: '100%', backgroundColor: isUnderBudget ? 'var(--accent-primary)' : 'var(--danger)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              <span>₹{totalExpenses.toLocaleString()} spent</span>
              <span>₹{totalBudget.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Asset Allocation (Categories) */}
        <motion.div variants={itemVariants} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
           <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
              <PieChart size={18} color="var(--text-muted)" /> Expense Allocation
            </h3>
            
            <div style={{ flex: 1, position: 'relative', minHeight: '250px' }}>
              {expenseByCategory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={expenseByCategory} innerRadius={80} outerRadius={110} paddingAngle={2} dataKey="value" stroke="none">
                      {expenseByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)' }} itemStyle={{ color: 'var(--text-primary)' }} formatter={(value) => `₹${value}`} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                 <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p className="text-muted">No data</p></div>
              )}
              {/* Inner text overlay */}
              {expenseByCategory.length > 0 && (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{Math.round((expenseByCategory[0].value / totalExpenses) * 100)}%</h2>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>{expenseByCategory[0].name}</p>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '1rem' }}>
               {expenseByCategory.slice(0,3).map((cat, i) => (
                 <div key={i} style={{ textAlign: 'center' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                     <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: cat.color }}></div>
                     {cat.name}
                   </div>
                   <h4 style={{ fontSize: '1rem' }}>{Math.round((cat.value / totalExpenses) * 100)}%</h4>
                 </div>
               ))}
            </div>
        </motion.div>

        {/* Card 3: Quick Add Expense */}
        <motion.div variants={itemVariants} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
           <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <PlusCircle size={18} color="var(--accent-primary)" /> Quick Add Expense
           </h3>
           
           {successMessage && (
             <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', marginBottom: '0.75rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <CheckCircle size={14} /> {successMessage}
             </motion.div>
           )}
           
           {errorMessage && (
             <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', marginBottom: '0.75rem', fontWeight: 500 }}>
               {errorMessage}
             </motion.div>
           )}

           <form onSubmit={handleQuickSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, justifyContent: 'center' }}>
             <div style={{ display: 'flex', gap: '0.75rem' }}>
               <div style={{ flex: 1 }}>
                 <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Amount (₹)</label>
                 <div style={{ position: 'relative' }}>
                   <span style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 500 }}>₹</span>
                   <input
                     type="number"
                     required
                     placeholder="0.00"
                     value={quickExpense.amount}
                     onChange={(e) => setQuickExpense({ ...quickExpense, amount: e.target.value })}
                     style={{ paddingLeft: '1.25rem', paddingRight: '0.5rem', height: '36px', fontSize: '0.75rem' }}
                   />
                 </div>
               </div>
               <div style={{ flex: 1 }}>
                 <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category</label>
                 <select
                   value={quickExpense.category}
                   onChange={(e) => setQuickExpense({ ...quickExpense, category: e.target.value })}
                   style={{ height: '36px', fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                 >
                   {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
               </div>
               <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Mode</label>
                  <select
                    value={quickExpense.paymentMode || 'Cash'}
                    onChange={(e) => setQuickExpense({ ...quickExpense, paymentMode: e.target.value })}
                    style={{ height: '36px', fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                  </select>
                </div>
             </div>

             <div style={{ display: 'flex', gap: '0.75rem' }}>
               <div style={{ flex: 1 }}>
                 <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</label>
                 <input
                   type="date"
                   required
                   value={quickExpense.date}
                   onChange={(e) => setQuickExpense({ ...quickExpense, date: e.target.value })}
                   style={{ height: '36px', fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                 />
               </div>
               <div style={{ flex: 1 }}>
                 <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</label>
                 <input
                   type="text"
                   required
                   placeholder="e.g. Groceries"
                   value={quickExpense.description}
                   onChange={(e) => setQuickExpense({ ...quickExpense, description: e.target.value })}
                   style={{ height: '36px', fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                 />
               </div>
             </div>

             <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.25rem' }}>
               <input
                 type="checkbox"
                 id="quick-recurring"
                 checked={quickExpense.isRecurring || false}
                 onChange={(e) => setQuickExpense(prev => ({ ...prev, isRecurring: e.target.checked }))}
                 style={{ width: '12px', height: '12px', cursor: 'pointer' }}
               />
               <label htmlFor="quick-recurring" style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer' }}>Is recurring?</label>
             </div>

             {quickExpense.isRecurring && (
               <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ overflow: 'hidden' }}>
                 <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Frequency</label>
                 <select
                   value={quickExpense.recurringFrequency || 'none'}
                   onChange={(e) => setQuickExpense({ ...quickExpense, recurringFrequency: e.target.value })}
                   style={{ height: '36px', fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                 >
                   <option value="none">None</option>
                   <option value="daily">Daily</option>
                   <option value="weekly">Weekly</option>
                   <option value="monthly">Monthly</option>
                 </select>
               </motion.div>
             )}

             <button
               type="submit"
               disabled={submitting}
               className="btn btn-primary"
               style={{ width: '100%', padding: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.8125rem' }}
             >
               {submitting ? 'Adding...' : 'Add Expense'}
             </button>
           </form>
        </motion.div>

      </div>

      <style>{`
        .dashboard-bottom-grid {
          display: grid;
          grid-template-columns: minmax(0, 2fr) minmax(0, 1.2fr);
          gap: 1.5rem;
        }
        @media (max-width: 1024px) {
          .dashboard-bottom-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Bottom Row: 2 Columns Grid */}
      <div className="dashboard-bottom-grid">
        
        {/* Card 4: Daily Expenses */}
        <motion.div variants={itemVariants} className="card" style={{ padding: '2rem' }}>
          <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Spending Analysis</h4>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '2rem' }}>Daily Expenses for {new Date().getMonth() + 1}/{new Date().getFullYear()}</h3>
          
          <div style={{ height: '350px', width: '100%' }}>
            <ResponsiveContainer>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', boxShadow: 'var(--shadow-md)' }} />
                
                {/* 7-Day Average Line */}
                <Area type="monotone" dataKey="average" stroke="var(--warning)" fill="none" strokeDasharray="5 5" strokeWidth={2} activeDot={false} />
                {/* Daily Spend Line + Fill */}
                <Area type="monotone" dataKey="amount" stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" activeDot={{ r: 6, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                <div style={{ width: 16, borderBottom: '2px dashed var(--warning)' }}></div> 7-Day Average
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                <div style={{ width: 16, borderBottom: '3px solid var(--accent-primary)' }}></div> Daily Spend
             </div>
          </div>
        </motion.div>

        {/* Card 5: Top Categories */}
        <motion.div variants={itemVariants} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 Top Categories
              </h3>
              <Link to="/expenses"><ExternalLink size={16} color="var(--text-muted)" /></Link>
           </div>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {expenseByCategory.length > 0 ? expenseByCategory.slice(0,5).map((cat, i) => (
                <div key={i}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                      <div>
                         <h4 style={{ fontSize: '0.875rem', fontWeight: 600 }}>{cat.name}</h4>
                         <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{Math.round((cat.value / totalExpenses) * 100)}% of total</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                         <h4 style={{ fontSize: '0.875rem', fontWeight: 600 }}>₹{cat.value.toLocaleString()}</h4>
                      </div>
                   </div>
                   <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(cat.value / expenseByCategory[0].value) * 100}%` }} transition={{ duration: 1, delay: i * 0.2 }} style={{ height: '100%', backgroundColor: cat.color }} />
                   </div>
                </div>
              )) : (
                <p className="text-muted" style={{ textAlign: 'center' }}>No expenses logged yet.</p>
              )}
           </div>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default Dashboard;
