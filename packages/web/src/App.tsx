import { Chain } from './components/chain';
import { SearchBar } from './components/SearchBar';
import { useSearchBarController } from './components/SearchBar/SearchBarController';

function App() {
  const [searchModel, searchActions] = useSearchBarController();

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <h1 style={{ textAlign: 'center' }}>CineLinker</h1>
      <SearchBar model={searchModel} actions={searchActions} />
      <Chain />
    </div>
  );
}

export default App; 