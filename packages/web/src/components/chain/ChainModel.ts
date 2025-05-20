import { TmdbEntity } from '@cinelinker/shared';

export interface ChainActions {
  removeNode: (chainNode: ChainNode) => void;
}

export type ChainNode = TmdbEntity;

export interface ChainModel {
  leftNodes: ChainNode[];
  rightNodes: ChainNode[];
  centerNode: ChainNode | null;
}
