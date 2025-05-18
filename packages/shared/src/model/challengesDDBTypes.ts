import { EntityType } from "./types";

export interface Challenge {
    dateAndNodeNumber: string;
    nodePosition: "left" | "right";
    date: string;
    tmdbId: string;
    entityType: EntityType;
    name: string;
  }