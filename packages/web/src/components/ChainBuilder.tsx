import { EntityType, GetDailyChallengeResponseBody, GetSolutionResponseBody, SearchResult, TmdbEntity } from '@cinelinker/shared';
import { SearchBar } from './SearchBar';
import { Chain } from './chain';
import { convertToChainNode, isEntityRelated, getEntity } from '../common/entityFunctions';
import { ChainNode } from './chain/ChainModel';
import { useEffect, useState } from 'react';
import { GuessCounter } from './guessCount';
import { apiFetch } from '../utils/api';
import './ChainBuilder.css';

export function ChainBuilder() {
  const [failedResult, setFailedResult] = useState<SearchResult | null>(null);
  const [guessCount, setGuessCount] = useState(0);
  const [invalidGuessCount, setInvalidGuessCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isShowingSolution, setIsShowingSolution] = useState(false);

  const [leftNodes, setLeftNodes] = useState<ChainNode[]>([]);  
  const [rightNodes, setRightNodes] = useState<ChainNode[]>([]);
  const [centerNode, setCenterNode] = useState<ChainNode | null>(null);

  // Store original nodes when showing solution
  const [originalLeftNodes, setOriginalLeftNodes] = useState<ChainNode[]>([]);
  const [originalRightNodes, setOriginalRightNodes] = useState<ChainNode[]>([]);
  const [originalCenterNode, setOriginalCenterNode] = useState<ChainNode | null>(null);

  const submitGuess = async (result: SearchResult) => {
    if (isShowingSolution) return; // Don't allow guesses while showing solution
    
    setGuessCount(prev => prev + 1);
    const entity = await getEntity(result);
    const node = convertToChainNode(entity, result.entityType);

    const leftEndNode = leftNodes[leftNodes.length - 1];
    const rightEndNode = rightNodes[0];

    const isConnectedLeft = isEntityRelated(result, leftEndNode);
    const isConnectedRight = isEntityRelated(result, rightEndNode);

    if(isConnectedLeft && isConnectedRight) {
      setCenterNode(node);
    } else if(isConnectedLeft) {
      setLeftNodes([...leftNodes, node]);
    } else if(isConnectedRight) {
      setRightNodes([node, ...rightNodes]);
    } else {
      setInvalidGuessCount(prev => prev + 1);
      // Show failure animation
      setFailedResult(result);
      // Reset after animation completes
      setTimeout(() => setFailedResult(null), 400);
    }
  };

  const getTodayDateStringLocalTime = () => {
    const dateSplit = new Date().toLocaleDateString().split('/');
    const today = dateSplit[2] + '-' + dateSplit[0].padStart(2, '0') + '-' + dateSplit[1].padStart(2, '0');
    return today;
  }

  const getSolutionIdString = (entity: TmdbEntity) => {
    return `${entity.type === EntityType.Actor ? 'p' : 'm'}${entity.entity.id}`;
  }

  const findSolution = async () => {
    if (!leftNodes[0]?.entity.id || !rightNodes[0]?.entity.id) {
      setError('No active challenge to solve');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Store current state
      setOriginalLeftNodes([...leftNodes]);
      setOriginalRightNodes([...rightNodes]);
      setOriginalCenterNode(centerNode);
      
      const solutionId = `${getSolutionIdString(leftNodes[0])}-${getSolutionIdString(rightNodes[0])}`;
      const data: GetSolutionResponseBody = await apiFetch(`/api/getSolution?solutionId=${solutionId}`);
      
      if (data.solution && data.solution.length > 0) {
        // Convert solution to chain nodes
        const solutionNodes = data.solution.map((entity: any) => 
          convertToChainNode(entity.entity, entity.entityType)
        );
        
        // Split solution into left and right parts
        const midPoint = Math.floor(solutionNodes.length / 2);
        setLeftNodes(solutionNodes.slice(0, midPoint));
        setRightNodes(solutionNodes.slice(midPoint).reverse());
        setCenterNode(null);
        setIsShowingSolution(true);
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

  const hideSolution = () => {
    // Restore original state
    setLeftNodes([...originalLeftNodes]);
    setRightNodes([...originalRightNodes]);
    setCenterNode(originalCenterNode);
    setIsShowingSolution(false);
  };

  useEffect(() => {
    apiFetch(`/api/getDailyChallenge?date=${getTodayDateStringLocalTime()}`)
      .then((data: GetDailyChallengeResponseBody) => {
        const startNode = convertToChainNode(data.start, data.startType);
        const endNode = convertToChainNode(data.end, data.endType);
        // Set the initial nodes
        setLeftNodes([startNode]);
        setRightNodes([endNode]);
        // Also set as original nodes
        setOriginalLeftNodes([startNode]);
        setOriginalRightNodes([endNode]);
      });
  }, []);

  return (
    <div className={`chain-builder${failedResult != null ? '-connection-failed' : '' }`}>
      <div className="header">
        <div className="search-area">
          <SearchBar submitGuess={submitGuess} />
        </div>
        <div className="guess-counter">
          <GuessCounter 
            totalGuesses={guessCount} 
            invalidGuesses={invalidGuessCount} 
          />
        </div>
        {isShowingSolution ? (
          <button 
            className="solution-button"
            onClick={hideSolution}
          >
            Hide Solution
          </button>
        ) : (
          <button 
            className="solution-button"
            onClick={findSolution}
            disabled={loading || !leftNodes[0]?.entity.id || !rightNodes[0]?.entity.id}
          >
            {loading ? 'Loading...' : 'Show Solution'}
          </button>
        )}
      </div>
      <Chain 
        leftNodes={leftNodes} 
        rightNodes={rightNodes} 
        centerNode={centerNode} 
        setLeftNodes={setLeftNodes} 
        setRightNodes={setRightNodes} 
        setCenterNode={setCenterNode} 
      />
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
}
