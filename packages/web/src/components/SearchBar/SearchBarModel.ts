import { SearchResult } from "@cinelinker/shared";

export interface SearchBarModel {
  query: string;
  isLoading: boolean;
  searchResults: SearchResult[];
  currentPage: number;
}

export interface SearchBarActions {
  handleQueryChange: (query: string) => void;
  onResultClick: (result: SearchResult) => void;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
} 