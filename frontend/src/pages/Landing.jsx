import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, TrendingUp, Shield, BarChart3, Target, Sparkles, CheckCircle2, 
  Sparkle, CircleDollarSign, Linkedin, Github, Instagram, Send, MessageCircle, Globe, Mail, Rss 
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0b0f19', // Deep luxurious slate
      color: '#f3f4f6',
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
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(0,0,0,0) 70%)',
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
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, rgba(0,0,0,0) 70%)',
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
            background: 'linear-gradient(to right, #ffffff, #a7f3d0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            TrackMyRupee
          </h1>
        </div>

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
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          padding: '0.375rem 1rem',
          borderRadius: '9999px',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: '#34d399',
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
          background: 'linear-gradient(to bottom, #ffffff 60%, #9ca3af 100%)',
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
          color: '#9ca3af',
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
          <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
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
            background: 'rgba(17, 24, 39, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '1.75rem',
            borderRadius: '16px',
            backdropFilter: 'blur(12px)',
            transition: 'transform 0.2s ease',
            boxShadow: 'var(--shadow-md)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ color: '#10b981', marginBottom: '1rem' }}><TrendingUp size={24} /></div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Expense Manager</h3>
            <p style={{ fontSize: '0.875rem', color: '#9ca3af', lineHeight: 1.5, margin: 0 }}>
              Easily catalog, search, and categorize daily expenses in rupees dynamically.
            </p>
          </div>

          {/* Card 2 */}
          <div style={{
            background: 'rgba(17, 24, 39, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '1.75rem',
            borderRadius: '16px',
            backdropFilter: 'blur(12px)',
            transition: 'transform 0.2s ease',
            boxShadow: 'var(--shadow-md)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ color: '#34d399', marginBottom: '1rem' }}><BarChart3 size={24} /></div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Visual Budgeting</h3>
            <p style={{ fontSize: '0.875rem', color: '#9ca3af', lineHeight: 1.5, margin: 0 }}>
              Set category limits with colorful dynamic bars that warn you as you spend.
            </p>
          </div>

          {/* Card 3 */}
          <div style={{
            background: 'rgba(17, 24, 39, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '1.75rem',
            borderRadius: '16px',
            backdropFilter: 'blur(12px)',
            transition: 'transform 0.2s ease',
            boxShadow: 'var(--shadow-md)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ color: '#10b981', marginBottom: '1rem' }}><Target size={24} /></div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Savings Targets</h3>
            <p style={{ fontSize: '0.875rem', color: '#9ca3af', lineHeight: 1.5, margin: 0 }}>
              Track custom savings goals for laptops, trips, or emergencies with milestone progress.
            </p>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        backgroundColor: '#080c14',
        padding: '4rem 2rem 2rem 2rem',
        zIndex: 10,
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem',
          textAlign: 'left'
        }}>
          {/* Column 1: Brand & Logo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CircleDollarSign size={22} color="#10b981" />
              <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#ffffff' }}>TrackMyRupee</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#9ca3af', lineHeight: 1.6, margin: 0 }}>
              TrackMyRupee provides a modern, fast, and secure expense management platform. Take complete control over your daily spendings, visual budgets, and savings goals dynamically.
            </p>
          </div>

          {/* Column 2: Categories */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.25rem' }}>Features</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><a href="#" style={{ fontSize: '0.875rem', color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#10b981'} onMouseLeave={e => e.target.style.color = '#9ca3af'}>Expense Tracking</a></li>
              <li><a href="#" style={{ fontSize: '0.875rem', color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#10b981'} onMouseLeave={e => e.target.style.color = '#9ca3af'}>Smart Budgets</a></li>
              <li><a href="#" style={{ fontSize: '0.875rem', color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#10b981'} onMouseLeave={e => e.target.style.color = '#9ca3af'}>Savings Target Goals</a></li>
              <li><a href="#" style={{ fontSize: '0.875rem', color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#10b981'} onMouseLeave={e => e.target.style.color = '#9ca3af'}>Visual Cashflow</a></li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.25rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><a href="#" style={{ fontSize: '0.875rem', color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#10b981'} onMouseLeave={e => e.target.style.color = '#9ca3af'}>About Us</a></li>
              <li><a href="#" style={{ fontSize: '0.875rem', color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#10b981'} onMouseLeave={e => e.target.style.color = '#9ca3af'}>Contact Us</a></li>
              <li><a href="#" style={{ fontSize: '0.875rem', color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#10b981'} onMouseLeave={e => e.target.style.color = '#9ca3af'}>Disclaimer</a></li>
              <li><a href="#" style={{ fontSize: '0.875rem', color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#10b981'} onMouseLeave={e => e.target.style.color = '#9ca3af'}>Privacy Policy</a></li>
            </ul>
          </div>

          {/* Column 4: Follow Us On */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.25rem' }}>Follow Us On</h4>
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              padding: '1.25rem',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Rss size={20} color="#34d399" />
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff' }}>Follow Us On Social Media</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Get Latest Update On Social Media</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: '#0077b5',
                    color: '#ffffff',
                    transition: 'transform 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <Linkedin size={18} />
                </a>
                {/* GitHub */}
                <a
                  href="https://github.com/adiiisri"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: '#1b1f23',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    transition: 'transform 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <Github size={18} />
                </a>
                {/* Telegram */}
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: '#0088cc',
                    color: '#ffffff',
                    transition: 'transform 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <Send size={18} />
                </a>
                {/* WhatsApp */}
                <a
                  href="https://wa.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: '#25d366',
                    color: '#ffffff',
                    transition: 'transform 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <MessageCircle size={18} />
                </a>
                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: '#e1306c',
                    color: '#ffffff',
                    transition: 'transform 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <Instagram size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
            TrackMyRupee • All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
