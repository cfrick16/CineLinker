import { ISOString, GetDailyChallengeResponseBody, EntityType, Actor, Movie } from '@cinelinker/shared';
import { startNodes } from '../mockdata/sampleData';
import { actorsService } from './ActorsService';
import { movieService } from './MovieService';

const getCurrentDate = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const day = String(date.getDate()).padStart(2, '0'); // Ensure two-digit day
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure two-digit month

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

    const startEntity = await this.getActorOrMovieByStartNode(nodes![0])
    const endEntity = await this.getActorOrMovieByStartNode(nodes![1])

    return {
      status: 'success',
      start: startEntity!,
      startType: nodes![0].entityType,
      end: endEntity!,
      endType: nodes![1].entityType,
      date: dateString as ISOString
    }
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