import React from 'react';
import { CircleDollarSign, Linkedin, Github, Instagram, MessageCircle, Rss } from 'lucide-react';

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
              {/* LinkedIn */}
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
                <Instagram size={18} />
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
