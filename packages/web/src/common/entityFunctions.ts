import { ChainNode } from "@/components/chain/ChainModel";
import { EntityType, Movie, SearchResult } from "@cinelinker/shared";
import { Actor } from "@cinelinker/shared";
import { apiFetch } from "../utils/api";

export const convertToChainNode = (entity: Actor | Movie, entityType: EntityType): ChainNode => {
    return {
      entity,
      type: entityType,
    }
  }

export const getEntity = async (result: SearchResult): Promise<Actor | Movie> => {
    if(result.entityType === EntityType.Actor) {
      const data = await apiFetch(`/api/getActorById?id=${result.id}`);
      return data.actor;
    } else {
      const data = await apiFetch(`/api/getMovieById?id=${result.id}`);
      return data.movie;
    }
  }

export const isEntityRelated = (result: SearchResult, chainNode: ChainNode) => {
    if(chainNode == null) {
      console.error('Chain node is null');
      return false;
    }

    if(chainNode.type === EntityType.Actor) {
      return (chainNode.entity as Actor)
        .movieIds
        .some(movieId => movieId === result.id);
    } else {
      return (chainNode.entity as Movie)
        .actorIds
        .some(actorId => actorId === result.id);
    }
  };