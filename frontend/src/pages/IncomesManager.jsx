import { useState, useEffect } from 'react';
import { useIncome } from '../context/IncomeContext';
import { Plus, Trash2, Search, Filter, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SOURCES = ['Salary', 'Freelance', 'Investments', 'Gifts', 'Refunds', 'Business', 'Other'];

const IncomesManager = () => {
  const { incomes, fetchIncomes, addIncome, deleteIncome, loading } = useIncome();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    source: 'Salary',
    date: new Date().toISOString().split('T')[0],
    description: '',
    isRecurring: false,
    recurringFrequency: 'none'
  });

  const [filters, setFilters] = useState({
    source: 'All',
    search: '',
  });

  useEffect(() => {
    fetchIncomes(filters);
  }, [fetchIncomes, filters.source]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await addIncome({
      ...formData,
      amount: Number(formData.amount)
    });
    if (res.success) {
      setShowAddForm(false);
      setFormData({
        amount: '', source: 'Salary', date: new Date().toISOString().split('T')[0], description: '', isRecurring: false, recurringFrequency: 'none'
      });
    } else {
      alert(res.error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => {
      const newFilters = { ...prev, [name]: value };
      if (name === 'search') {
        fetchIncomes(newFilters);
      }
      return newFilters;
    });
  };

  const handleExportCSV = () => {
    if (incomes.length === 0) return alert('No incomes to export');
    
    // Create CSV content
    const headers = ['Date', 'Description', 'Source', 'Amount (₹)', 'Recurring'];
    const csvRows = [headers.join(',')];
    
    incomes.forEach(i => {
      const row = [
        new Date(i.date).toLocaleDateString(),
        `"${i.description.replace(/"/g, '""')}"`, // escape quotes
        i.source,
        i.amount,
        i.isRecurring ? i.recurringFrequency : 'No'
      ];
      csvRows.push(row.join(','));
    });
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'incomes.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tableVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };
  
  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="container" style={{ padding: '0 1rem', maxWidth: '1200px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2>Manage Income</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleExportCSV} className="btn btn-outline">
            <Download size={20} /> Export CSV
          </button>
          <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary" style={{ backgroundColor: 'var(--success)', border: 'none', color: '#000' }}>
            <Plus size={20} /> Add Income
          </button>
        </div>
      </div>

      {showAddForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Amount (₹)</label>
              <input type="number" required value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
            </div>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Source</label>
              <select value={formData.source} onChange={(e) => setFormData({...formData, source: e.target.value})}>
                {SOURCES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Date</label>
              <input type="date" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Description</label>
              <input type="text" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', gridColumn: '1 / -1' }}>
              <input type="checkbox" id="recurring" style={{ width: 'auto' }} checked={formData.isRecurring} onChange={(e) => setFormData({...formData, isRecurring: e.target.checked})} />
              <label htmlFor="recurring" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Is Recurring?</label>
            </div>

            {formData.isRecurring && (
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Frequency</label>
                <select value={formData.recurringFrequency} onChange={(e) => setFormData({...formData, recurringFrequency: e.target.value})}>
                  <option value="none">None</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            )}

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary" style={{ backgroundColor: 'var(--success)', border: 'none', color: '#000' }}>Save Income</button>
              <button type="button" className="btn btn-outline" onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Filters */}
      <div className="card" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '200px' }}>
          <Search size={20} color="var(--text-muted)" />
          <input type="text" name="search" placeholder="Search by description..." value={filters.search} onChange={handleFilterChange} style={{ flex: 1 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={20} color="var(--text-muted)" />
          <select name="source" value={filters.source} onChange={handleFilterChange} style={{ width: 'auto' }}>
            <option value="All">All Sources</option>
            {SOURCES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="card">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
                  <th style={{ padding: '1rem' }}>Date</th>
                  <th style={{ padding: '1rem' }}>Description</th>
                  <th style={{ padding: '1rem' }}>Source</th>
                  <th style={{ padding: '1rem' }}>Amount</th>
                  <th style={{ padding: '1rem' }}>Recurring</th>
                  <th style={{ padding: '1rem' }}>Actions</th>
                </tr>
              </thead>
              <motion.tbody variants={tableVariants} initial="hidden" animate="show">
                {incomes.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No incomes logged yet.</td>
                  </tr>
                ) : (
                  incomes.map(income => (
                    <motion.tr variants={rowVariants} key={income._id} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', transition: 'background-color 0.2s' }} whileHover={{ backgroundColor: 'var(--bg-tertiary)' }}>
                      <td style={{ padding: '1rem' }}>{new Date(income.date).toLocaleDateString()}</td>
                      <td style={{ padding: '1rem', fontWeight: 500 }}>{income.description}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-tertiary)', fontSize: '0.75rem', fontWeight: 500 }}>
                          {income.source}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--success)', fontWeight: 600 }}>+₹{income.amount.toLocaleString()}</td>
                      <td style={{ padding: '1rem' }}>{income.isRecurring ? <span style={{ color: 'var(--success)', fontWeight: 500 }}>{income.recurringFrequency}</span> : <span style={{ color: 'var(--text-muted)' }}>No</span>}</td>
                      <td style={{ padding: '1rem' }}>
                        <button onClick={() => deleteIncome(income._id)} style={{ color: 'var(--danger)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }} title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </motion.tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default IncomesManager;
