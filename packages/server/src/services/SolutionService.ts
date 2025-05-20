import { DynamoDB } from 'aws-sdk';
import { EntityType, TmdbEntity } from '@cinelinker/shared';
import { movieService } from './MovieService';
import { actorsService } from './ActorsService';
const dynamoDB = new DynamoDB.DocumentClient({
  region: 'us-west-2'
});

const TABLE_NAME = 'CinelinkerSolutions';

interface Solution {
    startAndEndId: string;
    solution: string[];
}

export class SolutionService {
    
    async getSolutionAsEntityList(solutionId: string): Promise<TmdbEntity[]> {
        const solution = await this.getSolution(solutionId);
        if(solution == null) return [];


        return await Promise.all(solution.solution.map(async (id) => {
            const isMovie = id.startsWith('m');
            const tmdbId = id.substring(1);
            const entity = isMovie ? 
                await movieService.getMovieById(tmdbId) : 
                await actorsService.getActorById(tmdbId);
            
            if(entity == null) {
                throw new Error(`Entity not found for id: ${id}`);
            }

            return {
                entity,
                type: isMovie ? EntityType.Movie : EntityType.Actor
            };
        }));
    }

    async getSolution(solutionId: string): Promise<Solution | undefined> {
        try {
            const params = {
                TableName: TABLE_NAME,
                Key: {
                    startAndEndId: solutionId
                }
            };

            const result = await dynamoDB.get(params).promise();
            
            if (!result.Item) {
                console.log(`No solution found for ID: ${solutionId}`);
                return undefined;
            }

            return result.Item as Solution;
        } catch (error) {
            console.error('Error fetching solution:', error);
            throw error;
        }
    }
}

// Export a singleton instance
export const solutionService = new SolutionService();
