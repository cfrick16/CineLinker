import { Movie } from '@cinelinker/shared';
import { sampleMovies } from '../mockdata/sampleData';

export class MovieService {

  async getMovieById(id: string): Promise<Movie | undefined> {
    return sampleMovies.find(movie => movie.id === id);
  }

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
