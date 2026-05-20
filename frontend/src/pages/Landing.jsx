import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, TrendingUp, Shield, BarChart3, Target, Sparkles, CheckCircle2, 
  Sparkle, CircleDollarSign, Moon, Sun 
} from 'lucide-react';
import Footer from '../components/Footer';

const Landing = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme === 'dark' ? '#0b0f19' : '#ffffff',
      color: theme === 'dark' ? '#f3f4f6' : '#1f2937',
      fontFamily: "'Inter', sans-serif', system-ui",
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      {/* Background Decorative Blur Orbs */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '50vw',
        height: '50vw',
        borderRadius: '50%',
        background: theme === 'dark'
          ? 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(0,0,0,0) 70%)'
          : 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(0,0,0,0) 70%)',
        zIndex: 1,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-10%',
        width: '50vw',
        height: '50vw',
        borderRadius: '50%',
        background: theme === 'dark'
          ? 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, rgba(0,0,0,0) 70%)'
          : 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(0,0,0,0) 70%)',
        zIndex: 1,
        pointerEvents: 'none'
      }} />

      {/* HEADER NAVBAR */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 2rem',
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        zIndex: 10,
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            padding: '0.5rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
          }}>
            <CircleDollarSign size={24} color="#ffffff" />
          </div>
          <h1 style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            letterSpacing: '-0.5px',
            margin: 0,
            background: theme === 'dark'
              ? 'linear-gradient(to right, #ffffff, #a7f3d0)'
              : 'linear-gradient(to right, #111827, #059669)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            TrackMyRupee
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={toggleTheme}
            style={{
              background: 'transparent',
              border: 'none',
              color: theme === 'dark' ? '#34d399' : '#059669',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.625rem',
              borderRadius: '50%',
              backgroundColor: theme === 'dark' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.05)',
              transition: 'all 0.2s',
              boxShadow: theme === 'dark' ? 'none' : '0 2px 8px rgba(0,0,0,0.05)'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            id="btn-nav-dashboard"
            onClick={() => navigate('/dashboard')}
            className="btn btn-outline"
            style={{
              borderColor: 'rgba(16, 185, 129, 0.3)',
              color: '#10b981',
              padding: '0.5rem 1.25rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              borderRadius: '10px',
              backdropFilter: 'blur(4px)',
              transition: 'all 0.2s ease',
              backgroundColor: 'rgba(16, 185, 129, 0.05)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
            }}
          >
            Launch Dashboard
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        maxWidth: '1000px',
        width: '100%',
        margin: '0 auto',
        zIndex: 10,
        position: 'relative',
        textAlign: 'center'
      }}>
        {/* Glow Tagline */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: theme === 'dark' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.08)',
          border: theme === 'dark' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(16, 185, 129, 0.25)',
          padding: '0.375rem 1rem',
          borderRadius: '9999px',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: theme === 'dark' ? '#34d399' : '#047857',
          marginBottom: '2rem',
          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.05)'
        }}>
          <Sparkles size={14} /> Bypassed Trial Mode Active — Instant Access
        </div>

        {/* Big Premium Header */}
        <h2 style={{
          fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
          fontWeight: 800,
          lineHeight: 1.15,
          letterSpacing: '-1.5px',
          maxWidth: '850px',
          margin: '0 0 1.5rem 0',
          background: theme === 'dark'
            ? 'linear-gradient(to bottom, #ffffff 60%, #9ca3af 100%)'
            : 'linear-gradient(to bottom, #111827 60%, #4b5563 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Take Complete Control of Your <span style={{
            background: 'linear-gradient(to right, #10b981, #34d399)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Personal Wealth</span>
        </h2>

        {/* Sub-heading */}
        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          color: theme === 'dark' ? '#9ca3af' : '#4b5563',
          maxWidth: '650px',
          lineHeight: 1.6,
          margin: '0 0 3rem 0'
        }}>
          Track expenses dynamically, set intelligent budgets, hit saving goals, and visualizes cash flow with an elegant, modern financial dashboard designed for you.
        </p>

        {/* Dynamic CTA Button */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
          <button
            id="btn-hero-dashboard"
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '1rem 2.5rem',
              fontSize: '1.125rem',
              fontWeight: 700,
              color: '#ffffff',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              borderRadius: '14px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: '0 8px 30px rgba(16, 185, 129, 0.4)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(16, 185, 129, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(16, 185, 129, 0.4)';
            }}
          >
            Enter Trial Dashboard <ArrowRight size={20} />
          </button>
          <span style={{ fontSize: '0.8125rem', color: theme === 'dark' ? '#6b7280' : '#4b5563' }}>
            No credit card, no signups required. Sandbox profile fully pre-loaded.
          </span>
        </div>

        {/* Feature Grid / Cards (WOW aesthetic) */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          width: '100%',
          marginTop: '5rem',
          textAlign: 'left'
        }}>
          {/* Card 1 */}
          <div style={{
            background: theme === 'dark' ? 'rgba(17, 24, 39, 0.6)' : 'rgba(255, 255, 255, 0.75)',
            border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.06)',
            padding: '1.75rem',
            borderRadius: '16px',
            backdropFilter: 'blur(12px)',
            transition: 'transform 0.2s ease',
            boxShadow: theme === 'dark' ? 'var(--shadow-md)' : '0 8px 30px rgba(0,0,0,0.03)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ color: '#10b981', marginBottom: '1rem' }}><TrendingUp size={24} /></div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: theme === 'dark' ? '#ffffff' : '#111827' }}>Expense Manager</h3>
            <p style={{ fontSize: '0.875rem', color: theme === 'dark' ? '#9ca3af' : '#4b5563', lineHeight: 1.5, margin: 0 }}>
              Easily catalog, search, and categorize daily expenses in rupees dynamically.
            </p>
          </div>

          {/* Card 2 */}
          <div style={{
            background: theme === 'dark' ? 'rgba(17, 24, 39, 0.6)' : 'rgba(255, 255, 255, 0.75)',
            border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.06)',
            padding: '1.75rem',
            borderRadius: '16px',
            backdropFilter: 'blur(12px)',
            transition: 'transform 0.2s ease',
            boxShadow: theme === 'dark' ? 'var(--shadow-md)' : '0 8px 30px rgba(0,0,0,0.03)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ color: '#34d399', marginBottom: '1rem' }}><BarChart3 size={24} /></div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: theme === 'dark' ? '#ffffff' : '#111827' }}>Visual Budgeting</h3>
            <p style={{ fontSize: '0.875rem', color: theme === 'dark' ? '#9ca3af' : '#4b5563', lineHeight: 1.5, margin: 0 }}>
              Set category limits with colorful dynamic bars that warn you as you spend.
            </p>
          </div>

          {/* Card 3 */}
          <div style={{
            background: theme === 'dark' ? 'rgba(17, 24, 39, 0.6)' : 'rgba(255, 255, 255, 0.75)',
            border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.06)',
            padding: '1.75rem',
            borderRadius: '16px',
            backdropFilter: 'blur(12px)',
            transition: 'transform 0.2s ease',
            boxShadow: theme === 'dark' ? 'var(--shadow-md)' : '0 8px 30px rgba(0,0,0,0.03)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ color: '#10b981', marginBottom: '1rem' }}><Target size={24} /></div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: theme === 'dark' ? '#ffffff' : '#111827' }}>Savings Targets</h3>
            <p style={{ fontSize: '0.875rem', color: theme === 'dark' ? '#9ca3af' : '#4b5563', lineHeight: 1.5, margin: 0 }}>
              Track custom savings goals for laptops, trips, or emergencies with milestone progress.
            </p>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Landing;
