import { useEffect, useMemo } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { Link } from 'react-router-dom';
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, CheckCircle, ExternalLink, Activity, Trophy } from 'lucide-react';

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

const Dashboard = () => {
  const { expenses, fetchExpenses, budgets, fetchBudgets, loading } = useExpense();

  useEffect(() => {
    fetchExpenses();
    const today = new Date();
    fetchBudgets(today.getMonth() + 1, today.getFullYear());
  }, [fetchExpenses, fetchBudgets]);

  const totalExpenses = useMemo(() => expenses.reduce((acc, curr) => acc + curr.amount, 0), [expenses]);
  const totalBudget = useMemo(() => budgets.reduce((acc, curr) => acc + curr.amount, 0), [budgets]);
  
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
      
      {/* Top Row: 3 Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        
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

        {/* Card 3: Smart Insights */}
        <motion.div variants={itemVariants} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
           <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
              <Trophy size={18} color="var(--text-muted)" /> Smart Insights - {new Date().toLocaleString('default', { month: 'long' })}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1, justifyContent: 'center' }}>
               
               <motion.div whileHover={{ x: 5 }} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <Trophy size={20} color="var(--warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                     Milestone Reached! You have successfully tracked <strong style={{ color: 'var(--text-primary)' }}>{expenses.length}</strong> transactions this month.
                  </p>
               </motion.div>

               <motion.div whileHover={{ x: 5 }} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <TrendingUp size={20} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                     {expenseByCategory[0] ? `You spent ${Math.round((expenseByCategory[0].value/totalExpenses)*100)}% of your expenses on ${expenseByCategory[0].name}. Reduce by 20% to save ₹${Math.round(expenseByCategory[0].value * 0.2)}.` : 'Log more expenses for insights!'}
                  </p>
               </motion.div>

               <motion.div whileHover={{ x: 5 }} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <TrendingDown size={20} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                     Great job! Your recent spending trend is stabilizing.
                  </p>
               </motion.div>

            </div>
        </motion.div>

      </div>

      {/* Bottom Row: 2 Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1.2fr)', gap: '1.5rem' }}>
        
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
