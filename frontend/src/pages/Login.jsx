import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
    
    // Check for errors from backend redirect
    const urlParams = new URLSearchParams(window.location.search);
    const urlError = urlParams.get('error');
    if (urlError === 'oauth_error') {
      setError('Google Login failed. Please check backend logs or try again.');
      window.history.replaceState({}, document.title, "/login");
    } else if (urlError === 'auth_failed') {
      setError('Authentication failed. User could not be created.');
      window.history.replaceState({}, document.title, "/login");
    } else if (urlError === 'server_error') {
      setError('A critical server error occurred. Check backend logs.');
      window.history.replaceState({}, document.title, "/login");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (!res.success) {
      setError(res.error);
    }
  };

  const handleGoogleLogin = () => {
    const baseURL = import.meta.env.MODE === 'development' 
      ? 'http://localhost:5000/api' 
      : 'https://trackmyrupee.onrender.com/api';
    window.location.href = `${baseURL}/auth/google`;
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-tertiary)' }}>
      <div className="card animate-fade-in" style={{ padding: '2.5rem', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <LogIn size={28} color="var(--accent-primary)" /> Welcome Back
        </h2>
        {error && <div style={{ padding: '0.75rem', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', padding: '0.75rem' }}>Log In</button>
        </form>

        <div style={{ margin: '1.5rem 0', position: 'relative', textAlign: 'center' }}>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />
          <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'var(--bg-secondary)', padding: '0 0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>OR</span>
        </div>

        <button onClick={handleGoogleLogin} className="btn btn-outline" style={{ width: '100%', marginBottom: '1.5rem', padding: '0.75rem' }}>
          Continue with Google
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ fontWeight: 500 }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
