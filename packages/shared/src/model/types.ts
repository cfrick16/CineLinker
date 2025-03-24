// Branded type for ISO date strings
export type ISOString = string & { __brand: 'ISOString' };

export interface Movie {
  id: string;
  title: string;
  year: number;
  actorIds: string[];
  imageUrl?: string;
}

export interface Actor {
  id: string;
  name: string;
  movieIds: string[];
  imageUrl?: string;
}

export interface SearchResult {
  imageUrl?: string;
  text: string;
  id: string;
  entityType: EntityType;
}

export enum EntityType {
  Movie = 'movie',
  Actor = 'actor'
}

