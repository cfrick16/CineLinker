import { useState, useCallback, useEffect } from 'react';
import { SearchMoviesAndActorsResponseBody, SearchResult } from '@cinelinker/shared';
import debounce from 'lodash/debounce';
import { SearchBarModel } from './SearchBarModel';

const MAX_RESULTS = 5;
const DEBOUNCE_TIME_MS = 300;

export function useSearchBarController(): [SearchBarModel, {handleQueryChange: (query: string) => void}] {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string>();

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      const response: Response = await fetch(`/api/searchMoviesAndActors?searchQuery=${encodeURIComponent(searchQuery)}`);
      const data: SearchMoviesAndActorsResponseBody = await response.json();

      if (data.status === 'success' && data.results != null) {
        setSearchResults(data.results.slice(0, MAX_RESULTS));
      } else {
        setError('Search failed: ' + response);
      }
    } catch (err) {
      setError('Network error');
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


  return [
    { query, isLoading, searchResults, error },
    { handleQueryChange }
  ];
} 