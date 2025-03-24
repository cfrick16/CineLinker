import { useEffect, useState } from 'react';
import { ChainModel, ChainActions, ChainNode } from './ChainModel';
import { Actor, EntityType, GetDailyChallengeResponseBody, Movie, SearchResult } from '@cinelinker/shared';

export function useChainController(): [ChainModel, ChainActions] {
  const [leftNodes, setLeftNodes] = useState<ChainNode[]>([]);
  const [rightNodes, setRightNodes] = useState<ChainNode[]>([]);

  const convertToChainNode = (entity: Actor | Movie, entityType: EntityType): ChainNode => {
    return {
      entity,
      entityType: entityType,
      isEndNode: false
    }
  }

  const getEntity = async (result: SearchResult): Promise<Actor | Movie> => {
    if(result.entityType === EntityType.Actor) {
      return await fetch(`/api/getActorById?id=${result.id}`).then(response => response.json()).then(data => data.actor);
    } else {
      return await fetch(`/api/getMovieById?id=${result.id}`).then(response => response.json()).then(data => data.movie);
    }
  }

  const addNode = async (result: SearchResult) => {
    try {
      const entity = await getEntity(result);
      const node = convertToChainNode(entity, result.entityType);

      // Use function form of setState to ensure we have latest state
      if (rightNodes.length < leftNodes.length) {
        setRightNodes(current => [...current, node]);
      } else {
        setLeftNodes(current => [...current, node]);
      }
    } catch (error) {
      console.error('Failed to add node:', error);
    }
  };

  const fetchDailyChallenge = async () => {
    const response = await fetch(`/api/getDailyChallenge?date=${new Date().toISOString()}`);
    const data: GetDailyChallengeResponseBody = await response.json();
    setLeftNodes([convertToChainNode(data.start, data.startType)]);
    setRightNodes([convertToChainNode(data.end, data.endType)]);
  }

  useEffect(() => {
    fetchDailyChallenge()
  }, []);

  // Listen for search result selections
  useEffect(() => {
    const handleSearchResult = async (event: Event) => {
      const result = (event as CustomEvent<SearchResult>).detail;
      await addNode(result);
    };

    document.addEventListener('searchResultSelected', handleSearchResult);
    return () => {
      document.removeEventListener('searchResultSelected', handleSearchResult);
    };
  }, []);

  return [
    { leftNodes, rightNodes },
    { addNode }
  ];
}

// Example usage:
/*
const exampleChain: Chain = {
  nodes: [
    {
      id: 'a1',
      type: EntityType.Actor,
      name: 'Morgan Freeman',
      imageUrl: 'https://example.com/morgan.jpg'
    },
    {
      id: 'm1',
      type: EntityType.Movie,
      name: 'The Dark Knight',
      year: 2008,
      imageUrl: 'https://example.com/dark-knight.jpg'
    },
    {
      id: 'a2',
      type: EntityType.Actor,
      name: 'Christian Bale'
    }
  ],
  connections: [
    {
      fromId: 'a1',
      toId: 'm1',
      relationship: 'Acted in'
    },
    {
      fromId: 'm1',
      toId: 'a2',
      relationship: 'Featured'
    }
  ]
};

<ChainController 
  initialChain={exampleChain} 
  onNodeSelect={(nodeId) => console.log('Selected node:', nodeId)} 
/>
*/ 