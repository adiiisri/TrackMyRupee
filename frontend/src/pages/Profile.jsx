import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axiosInstance';
import { User, Save, Phone, Briefcase, Calendar, Info, IndianRupee } from 'lucide-react';

const AVATARS = ['👤', '👨‍💻', '👩‍💻', '🦸‍♂️', '🦸‍♀️', '🥷', '🧙‍♂️', '🧑‍🚀', '🦁', '🦊', '🦉', '🦄'];

const Profile = () => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: user?.age || '',
    profession: user?.profession || '',
    gender: user?.gender || 'Prefer not to say',
    phone: user?.phone || '',
    avatar: user?.avatar || '👤',
    currency: user?.currency || 'INR',
    bio: user?.bio || '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarSelect = (emoji) => {
    setFormData({ ...formData, avatar: emoji });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const { data } = await api.put('/auth/profile', formData);
      // Update local storage so the new profile details persist before reload
      const existingUser = JSON.parse(localStorage.getItem('userInfo'));
      localStorage.setItem('userInfo', JSON.stringify({ ...existingUser, ...data }));
      
      setMessage('Profile updated successfully!');
      // Reload to ensure context is updated everywhere
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <User size={28} color="var(--accent-primary)" /> My Profile
      </h2>

      <div className="card" style={{ padding: '2rem' }}>
        {message && <div style={{ padding: '0.75rem', backgroundColor: 'var(--success-light)', color: 'var(--success)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>{message}</div>}
        {error && <div style={{ padding: '0.75rem', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Avatar Selection */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Choose Avatar</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {AVATARS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleAvatarSelect(emoji)}
                  style={{
                    fontSize: '2rem',
                    padding: '0.5rem',
                    borderRadius: '50%',
                    backgroundColor: formData.avatar === emoji ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                    border: formData.avatar === emoji ? '2px solid var(--accent-primary)' : '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email Address</label>
              <input type="email" value={user?.email || ''} disabled style={{ opacity: 0.7, cursor: 'not-allowed' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 500 }}><Calendar size={16}/> Age</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="e.g. 25" />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 500 }}><Briefcase size={16}/> Profession</label>
              <input type="text" name="profession" value={formData.profession} onChange={handleChange} placeholder="e.g. Software Engineer" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 500 }}><Phone size={16}/> Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g. +91 9876543210" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 500 }}><IndianRupee size={16}/> Preferred Currency</label>
              <select name="currency" value={formData.currency} onChange={handleChange}>
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="GBP">British Pound (£)</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 500 }}><Info size={16}/> Bio</label>
              <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="A short bio about yourself..." rows={3} style={{ resize: 'vertical' }}></textarea>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ alignSelf: 'flex-start', padding: '0.75rem 1.5rem', marginTop: '1rem' }}>
            {loading ? 'Saving...' : <><Save size={18} /> Save Profile</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
