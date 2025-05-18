import { EntityType, TmdbSearchResult, TmdbImageResponse, TMDB_IMAGE_BASE_URL } from '@cinelinker/shared';

export class TmdbWrapper {

    private readonly apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlM2VjZDU5Y2NmNTg0NTgzMjU5MGVlMGE0YjljYjNlMSIsIm5iZiI6MTc0Mjk2NjU3MC45Njk5OTk4LCJzdWIiOiI2N2UzOGYyYWQ0MDUyZjQ3OTNkYzk3N2YiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.MMqHfM65kIZkL7iF9olKL6C0fXvbPiYdtZLLUz51oUU';
    
    // Search movies and people by title
    async fetchSearchMulti(query: string, page: number): Promise<{results: TmdbSearchResult[]}> {
        const url = `https://api.themoviedb.org/3/search/multi?query=${query}&include_adult=false&language=en-US&page=${page}`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${this.apiKey}`
            }
        };

        const response = await fetch(url, options);
        return await response.json();
    }

    async fetchImages(tmdbId: number, entityType: EntityType): Promise<{profiles: TmdbImageResponse[], backdrops: TmdbImageResponse[]}> {
        const entityString = entityType === EntityType.Movie ? 'movie' : 'person';

        const url = `https://api.themoviedb.org/3/${entityString}/${tmdbId}/images`;
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${this.apiKey}`
          }
        };

        const response = await fetch(url, options);
        return await response.json();

    }

    async getFirstImage(tmdbId: number, entityType: EntityType): Promise<string | undefined> {
        const imageResponse = await tmdbWrapper.fetchImages(tmdbId, entityType);
        let imageSuffixList: TmdbImageResponse[] = []
        if(entityType === EntityType.Movie) {
            imageSuffixList = imageResponse.backdrops
        } else if(entityType === EntityType.Actor) {
            imageSuffixList = imageResponse.profiles;
        }
        return await this.getImageUrl(imageSuffixList);
    }

    async getImageUrl(imageResponses: TmdbImageResponse[]): Promise<string| undefined> {
        if(imageResponses == null || imageResponses.length === 0) {
            return undefined;
        }
        return `${TMDB_IMAGE_BASE_URL}${imageResponses[0].file_path}`;
    }

    async fetchMovieDetails(
        tmdbId: number
    ): Promise<{images: {backdrops: TmdbImageResponse[]}, credits:{cast:{id: number}[]}, id: number, title: string, release_date: string}> {

        const url = `https://api.themoviedb.org/3/movie/${tmdbId}?append_to_response=credits,images`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${this.apiKey}`
            }
        };

        const response = await fetch(url, options);
        return await response.json();
    }

    async fetchPersonDetails(
        tmdbId: number
    ): Promise<{images: {profiles: TmdbImageResponse[]},movie_credits:{cast:{id: number}[]}, id: number, name: string, release_date: string}> {

        const url = `https://api.themoviedb.org/3/person/${tmdbId}?append_to_response=movie_credits,images`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${this.apiKey}`
            }
        };

        const response = await fetch(url, options);
        return await response.json();
    }

    async fetchPopularPersons(numResults: number, currPage: number = 1): Promise<{id: number, name: string}[]> {
        const url = `https://api.themoviedb.org/3/person/popular?language=en-US&page=${currPage}`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${this.apiKey}`
            }
        };

        const actors: {results: {id: number, name: string}[]} = await (await fetch(url, options)).json();
        const numResponses = actors.results.length;
        if(numResponses < numResults) {
            const nextPages = await this.fetchPopularPersons(numResults - numResponses, currPage + 1);
            return actors.results.concat(nextPages);
        }
        return actors.results;
    }

    async fetchPopularMovies(numResults: number, currPage: number = 1): Promise<{id: number, title: string}[]> {
        const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${currPage}
        // &sort_by=revenue.desc&with_original_language=en`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${this.apiKey}`
            }
        };

        const movies: {results: {id: number, title: string}[]} = await (await fetch(url, options)).json();
        const numResponses = movies.results.length;
        if(numResponses < numResults) {
            const nextPages = await this.fetchPopularMovies(numResults - numResponses, currPage + 1);
            return movies.results.concat(nextPages);
        }
        return movies.results;
    }

}


// Export a singleton instance
export const tmdbWrapper = new TmdbWrapper();
