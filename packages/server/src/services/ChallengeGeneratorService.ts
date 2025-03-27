import { Actor, EntityType, GetDailyChallengeResponseBody, ISOString, Movie } from '@cinelinker/shared';
import { tmdbWrapper } from './TmdbWrapper';
import { actorsService } from './ActorsService';
import { movieService } from './MovieService';

interface ChallengeRating {
  difficulty: number;  // 1-10 scale (1 = easy, 10 = hard)
  popularity: number;  // 1-10 scale (1 = obscure, 10 = very popular)
  possiblePaths: number; // Estimated number of possible paths
}

export class ChallengeGeneratorService {
  // Popular actor IDs from TMDB
  private popularActorIds = [
    "192",    // Morgan Freeman
    "1245",   // Scarlett Johansson
    "1136406", // Tom Holland
    "3223",   // Robert Downey Jr.
    "287",    // Brad Pitt
    "6193",   // Leonardo DiCaprio
    "1813",   // Anne Hathaway
    "8691",   // Meryl Streep
    "2888",   // Will Smith
    "3894",   // Christian Bale
    "1892",   // Matt Damon
    "1283",   // Helena Bonham Carter
    "3896",   // Jennifer Lawrence
    "1333",   // Emma Watson
    "1245",   // Scarlett Johansson
  ];

  // Popular movie IDs from TMDB
  private popularMovieIds = [
    "299536", // Avengers: Infinity War
    "299534", // Avengers: Endgame
    "157336", // Interstellar
    "27205",  // Inception
    "155",    // The Dark Knight
    "120",    // The Lord of the Rings: The Fellowship of the Ring
    "121",    // The Lord of the Rings: The Two Towers
    "122",    // The Lord of the Rings: The Return of the King
    "11",     // Star Wars: Episode IV - A New Hope
    "1891",   // The Empire Strikes Back
    "1892",   // Return of the Jedi
    "1893",   // Star Wars: Episode I - The Phantom Menace
    "1894",   // Star Wars: Episode II - Attack of the Clones
    "1895",   // Star Wars: Episode III - Revenge of the Sith
    "140607", // Star Wars: The Force Awakens
  ];

  /**
   * Generates a challenge with the specified difficulty level
   * @param difficultyLevel 1-10 scale (1 = easy, 10 = hard)
   * @returns A challenge with the specified difficulty
   */
  async generateChallenge(difficultyLevel: number = 5): Promise<GetDailyChallengeResponseBody> {
    // Adjust actor and movie selection based on difficulty
    let startActor: Actor;
    let endActor: Actor;
    
    if (difficultyLevel <= 3) {
      // Easy: Use very popular actors
      const startId = this.popularActorIds[Math.floor(Math.random() * 5)];
      let endId = this.popularActorIds[Math.floor(Math.random() * 5)];
      
      // Ensure start and end are different
      while (endId === startId) {
        endId = this.popularActorIds[Math.floor(Math.random() * 5)];
      }
      
      startActor = await actorsService.getActorById(startId) as Actor;
      endActor = await actorsService.getActorById(endId) as Actor;
    } 
    else if (difficultyLevel <= 7) {
      // Medium: Mix of popular and less popular actors
      const startId = this.popularActorIds[Math.floor(Math.random() * 10)];
      let endId = this.popularActorIds[Math.floor(Math.random() * 10) + 5]; // Use different range
      
      // Ensure start and end are different
      while (endId === startId) {
        endId = this.popularActorIds[Math.floor(Math.random() * 10) + 5];
      }
      
      startActor = await actorsService.getActorById(startId) as Actor;
      endActor = await actorsService.getActorById(endId) as Actor;
    }
    else {
      // Hard: Use less popular actors or actors from different genres/eras
      const startId = this.popularActorIds[Math.floor(Math.random() * 5)];
      let endId = this.popularActorIds[Math.floor(Math.random() * 5) + 10]; // Use different range
      
      // Ensure start and end are different
      while (endId === startId) {
        endId = this.popularActorIds[Math.floor(Math.random() * 5) + 10];
      }
      
      startActor = await actorsService.getActorById(startId) as Actor;
      endActor = await actorsService.getActorById(endId) as Actor;
    }

    // Verify that a path exists between the actors
    const pathExists = await this.verifyPathExists(startActor, endActor);
    
    if (!pathExists) {
      // If no path exists, recursively try again with a different pair
      return this.generateChallenge(difficultyLevel);
    }

    // Calculate challenge rating
    const rating = await this.rateChallengeQuality(startActor, endActor);
    console.log(`Generated challenge with difficulty: ${rating.difficulty}, popularity: ${rating.popularity}, possible paths: ${rating.possiblePaths}`);

    return {
      status: 'success',
      start: startActor,
      startType: EntityType.Actor,
      end: endActor,
      endType: EntityType.Actor,
      date: new Date().toISOString().split('T')[0] as ISOString
    };
  }

  /**
   * Generates a challenge with a specific number of possible paths
   * @param minPaths Minimum number of possible paths
   * @param maxPaths Maximum number of possible paths
   * @returns A challenge with the specified number of possible paths
   */
  async generateChallengeByPathCount(minPaths: number = 2, maxPaths: number = 5): Promise<GetDailyChallengeResponseBody> {
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      // Select random actors
      const startId = this.popularActorIds[Math.floor(Math.random() * this.popularActorIds.length)];
      let endId = this.popularActorIds[Math.floor(Math.random() * this.popularActorIds.length)];
      
      // Ensure start and end are different
      while (endId === startId) {
        endId = this.popularActorIds[Math.floor(Math.random() * this.popularActorIds.length)];
      }
      
      const startActor = await actorsService.getActorById(startId) as Actor;
      const endActor = await actorsService.getActorById(endId) as Actor;
      
      // Calculate challenge rating
      const rating = await this.rateChallengeQuality(startActor, endActor);
      
      // Check if the number of possible paths is within the desired range
      if (rating.possiblePaths >= minPaths && rating.possiblePaths <= maxPaths) {
        return {
          status: 'success',
          start: startActor,
          startType: EntityType.Actor,
          end: endActor,
          endType: EntityType.Actor,
          date: new Date().toISOString().split('T')[0] as ISOString
        };
      }
      
      attempts++;
    }
    
    // If we couldn't find a challenge with the exact path count, fall back to a regular challenge
    return this.generateChallenge(5);
  }

  /**
   * Generates a challenge based on popularity of actors/movies
   * @param popularityLevel 1-10 scale (1 = obscure, 10 = very popular)
   * @returns A challenge with the specified popularity level
   */
  async generateChallengeByPopularity(popularityLevel: number = 8): Promise<GetDailyChallengeResponseBody> {
    // Adjust actor selection based on popularity level
    let actorPool: string[];
    
    if (popularityLevel >= 8) {
      // Very popular actors
      actorPool = this.popularActorIds.slice(0, 5);
    } 
    else if (popularityLevel >= 5) {
      // Moderately popular actors
      actorPool = this.popularActorIds.slice(5, 10);
    }
    else {
      // Less popular actors
      actorPool = this.popularActorIds.slice(10);
    }
    
    // Select random actors from the pool
    const startId = actorPool[Math.floor(Math.random() * actorPool.length)];
    let endId = actorPool[Math.floor(Math.random() * actorPool.length)];
    
    // Ensure start and end are different
    while (endId === startId) {
      endId = actorPool[Math.floor(Math.random() * actorPool.length)];
    }
    
    const startActor = await actorsService.getActorById(startId) as Actor;
    const endActor = await actorsService.getActorById(endId) as Actor;
    
    // Verify that a path exists between the actors
    const pathExists = await this.verifyPathExists(startActor, endActor);
    
    if (!pathExists) {
      // If no path exists, recursively try again with a different pair
      return this.generateChallengeByPopularity(popularityLevel);
    }
    
    return {
      status: 'success',
      start: startActor,
      startType: EntityType.Actor,
      end: endActor,
      endType: EntityType.Actor,
      date: new Date().toISOString().split('T')[0] as ISOString
    };
  }

  /**
   * Rates the quality of a challenge based on various factors
   * @param startActor The starting actor
   * @param endActor The ending actor
   * @returns A rating object with difficulty, popularity, and possible paths
   */
  private async rateChallengeQuality(startActor: Actor, endActor: Actor): Promise<ChallengeRating> {
    // Estimate the number of possible paths
    const possiblePaths = await this.estimatePossiblePaths(startActor, endActor);
    
    // Calculate popularity based on the number of movies the actors have been in
    const startPopularity = startActor.movieIds.length;
    const endPopularity = endActor.movieIds.length;
    const avgPopularity = (startPopularity + endPopularity) / 2;
    
    // Normalize popularity to a 1-10 scale
    // Assuming an actor with 50+ movies is very popular (10), and an actor with 5 or fewer is obscure (1)
    const normalizedPopularity = Math.min(10, Math.max(1, Math.round(avgPopularity / 5)));
    
    // Calculate difficulty based on the number of possible paths and popularity
    // Fewer paths and less popular actors make for a more difficult challenge
    const difficultyFromPaths = Math.max(1, 11 - Math.min(10, possiblePaths));
    const difficultyFromPopularity = Math.max(1, 11 - normalizedPopularity);
    
    // Combine the two factors, with paths having a higher weight
    const difficulty = Math.round((difficultyFromPaths * 0.7) + (difficultyFromPopularity * 0.3));
    
    return {
      difficulty,
      popularity: normalizedPopularity,
      possiblePaths
    };
  }

  /**
   * Estimates the number of possible paths between two actors
   * This is a simplified estimation that doesn't actually find all paths
   * @param startActor The starting actor
   * @param endActor The ending actor
   * @returns An estimate of the number of possible paths
   */
  private async estimatePossiblePaths(startActor: Actor, endActor: Actor): Promise<number> {
    // Check for direct connection (both actors in the same movie)
    const directConnection = startActor.movieIds.some(movieId => 
      endActor.movieIds.includes(movieId)
    );
    
    if (directConnection) {
      // Count how many movies they share
      const sharedMovies = startActor.movieIds.filter(movieId => 
        endActor.movieIds.includes(movieId)
      );
      return sharedMovies.length;
    }
    
    // For indirect connections, use a simplified estimation
    // Count the number of movies for each actor and multiply
    // This is a very rough estimate that assumes each movie of the start actor
    // could potentially connect to each movie of the end actor through one intermediate actor
    const startMovieCount = Math.min(5, startActor.movieIds.length);
    const endMovieCount = Math.min(5, endActor.movieIds.length);
    
    // Divide by a factor to account for the fact that not all combinations will work
    return Math.max(1, Math.round((startMovieCount * endMovieCount) / 10));
  }

  /**
   * Verifies that a path exists between two actors
   * @param startActor The starting actor
   * @param endActor The ending actor
   * @returns True if a path exists, false otherwise
   */
  private async verifyPathExists(startActor: Actor, endActor: Actor): Promise<boolean> {
    // Check for direct connection (both actors in the same movie)
    const directConnection = startActor.movieIds.some(movieId => 
      endActor.movieIds.includes(movieId)
    );
    
    if (directConnection) {
      return true;
    }
    
    // For simplicity, we'll assume that if both actors have been in at least 3 movies,
    // there's likely a path between them (this is a simplification)
    if (startActor.movieIds.length >= 3 && endActor.movieIds.length >= 3) {
      return true;
    }
    
    // For a more accurate check, we would need to implement a breadth-first search
    // to find a path between the actors, but that's beyond the scope of this example
    
    return false;
  }
}

// Export a singleton instance
export const challengeGeneratorService = new ChallengeGeneratorService();
