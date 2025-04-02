import { EntityType } from '@cinelinker/shared';
import { actorsService } from './ActorsService';
import { movieService } from './MovieService';

interface ChainNode {
  id: string;
  type: EntityType;
  name: string;
  parent?: ChainNode;
}

interface SolverResult {
  path: ChainNode[];
  pathLength: number;
}

export class ChallengeSolverService {
  /**
   * Finds a path between two actors
   * @param startActorId The ID of the starting actor
   * @param endActorId The ID of the ending actor
   * @param maxDepth Maximum search depth (to prevent infinite loops)
   * @returns A solution path if found, or null if no path exists
   */
  async findPath(startActorId: string, endActorId: string, maxDepth: number = 6): Promise<SolverResult | null> {
    const startActor = await actorsService.getActorById(startActorId);
    const endActor = await actorsService.getActorById(endActorId);
    
    if (!startActor || !endActor) {
      console.error('Start or end actor not found');
      return null;
    }
    
    // Use breadth-first search to find the shortest path
    return this.breadthFirstSearch(
      {
        id: startActorId,
        type: EntityType.Actor,
        name: startActor.name
      },
      endActorId,
      maxDepth
    );
  }
  
  /**
   * Finds all possible paths between two actors up to a certain depth
   * @param startActorId The ID of the starting actor
   * @param endActorId The ID of the ending actor
   * @param maxDepth Maximum search depth
   * @param maxPaths Maximum number of paths to return
   * @returns An array of solution paths
   */
  async findAllPaths(
    startActorId: string, 
    endActorId: string, 
    maxDepth: number = 4,
    maxPaths: number = 10
  ): Promise<SolverResult[]> {
    const startActor = await actorsService.getActorById(startActorId);
    const endActor = await actorsService.getActorById(endActorId);
    
    if (!startActor || !endActor) {
      console.error('Start or end actor not found');
      return [];
    }
    
    const paths: SolverResult[] = [];
    const visited = new Set<string>();
    
    const startNode: ChainNode = {
      id: startActorId,
      type: EntityType.Actor,
      name: startActor.name
    };
    
    // Use depth-first search to find all paths
    await this.depthFirstSearch(
      startNode,
      endActorId,
      visited,
      [],
      paths,
      maxDepth,
      maxPaths
    );
    
    // Sort paths by length (shortest first)
    return paths.sort((a, b) => a.pathLength - b.pathLength);
  }
  
  /**
   * Provides a hint for the current challenge
   * @param startActorId The ID of the starting actor
   * @param endActorId The ID of the ending actor
   * @param currentPath The current path the user has built
   * @returns A hint node that could help complete the path
   */
  async getHint(
    startActorId: string,
    endActorId: string,
    currentPath: {id: string, type: EntityType}[]
  ): Promise<ChainNode | null> {
    // Find a solution path
    const solution = await this.findPath(startActorId, endActorId);
    
    if (!solution) {
      return null;
    }
    
    // If the user hasn't started yet, suggest the first step
    if (currentPath.length === 0 || (currentPath.length === 1 && currentPath[0].id === startActorId)) {
      return solution.path[1]; // The first step after the start actor
    }
    
    // Find where the user is in their path
    const lastNode = currentPath[currentPath.length - 1];
    
    // Look for this node in the solution path
    const nodeIndex = solution.path.findIndex(node => 
      node.id === lastNode.id && node.type === lastNode.type
    );
    
    if (nodeIndex === -1) {
      // User is off the solution path, suggest getting back on track
      // by providing the first node of the solution
      return solution.path[1];
    }
    
    // User is on the solution path, suggest the next node
    if (nodeIndex < solution.path.length - 1) {
      return solution.path[nodeIndex + 1];
    }
    
    return null;
  }
  
  /**
   * Breadth-first search to find the shortest path between actors
   * @param start The starting node
   * @param endActorId The ID of the ending actor
   * @param maxDepth Maximum search depth
   * @returns A solution path if found, or null if no path exists
   */
  private async breadthFirstSearch(
    start: ChainNode,
    endActorId: string,
    maxDepth: number
  ): Promise<SolverResult | null> {
    const queue: ChainNode[] = [start];
    const visited = new Set<string>();
    visited.add(`${start.type}:${start.id}`);
    
    let depth = 0;
    
    while (queue.length > 0 && depth < maxDepth) {
      const levelSize = queue.length;
      
      for (let i = 0; i < levelSize; i++) {
        const current = queue.shift()!;
        
        // Check if we've reached the end actor
        if (current.type === EntityType.Actor && current.id === endActorId) {
          // Reconstruct the path
          const path: ChainNode[] = [];
          let node: ChainNode | undefined = current;
          
          while (node) {
            path.unshift(node);
            node = node.parent;
          }
          
          return {
            path,
            pathLength: path.length
          };
        }
        
        // Expand the current node
        const neighbors = await this.getNeighbors(current);
        
        for (const neighbor of neighbors) {
          const key = `${neighbor.type}:${neighbor.id}`;
          
          if (!visited.has(key)) {
            visited.add(key);
            neighbor.parent = current;
            queue.push(neighbor);
          }
        }
      }
      
      depth++;
    }
    
    return null; // No path found
  }
  
  /**
   * Depth-first search to find all paths between actors
   * @param current The current node
   * @param endActorId The ID of the ending actor
   * @param visited Set of visited nodes
   * @param currentPath The current path being explored
   * @param paths Array to store found paths
   * @param maxDepth Maximum search depth
   * @param maxPaths Maximum number of paths to find
   */
  private async depthFirstSearch(
    current: ChainNode,
    endActorId: string,
    visited: Set<string>,
    currentPath: ChainNode[],
    paths: SolverResult[],
    maxDepth: number,
    maxPaths: number
  ): Promise<void> {
    // Stop if we've found enough paths
    if (paths.length >= maxPaths) {
      return;
    }
    
    // Add current node to the path
    currentPath.push(current);
    visited.add(`${current.type}:${current.id}`);
    
    // Check if we've reached the end actor
    if (current.type === EntityType.Actor && current.id === endActorId) {
      paths.push({
        path: [...currentPath],
        pathLength: currentPath.length
      });
      
      // Remove current node from path and visited set before returning
      currentPath.pop();
      visited.delete(`${current.type}:${current.id}`);
      return;
    }
    
    // Stop if we've reached the maximum depth
    if (currentPath.length >= maxDepth) {
      // Remove current node from path and visited set before returning
      currentPath.pop();
      visited.delete(`${current.type}:${current.id}`);
      return;
    }
    
    // Expand the current node
    const neighbors = await this.getNeighbors(current);
    
    for (const neighbor of neighbors) {
      const key = `${neighbor.type}:${neighbor.id}`;
      
      if (!visited.has(key)) {
        await this.depthFirstSearch(
          neighbor,
          endActorId,
          visited,
          currentPath,
          paths,
          maxDepth,
          maxPaths
        );
      }
    }
    
    // Remove current node from path and visited set before returning
    currentPath.pop();
    visited.delete(`${current.type}:${current.id}`);
  }
  
  /**
   * Gets the neighbors of a node (actors connected to a movie, or movies connected to an actor)
   * @param node The node to get neighbors for
   * @returns An array of neighboring nodes
   */
  private async getNeighbors(node: ChainNode): Promise<ChainNode[]> {
    const neighbors: ChainNode[] = [];
    
    if (node.type === EntityType.Actor) {
      // Get movies this actor has been in
      const actor = await actorsService.getActorById(node.id);
      
      if (actor && actor.movieIds) {
        for (const movieId of actor.movieIds) {
          const movie = await movieService.getMovieById(movieId);
          
          if (movie) {
            neighbors.push({
              id: movieId,
              type: EntityType.Movie,
              name: movie.title
            });
          }
        }
      }
    } 
    else if (node.type === EntityType.Movie) {
      // Get actors in this movie
      const movie = await movieService.getMovieById(node.id);
      
      if (movie && movie.actorIds) {
        for (const actorId of movie.actorIds) {
          const actor = await actorsService.getActorById(actorId);
          
          if (actor) {
            neighbors.push({
              id: actorId,
              type: EntityType.Actor,
              name: actor.name
            });
          }
        }
      }
    }
    
    return neighbors;
  }
}

// Export a singleton instance
export const challengeSolverService = new ChallengeSolverService();
