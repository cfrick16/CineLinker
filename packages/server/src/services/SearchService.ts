import { EntityType, SearchResult } from '@cinelinker/shared';
import { movieService } from './MovieService';
import { actorsService } from './ActorsService';

export class SearchService {

  // Search movies by title
async searchMoviesAndActors(query: string): Promise<SearchResult[]> {
    const movieSearchResults: Promise<SearchResult[]> = movieService
        .searchMovies(query)
            .then((movies) => movies.map((movie): SearchResult => ({
                text: movie.title + " (" + movie.year + ")", 
                id: movie.id, 
                entityType: EntityType.Movie,
                imageUrl: movie.imageUrl
            })));

    const actorSearchResults: Promise<SearchResult[]> = actorsService
        .searchActors(query)
            .then((actors) => actors.map((actor) => ({
                text: actor.name, 
                id: actor.id, 
                entityType: EntityType.Actor,
                imageUrl: actor.imageUrl
            })));

    await delay(50);
    return await Promise.all([movieSearchResults, actorSearchResults])
        .then(([movieSearchResults, actorSearchResults]) => [...movieSearchResults, ...actorSearchResults]);
  }
}

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

// Export a singleton instance
export const searchService = new SearchService();
