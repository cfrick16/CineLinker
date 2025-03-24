import { Actor, EntityType, Movie, SearchResult } from '@cinelinker/shared';

export interface ChainNode {
  entity: Actor | Movie;
  entityType: EntityType;
  isEndNode: boolean;
}

export interface ChainModel {
  leftNodes: ChainNode[];
  rightNodes: ChainNode[];
}

export interface ChainActions {
  addNode: (result: SearchResult) => void;
}

