import { SearchResult } from '@cinelinker/shared';
import { useSearchBarController } from './SearchBarController';
import { SearchBarView } from './SearchBarView';

interface SearchBarProps {
  onResultClick: (result: SearchResult) => void;
}

export function SearchBar({ onResultClick }: SearchBarProps) {
  const [model, actions] = useSearchBarController();
  return <SearchBarView model={model} actions={{...actions, onResultClick}} />;
} 