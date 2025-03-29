import { ChainBuilder } from './components/ChainBuilder';
import { DemoModal } from './components/DemoModal';
import { useState, useEffect } from 'react';

function App() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or use system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '16px', 
        position: 'relative', 
        height: '9vh',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg-secondary)'
      }}>
        <h1 style={{ 
          margin: 0, 
          position: 'absolute', 
          left: '50%', 
          transform: 'translateX(-50%)',
          color: 'var(--color-text-primary)'
        }}>
          CineLinker
        </h1>
        <button 
          onClick={() => setIsDemoOpen(true)}
          className="btn btn-primary"
          style={{
            position: 'absolute',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)'
          }}
        >
          How to Play
        </button>
      </div>

      <ChainBuilder />
      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
      
      <button 
        className="theme-toggle" 
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </div>
  );
}

export default App;
