import { Actor } from '@cinelinker/shared';
import { tmdbWrapper } from './TmdbWrapper';

export class ActorsService {
  async getActorById(id: string): Promise<Actor | undefined> {
    const personDetails = await tmdbWrapper.fetchPersonDetails(parseInt(id));

    return {
      id: personDetails.id.toString(),
      name: personDetails.name,
      movieIds: personDetails.movie_credits.cast.map((movie: {id: number}) => movie.id.toString()),
      imageUrl: await tmdbWrapper.getImageUrl(personDetails.images.profiles),
    }
  }
}

// Export a singleton instance
export const actorsService = new ActorsService();
