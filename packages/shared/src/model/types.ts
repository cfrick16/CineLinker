export interface Movie {
  id: string;
  title: string;
  year: number;
  actorIds: string[];
}

export interface Actor {
  id: string;
  name: string;
  movieIds: string[];
} 
export interface SearchResult {
  imageUrl: string | undefined | null;
  text: string;
  id: string;
  entityType: EntityType;
}

export enum EntityType {
  Movie = 'movie',
  Actor = 'actor'
}