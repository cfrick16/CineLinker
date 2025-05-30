import { ISOString, GetDailyChallengeResponseBody, EntityType, Actor, Movie } from '@cinelinker/shared';
import { actorsService } from './ActorsService';
import { movieService } from './MovieService';
import { DynamoDB } from 'aws-sdk';
import { Challenge } from '@cinelinker/shared';

const dynamoDB = new DynamoDB.DocumentClient({
  region: 'us-west-2'
});

const TABLE_NAME = 'CinelinkerStartingNodes';

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
  private async getActorOrMovieByStartNode(node: {tmdbId: string, entityType: EntityType}): Promise<Actor | Movie | undefined> {
    if(node.entityType === EntityType.Actor) {
      return await actorsService.getActorById(node.tmdbId)
    }
    return await movieService.getMovieById(node.tmdbId);
  }

  async getDailyChallenge(date?: string): Promise<GetDailyChallengeResponseBody> {
    const dateString = date || getCurrentDate();
    
    try {
      // Query for both start and end nodes
      const startNodeParams = {
        TableName: TABLE_NAME,
        Key: {
          dateAndNodeNumber: `${dateString}-left`,
          date: dateString
        }
      };

      const endNodeParams = {
        TableName: TABLE_NAME,
        Key: {
          dateAndNodeNumber: `${dateString}-right`,
          date: dateString
        }
      };

      const [startResult, endResult] = await Promise.all([
        dynamoDB.get(startNodeParams).promise(),
        dynamoDB.get(endNodeParams).promise()
      ]);
      
      // Debug log for DynamoDB results
      console.log('DynamoDB get results:', { startResult, endResult });
      
      if (!startResult.Item || !endResult.Item) {
        throw new Error(`No challenge found for date: ${dateString}`);
      }

      const startNode: Challenge = startResult.Item as Challenge;
      const endNode: Challenge = endResult.Item as Challenge;
      
      const startEntity = await this.getActorOrMovieByStartNode({
        tmdbId: startNode.tmdbId,
        entityType: startNode.entityType
      });
      const endEntity = await this.getActorOrMovieByStartNode({
        tmdbId: endNode.tmdbId,
        entityType: endNode.entityType
      });

      if (!startEntity || !endEntity) {
        throw new Error('Failed to fetch start or end entity');
      }

      return {
        status: 'success',
        start: startEntity,
        startType: startNode.entityType,
        end: endEntity,
        endType: endNode.entityType,
        date: dateString as ISOString
      };
    } catch (error) {
      console.error('Error fetching daily challenge:', error);
      throw error;
    }
  }
}

export const dailyChallengeService = new DailyChallengeService(); 