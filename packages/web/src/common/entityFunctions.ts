import { ChainNode } from "@/components/chain/ChainModel";
import { EntityType, Movie, SearchResult } from "@cinelinker/shared";

import { Actor } from "@cinelinker/shared";

export const convertToChainNode = (entity: Actor | Movie, entityType: EntityType): ChainNode => {
    return {
      entity,
      entityType: entityType,
    }
  }

export const getEntity = async (result: SearchResult): Promise<Actor | Movie> => {
    if(result.entityType === EntityType.Actor) {
      return await fetch(`/api/getActorById?id=${result.id}`).then(response => response.json()).then(data => data.actor);
    } else {
      return await fetch(`/api/getMovieById?id=${result.id}`).then(response => response.json()).then(data => data.movie);
    }
  }

export const isEntityRelated = (result: SearchResult, chainNode: ChainNode) => {
    if(chainNode == null) {
      console.error('Chain node is null');
      return false;
    }

    if(chainNode.entityType === EntityType.Actor) {
      return (chainNode.entity as Actor)
        .movieIds
        .some(movieId => movieId === result.id);
    } else {
      return (chainNode.entity as Movie)
        .actorIds
        .some(actorId => actorId === result.id);
    }
  };