import { SearchResult } from '@cinelinker/shared';
import { useSearchBarController } from './SearchBarController';
import { SearchBarView } from './SearchBarView';

interface SearchBarProps {
  submitGuess: (result: SearchResult) => void;
}

export function SearchBar({ submitGuess }: SearchBarProps) {
  const [model, actions] = useSearchBarController({submitGuess});
  return <SearchBarView model={model} actions={actions} />;
} 