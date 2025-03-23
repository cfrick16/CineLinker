import { Movie } from '@cinelinker/shared';
import { sampleMovies } from '../mockdata/sampleData';

export class MovieService {

  // Search movies by title
async searchMovies(query: string): Promise<Movie[]> {
    const lowercaseQuery = query.toLowerCase();
    return sampleMovies.filter(movie => 
      movie.title.toLowerCase().includes(lowercaseQuery)
    );
  }
}

// Export a singleton instance
export const movieService = new MovieService();
