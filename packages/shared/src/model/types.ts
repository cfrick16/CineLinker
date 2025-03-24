export interface Movie {
  id: string;
  title: string;
  year: number;
  actorIds: string[];
  imageUrl?: string | undefined;
}

export interface Actor {
  id: string;
  name: string;
  movieIds: string[];
  imageUrl?: string | undefined;
} 
export interface SearchResult {
  imageUrl?: string | undefined;
  text: string;
  id: string;
  entityType: EntityType;
}

export enum EntityType {
  Movie = 'movie',
  Actor = 'actor'
}