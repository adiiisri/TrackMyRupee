import React from 'react';

const Logo = ({ size = 32, variant = 'icon', color = 'var(--accent-primary)' }) => {
  if (variant === 'full') {
    return (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <linearGradient id="logo-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#10B981" />
            <stop offset="100%" stop-color="#06B6D4" />
          </linearGradient>
          <filter id="logo-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000000" flood-opacity="0.12" />
          </filter>
        </defs>
        
        {/* Squircle Background */}
        <rect x="6" y="6" width="88" height="88" rx="22" fill="url(#logo-bg-grad)" />
        
        {/* Inner grid lines for depth */}
        <path d="M 6 72 C 30 76, 70 48, 94 24" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="6" fill="none" />
        
        {/* Symbol */}
        <g filter="url(#logo-shadow)">
          <path d="M 37 30 L 37 70" stroke="#FFFFFF" strokeWidth="6.5" strokeLinecap="round" fill="none" />
          <path d="M 37 30 L 59 30 C 67 30, 67 44, 37 44" stroke="#FFFFFF" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M 31 37 L 53 37" stroke="#FFFFFF" strokeWidth="6.5" strokeLinecap="round" fill="none" />
          <path d="M 37 44 C 47 44, 52 66, 64 66 C 73 66, 76 46, 78 35" stroke="#FFFFFF" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M 71 39 L 78 35 L 81 42" stroke="#FFFFFF" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      </svg>
    );
  }

  // default variant: just the clean symbol (icon)
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <g>
        {/* Styled Rupee + Trend Arrow symbol using dynamic color */}
        <path d="M 37 26 L 37 74" stroke={color} strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M 37 26 L 61 26 C 70 26, 70 42, 37 42" stroke={color} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M 30 34 L 54 34" stroke={color} strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M 37 42 C 48 42, 52 68, 66 68 C 76 68, 80 44, 82 32" stroke={color} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M 74 36 L 82 32 L 85 40" stroke={color} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
    </svg>
  );
};

export default Logo;
