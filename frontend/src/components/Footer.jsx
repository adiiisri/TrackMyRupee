import React from 'react';
import { CircleDollarSign, MessageCircle, Rss } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-color, rgba(255,255,255,0.05))',
      backgroundColor: '#080c14',
      padding: '4rem 2rem 2rem 2rem',
      zIndex: 10,
      position: 'relative',
      width: '100%',
      boxSizing: 'border-box'
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
              {/* LinkedIn (Inline SVG) */}
              <a
                href="https://www.linkedin.com/in/aditya-srivastava0/"
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
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              {/* GitHub (Inline SVG) */}
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
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>
              {/* WhatsApp (Lucide MessageCircle) */}
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
              {/* Instagram (Inline SVG) */}
              <a
                href="https://www.instagram.com/adiiisri/"
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
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid var(--border-color, rgba(255,255,255,0.05))',
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
  );
};

export default Footer;
