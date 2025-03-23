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