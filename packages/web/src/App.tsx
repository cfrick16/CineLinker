import { ChainBuilder } from './components/ChainBuilder';
import { DemoModal } from './components/DemoModal';
import { useState } from 'react';

function App() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '16px', 
        position: 'relative', 
        height: '9vh',
      }}>
        <h1 style={{ 
          margin: 0, 
          position: 'absolute', 
          left: '50%', 
          transform: 'translateX(-50%)' 
        }}>
          CineLinker
        </h1>
        <button 
          onClick={() => setIsDemoOpen(true)}
          style={{
            position: 'absolute',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          How to Play
        </button>
      </div>

      <ChainBuilder />
      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </div>
  );
}

export default App; 