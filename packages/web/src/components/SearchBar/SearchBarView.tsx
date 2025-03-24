import { SearchBarModel, SearchBarActions } from './SearchBarModel';
import { SearchResult } from '@cinelinker/shared';
import { useRef } from 'react';
import './SearchBar.css';

interface SearchBarProps {
  model: SearchBarModel;
  actions: SearchBarActions;
}

export function SearchBarView({ model, actions }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    actions.handleQueryChange(e.target.value);
  };

  const getDefaultImage = (type: string) => {
    return type === 'movie' 
      ? '/images/default-movie.svg'
      : '/images/default-actor.svg';
  };

  const renderResult = (result: SearchResult) => (
    <div 
      key={result.id} 
      className={`search-result ${result.entityType}`}
      onClick={() => actions.onResultClick?.(result)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          actions.onResultClick?.(result);
        }
      }}
    >
      <img
        src={result.imageUrl || getDefaultImage(result.entityType)}
        alt={result.text}
        className={`result-image ${result.entityType}`}
        onError={(e) => {
          e.currentTarget.src = getDefaultImage(result.entityType);
        }}
      />
      <div className="result-content">
        <h3>{result.text}</h3>
        <span className="result-type">{result.entityType}</span>
      </div>
    </div>
  );

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          value={model.query}
          onChange={handleInputChange}
          placeholder="Search movies and actors..."
          className={`search-input ${model.isLoading ? 'loading' : ''}`}
        />
        {model.isLoading && (
          <div className="loading-indicator" />
        )}
      </div>

      {model.error && (
        <div className="error-message">
          <span>⚠️</span> {model.error}
        </div>
      )}

      {model.searchResults.length > 0 && (
        <div className="search-results">
          {model.searchResults.map(renderResult)}
        </div>
      )}
    </div>
  );
} 