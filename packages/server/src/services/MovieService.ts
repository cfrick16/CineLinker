import { Movie } from '@cinelinker/shared';
import { tmdbWrapper } from './TmdbWrapper';
export class MovieService {

  async getMovieById(id: string): Promise<Movie | undefined> {
    const movieDetails = await tmdbWrapper.fetchMovieDetails(parseInt(id));

    return {
      id: movieDetails.id.toString(),
      title: movieDetails.title,
      year: parseInt(movieDetails.release_date.substring(0,4)),
      actorIds: movieDetails.credits.cast.map((cast) => cast.id.toString()),
      imageUrl: await tmdbWrapper.getImageUrl(movieDetails.images.backdrops),
    }
  }

  async getPopularMovies(numResults: number): Promise<{id: number, name: string}[]> {
    return (await tmdbWrapper.fetchPopularMovies(numResults))
      .map(movie => ({id: movie.id, name: movie.title}));
  }
}

// Export a singleton instance
export const movieService = new MovieService();
