import { Actor, EntityType, Movie } from '@cinelinker/shared';

export interface ChainActions {
}

export interface ChainNode {
  entity: Actor | Movie;
  entityType: EntityType;
}

export interface ChainModel {
  leftNodes: ChainNode[];
  rightNodes: ChainNode[];
  centerNode: ChainNode | null;
}
