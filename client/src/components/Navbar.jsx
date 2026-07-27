import React, { useEffect, useState } from 'react';
import { Trash2, Sun, Moon, Flame } from 'lucide-react';

export function Navbar({ onClear }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Flame className="brand-icon" size={24} strokeWidth={2.5} color="var(--color-accent)" />
        <span>Flam Assistant</span>
      </div>
      
      <div className="navbar-actions">
        <button 
          onClick={toggleTheme} 
          className="theme-toggle-btn"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button 
          onClick={onClear} 
          title="Clear Session"
          className="clear-session-btn"
        >
          <Trash2 size={16} />
          <span>Clear</span>
        </button>
      </div>
    </nav>
  );
}
