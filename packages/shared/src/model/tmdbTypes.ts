// GetDailyChallenge

export interface TmdbSearchResult {
    id: number;
    popularity: number;
    media_type: 'movie' | 'person';
}
export interface TmdbPersonSearchResult extends TmdbSearchResult {
    name: string;
  }

export interface TmdbMovieSearchResult extends TmdbSearchResult {
    title: string;
    release_date: string;
}

export interface TmdbImageResponse {
    file_path: string;
}

export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
