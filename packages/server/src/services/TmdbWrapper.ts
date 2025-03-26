import { EntityType, TmdbSearchResult, TmdbImageResponse, TMDB_IMAGE_BASE_URL } from '@cinelinker/shared';

export class TmdbWrapper {

    private readonly apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlM2VjZDU5Y2NmNTg0NTgzMjU5MGVlMGE0YjljYjNlMSIsIm5iZiI6MTc0Mjk2NjU3MC45Njk5OTk4LCJzdWIiOiI2N2UzOGYyYWQ0MDUyZjQ3OTNkYzk3N2YiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.MMqHfM65kIZkL7iF9olKL6C0fXvbPiYdtZLLUz51oUU';
    
    // Search movies and people by title
    async fetchSearchMulti(query: string): Promise<{results: TmdbSearchResult[]}> {
        const url = `https://api.themoviedb.org/3/search/multi?query=${query}&include_adult=false&language=en-US&page=1`;
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
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlM2VjZDU5Y2NmNTg0NTgzMjU5MGVlMGE0YjljYjNlMSIsIm5iZiI6MTc0Mjk2NjU3MC45Njk5OTk4LCJzdWIiOiI2N2UzOGYyYWQ0MDUyZjQ3OTNkYzk3N2YiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.MMqHfM65kIZkL7iF9olKL6C0fXvbPiYdtZLLUz51oUU'
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
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlM2VjZDU5Y2NmNTg0NTgzMjU5MGVlMGE0YjljYjNlMSIsIm5iZiI6MTc0Mjk2NjU3MC45Njk5OTk4LCJzdWIiOiI2N2UzOGYyYWQ0MDUyZjQ3OTNkYzk3N2YiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.MMqHfM65kIZkL7iF9olKL6C0fXvbPiYdtZLLUz51oUU'
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
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlM2VjZDU5Y2NmNTg0NTgzMjU5MGVlMGE0YjljYjNlMSIsIm5iZiI6MTc0Mjk2NjU3MC45Njk5OTk4LCJzdWIiOiI2N2UzOGYyYWQ0MDUyZjQ3OTNkYzk3N2YiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.MMqHfM65kIZkL7iF9olKL6C0fXvbPiYdtZLLUz51oUU'
            }
        };

        const response = await fetch(url, options);
        return await response.json();
    }
}


// Export a singleton instance
export const tmdbWrapper = new TmdbWrapper();
