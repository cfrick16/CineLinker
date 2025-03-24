import { useSearchBarController } from './SearchBarController';
import { SearchBarView } from './SearchBarView';

export function SearchBar() {
  const [model, actions] = useSearchBarController();
  return <SearchBarView model={model} actions={actions} />;
} 