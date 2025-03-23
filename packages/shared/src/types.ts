export interface Movie {
  title: string;
  year: number;
  actors: Actor[];
}

export interface Actor {
  name: string;
  movies: Movie[];
} 