import { ChainBuilder } from './components/ChainBuilder';

function App() {
  console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <h1 style={{ textAlign: 'center' }}>CineLinker</h1>
      <ChainBuilder />;
    </div>
  );
}

export default App; 