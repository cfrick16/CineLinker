import { ISOString, GetDailyChallengeResponseBody, EntityType, Actor, Movie } from '@cinelinker/shared';
import { startNodes } from '../mockdata/sampleData';
import { actorsService } from './ActorsService';
import { movieService } from './MovieService';

const getCurrentDate = (): string => {
  // Create date in CST
  const date = new Date().toLocaleString("en-US", {
    timeZone: "America/Chicago"
  });
  
  // Convert string back to Date object
  const cstDate = new Date(date);
  
  const year = cstDate.getFullYear();
  const day = String(cstDate.getDate()).padStart(2, '0');
  const month = String(cstDate.getMonth() + 1).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export class DailyChallengeService {
  private useHardcodedExample = true;

  private async getActorOrMovieByStartNode(node: {id: string, entityType: EntityType}): Promise<Actor | Movie | undefined> {
    if(node.entityType === EntityType.Actor) {
      return await actorsService.getActorById(node.id)
    }
    return await movieService.getMovieById(node.id);
  }

  async getDailyChallengeHardcoded(): Promise<GetDailyChallengeResponseBody> {
    const dateString = getCurrentDate();
    const nodes = startNodes.get(dateString);

    if (!nodes || nodes.length !== 2) {
      throw new Error(`No challenge found for date: ${dateString}`);
    }

    const startEntity = await this.getActorOrMovieByStartNode(nodes[0]);
    const endEntity = await this.getActorOrMovieByStartNode(nodes[1]);

    if (!startEntity || !endEntity) {
      throw new Error('Failed to fetch start or end entity');
    }

    return {
      status: 'success',
      start: startEntity,
      startType: nodes[0].entityType,
      end: endEntity,
      endType: nodes[1].entityType,
      date: dateString as ISOString
    };
  }

  // For now this will return a challenge for the current day randomly based on a hash of the date
  async getDailyChallenge(date?: string): Promise<GetDailyChallengeResponseBody> {
    if(this.useHardcodedExample) {
      return await this.getDailyChallengeHardcoded();
    }

    throw new Error('Not implemented ' + date);
  }
}

export const dailyChallengeService = new DailyChallengeService(); 