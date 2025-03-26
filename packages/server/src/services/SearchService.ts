import { EntityType, SearchResult, TmdbMovieSearchResult, TmdbPersonSearchResult, TmdbSearchResult } from '@cinelinker/shared';
import { tmdbWrapper } from './TmdbWrapper';

export class SearchService {

    // Search movies by title
    async searchMoviesAndActors(query: string): Promise<SearchResult[]> {
        const searchResults = await this.queryPeopleAndMovies(query);
        const searchResultsWithImages = await Promise.all(searchResults.map(async (result) => {
            const imageUrl = await tmdbWrapper.getFirstImage(parseInt(result.id), result.entityType);
            return { ...result, imageUrl };
        }));
        return searchResultsWithImages;
    }


    async queryPeopleAndMovies(query: string): Promise<SearchResult[]> {

        const data = await tmdbWrapper.fetchSearchMulti(query);

        const searchResults: SearchResult[] = data.results
            .map(this.convertToSearchResult)
            .filter((result: SearchResult | undefined) => result != null);

        return searchResults;

    }

    private convertToSearchResult(tmdbResponse: TmdbSearchResult): SearchResult | undefined {
        if(tmdbResponse.media_type === 'movie') {
            return {
                id: tmdbResponse.id.toString(),
                text: (tmdbResponse as TmdbMovieSearchResult).title 
                    + ' (' + (tmdbResponse as TmdbMovieSearchResult).release_date.substring(0,4) + ')',
                entityType: EntityType.Movie
              };
        } else if(tmdbResponse.media_type === 'person') {
            return {
                id: tmdbResponse.id.toString(),
                text: (tmdbResponse as TmdbPersonSearchResult).name,
                entityType: EntityType.Actor
              };        
        } else {
            return undefined;
        }

    }
}

// Export a singleton instance
export const searchService = new SearchService();
