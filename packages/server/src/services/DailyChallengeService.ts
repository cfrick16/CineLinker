import { ISOString, GetDailyChallengeResponseBody, EntityType } from '@cinelinker/shared';
import { sampleMovies, sampleActors } from '../mockdata/sampleData';

export class DailyChallengeService {
  private useHardcodedExample = true;

  getDailyChallengeHardcoded(): GetDailyChallengeResponseBody {
    return {
      status: 'success',
      start: sampleActors.find(actor => actor.name === 'Morgan Freeman')!!,
      startType: EntityType.Actor,
      end: sampleActors.find(actor => actor.name === "Scarlett Johansson")!!,
      endType: EntityType.Actor,
      date: '2025-03-25' as ISOString
    }
  }
  // For now this will return a challenge for the current day randomly based on a hash of the date
  getDailyChallenge(date?: string): GetDailyChallengeResponseBody {
    if(this.useHardcodedExample) {
      return this.getDailyChallengeHardcoded();
    }

    // Validate and parse date
    let challengeDate: Date;
    if (date) {
      challengeDate = new Date(date);
    } else {
      challengeDate = new Date();
    }
    
    challengeDate.setHours(0, 0, 0, 0);
    const dateString = challengeDate.toISOString().split('T')[0] as ISOString;

    // Use date to deterministically select start and end
    const dateHash = this.hashCode(dateString);
    const allEntities = [...sampleMovies, ...sampleActors];
    
    // Select start entity
    const startIndex = Math.abs(dateHash) % allEntities.length;
    const start = allEntities[startIndex];
    
    // Select end entity (ensure it's different from start)
    const endHash = this.hashCode(dateString + 'end');
    const remainingEntities = allEntities.filter(entity => entity.id !== start.id);
    const endIndex = Math.abs(endHash) % remainingEntities.length;
    const end = remainingEntities[endIndex];

    return {
      status: 'success',
      start,
      startType: 'title' in start ? EntityType.Movie : EntityType.Actor,
      end,
      endType: 'title' in end ? EntityType.Movie : EntityType.Actor,
      date: dateString
    };
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }
}

export const dailyChallengeService = new DailyChallengeService(); 