import { SearchResult } from "@cinelinker/shared";

export interface SearchBarModel {
  query: string;
  isLoading: boolean;
  searchResults: SearchResult[];
  error?: string;
}

export interface SearchBarActions {
  handleQueryChange: (query: string) => void;
} 