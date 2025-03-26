import { GetDailyChallengeResponseBody, SearchResult } from '@cinelinker/shared';
import { SearchBar } from './SearchBar';
import { Chain } from './chain';
import { convertToChainNode, isEntityRelated, getEntity } from '../common/entityFunctions';
import { ChainNode } from './chain/ChainModel';
import { useEffect, useState } from 'react';
import { GuessCounter } from './guessCount';
import './ChainBuilder.css';

export function ChainBuilder() {
  const [failedResult, setFailedResult] = useState<SearchResult | null>(null);
  const [guessCount, setGuessCount] = useState(0);
  const [invalidGuessCount, setInvalidGuessCount] = useState(0);

  const [leftNodes, setLeftNodes] = useState<ChainNode[]>([]);  
  const [rightNodes, setRightNodes] = useState<ChainNode[]>([]);
  const [centerNode, setCenterNode] = useState<ChainNode | null>(null);

  const submitGuess = async (result: SearchResult) => {
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

  useEffect(() => {
    fetch(`/api/getDailyChallenge?date=${new Date().toISOString()}`)
      .then(response => response.json())
      .then((data: GetDailyChallengeResponseBody) => {
        const startNode = convertToChainNode(data.start, data.startType);
        const endNode = convertToChainNode(data.end, data.endType);
        // Set the initial nodes
        setLeftNodes([startNode]);
        setRightNodes([endNode]);
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
      </div>
      <Chain leftNodes={leftNodes} rightNodes={rightNodes} centerNode={centerNode} setLeftNodes={setLeftNodes} setRightNodes={setRightNodes} setCenterNode={setCenterNode} />
    </div>
  );
} 