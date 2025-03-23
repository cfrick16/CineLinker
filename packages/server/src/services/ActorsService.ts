import { Actor } from '@cinelinker/shared';
import { sampleActors } from '../mockdata/sampleData';

export class ActorsService {

  // Search Actors by title
  async searchActors(query: string): Promise<Actor[]> {
    const lowercaseQuery = query.toLowerCase();
    return sampleActors.filter(actor => 
      actor.name.toLowerCase().includes(lowercaseQuery)
    );
  }
}

// Export a singleton instance
export const actorsService = new ActorsService();
