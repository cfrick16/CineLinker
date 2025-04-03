import React, { useState } from 'react';
import { EntityType, GetDailyChallengeResponseBody } from '@cinelinker/shared';
import './ChallengeControls.css';

interface ChallengeControlsProps {
  onChallengeGenerated: (challenge: GetDailyChallengeResponseBody) => void;
  startActorId?: string;
  endActorId?: string;
  currentPath?: {id: string, type: EntityType}[];
}

interface HintNode {
  id: string;
  type: EntityType;
  name: string;
}

export const ChallengeControls: React.FC<ChallengeControlsProps> = ({
  onChallengeGenerated,
  startActorId,
  endActorId,
  currentPath = []
}) => {
  const [difficultyLevel, setDifficultyLevel] = useState<number>(5);
  const [minPaths, setMinPaths] = useState<number>(2);
  const [maxPaths, setMaxPaths] = useState<number>(5);
  const [popularityLevel, setPopularityLevel] = useState<number>(8);
  const [generationType, setGenerationType] = useState<string>('difficulty');
  const [loading, setLoading] = useState<boolean>(false);
  const [hint, setHint] = useState<HintNode | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateChallenge = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let url = '';
      
      switch (generationType) {
        case 'difficulty':
          url = `/api/generateChallenge?difficulty=${difficultyLevel}`;
          break;
        case 'pathCount':
          url = `/api/generateChallengeByPathCount?minPaths=${minPaths}&maxPaths=${maxPaths}`;
          break;
        case 'popularity':
          url = `/api/generateChallengeByPopularity?popularity=${popularityLevel}`;
          break;
        default:
          url = '/api/generateChallenge';
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === 'success') {
        onChallengeGenerated(data);
      } else {
        setError('Failed to generate challenge');
      }
    } catch (error) {
      setError('Error generating challenge');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getHint = async () => {
    if (!startActorId || !endActorId) {
      setError('No active challenge to get a hint for');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/getHint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          startActorId,
          endActorId,
          currentPath
        })
      });
      
      const data = await response.json();
      
      if (data.status === 'success' && data.hint) {
        setHint(data.hint);
        setShowHint(true);
      } else {
        setError('No hint available');
      }
    } catch (error) {
      setError('Error getting hint');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const findSolution = async () => {
    if (!startActorId || !endActorId) {
      setError('No active challenge to solve');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/findPath?startActorId=${startActorId}&endActorId=${endActorId}`);
      const data = await response.json();
      
      if (data.status === 'success' && data.path) {
        // Display the solution path
        setHint({
          id: 'solution',
          type: EntityType.Actor,
          name: `Solution found with ${data.path.pathLength} steps`
        });
        setShowHint(true);
      } else {
        setError('No solution found');
      }
    } catch (error) {
      setError('Error finding solution');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="challenge-controls">
      <h2>Challenge Controls</h2>
      
      <div className="control-section">
        <h3>Generate Challenge</h3>
        
        <div className="control-type">
          <label>
            <input
              type="radio"
              value="difficulty"
              checked={generationType === 'difficulty'}
              onChange={() => setGenerationType('difficulty')}
            />
            By Difficulty
          </label>
          
          <label>
            <input
              type="radio"
              value="pathCount"
              checked={generationType === 'pathCount'}
              onChange={() => setGenerationType('pathCount')}
            />
            By Path Count
          </label>
          
          <label>
            <input
              type="radio"
              value="popularity"
              checked={generationType === 'popularity'}
              onChange={() => setGenerationType('popularity')}
            />
            By Popularity
          </label>
        </div>
        
        {generationType === 'difficulty' && (
          <div className="control-slider">
            <label>Difficulty Level: {difficultyLevel}</label>
            <input
              type="range"
              min="1"
              max="10"
              value={difficultyLevel}
              onChange={(e) => setDifficultyLevel(parseInt(e.target.value))}
            />
            <span className="range-labels">
              <span>Easy</span>
              <span>Hard</span>
            </span>
          </div>
        )}
        
        {generationType === 'pathCount' && (
          <div className="control-slider">
            <label>Min Paths: {minPaths}</label>
            <input
              type="range"
              min="1"
              max="10"
              value={minPaths}
              onChange={(e) => setMinPaths(parseInt(e.target.value))}
            />
            <label>Max Paths: {maxPaths}</label>
            <input
              type="range"
              min={minPaths}
              max="15"
              value={maxPaths}
              onChange={(e) => setMaxPaths(parseInt(e.target.value))}
            />
          </div>
        )}
        
        {generationType === 'popularity' && (
          <div className="control-slider">
            <label>Popularity Level: {popularityLevel}</label>
            <input
              type="range"
              min="1"
              max="10"
              value={popularityLevel}
              onChange={(e) => setPopularityLevel(parseInt(e.target.value))}
            />
            <span className="range-labels">
              <span>Obscure</span>
              <span>Popular</span>
            </span>
          </div>
        )}
        
        <button 
          className="generate-button"
          onClick={generateChallenge}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Challenge'}
        </button>
      </div>
      
      <div className="control-section">
        <h3>Help</h3>
        
        <div className="help-buttons">
          <button 
            className="hint-button"
            onClick={getHint}
            disabled={loading || !startActorId || !endActorId}
          >
            Get Hint
          </button>
          
          <button 
            className="solution-button"
            onClick={findSolution}
            disabled={loading || !startActorId || !endActorId}
          >
            Show Solution
          </button>
        </div>
        
        {showHint && hint && (
          <div className="hint-display">
            <h4>Hint:</h4>
            <p>{hint.name}</p>
            {hint.id !== 'solution' && (
              <p>Type: {hint.type === EntityType.Actor ? 'Actor' : 'Movie'}</p>
            )}
            <button 
              className="close-hint"
              onClick={() => setShowHint(false)}
            >
              Close
            </button>
          </div>
        )}
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};
