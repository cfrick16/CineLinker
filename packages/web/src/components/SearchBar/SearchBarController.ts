import { useState, useCallback, useEffect } from 'react';
import { SearchMoviesAndActorsResponseBody, SearchResult } from '@cinelinker/shared';
import debounce from 'lodash/debounce';
import { SearchBarActions, SearchBarModel } from './SearchBarModel';
import { apiFetch } from '../../utils/api';

const MAX_RESULTS = 5;
const DEBOUNCE_TIME_MS = 300;

interface SearchBarControllerProps {
  submitGuess: (result: SearchResult) => void;
}

export function useSearchBarController({submitGuess}: SearchBarControllerProps): [SearchBarModel, SearchBarActions] {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);

    try {
      const data: SearchMoviesAndActorsResponseBody = await apiFetch(`/api/searchMoviesAndActors?searchQuery=${encodeURIComponent(searchQuery)}`);

      if (data.status === 'success' && data.results != null) {
        setSearchResults(data.results.slice(0, MAX_RESULTS));
      } else {
        console.error('Search failed');
      }
    } catch (err) {
      console.error('Network error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce(performSearch, DEBOUNCE_TIME_MS),
    []
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
    debouncedSearch(newQuery);
  }, [debouncedSearch]);

  const onResultClick = useCallback((result: SearchResult) => {
    submitGuess(result);
    setQuery('');
    setSearchResults([]);
  }, [submitGuess]);

  return [
    { query, isLoading, searchResults },
    { handleQueryChange, onResultClick }
  ];
} 