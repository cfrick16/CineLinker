import { ISOString, GetDailyChallengeResponseBody, EntityType, Actor, Movie } from '@cinelinker/shared';
import { actorsService } from './ActorsService';
import { movieService } from './MovieService';
import { DynamoDB } from 'aws-sdk';

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
      const params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: 'date = :date',
        ExpressionAttributeValues: {
          ':date': dateString
        }
      };

      const result = await dynamoDB.query(params).promise();
      
      if (!result.Items || result.Items.length !== 2) {
        throw new Error(`No challenge found for date: ${dateString}`);
      }

      // Sort items by node number (1 = start, 2 = end)
      const sortedItems = result.Items.sort((a, b) => 
        parseInt(a.dateAndNodeNumber.split('-')[3]) - parseInt(b.dateAndNodeNumber.split('-')[3])
      );

      const startNode = sortedItems[0];
      const endNode = sortedItems[1];
      
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