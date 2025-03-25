import { GetDailyChallengeResponseBody, SearchResult } from '@cinelinker/shared';
import { SearchBar } from './SearchBar';
import { Chain } from './chain';
import { convertToChainNode, isEntityRelated, getEntity } from '../common/entityFunctions';
import { ChainNode } from './chain/ChainModel';
import { useEffect, useState } from 'react';


export function ChainBuilder() {

  const [leftNodes, setLeftNodes] = useState<ChainNode[]>([]);  
  const [rightNodes, setRightNodes] = useState<ChainNode[]>([]);
  const [centerNode, setCenterNode] = useState<ChainNode | null>(null);

  const submitGuess = async (result: SearchResult) => {
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
      console.error('No connection found');
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


  }, [])

  return (
    <div className="chain-builder">
      <SearchBar onResultClick={submitGuess} />
      <Chain leftNodes={leftNodes} rightNodes={rightNodes} centerNode={centerNode} />
    </div>
  );
} 