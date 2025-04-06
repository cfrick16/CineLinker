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
  const [currentPage, setCurrentPage] = useState(1);

  const performSearch = async (searchQuery: string, page: number) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);

    try {
      const data: SearchMoviesAndActorsResponseBody = await apiFetch(`/api/searchMoviesAndActors?searchQuery=${encodeURIComponent(searchQuery)}&page=${page}`);

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
    setCurrentPage(1);
    setQuery(newQuery);
    debouncedSearch(newQuery, 1);
  }, [debouncedSearch]);

  const onResultClick = useCallback((result: SearchResult) => {
    submitGuess(result);
    setQuery('');
    setSearchResults([]);
  }, [submitGuess]);

  const handlePreviousPage = useCallback(() => {
    performSearch(query, currentPage - 1);
    setCurrentPage(currentPage - 1);
  }, [currentPage, query]);

  const handleNextPage = useCallback(() => {
    performSearch(query, currentPage + 1);
    setCurrentPage(currentPage + 1);
  }, [currentPage, query]);

  return [
    { query, isLoading, searchResults, currentPage },
    { handleQueryChange, onResultClick, handlePreviousPage, handleNextPage }
  ];
} 