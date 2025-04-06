import { Request, Response } from 'express';
import { Movie, Actor, SearchResult, ISOString, EntityType } from './types';

export type Status = 'success' | 'error';

// GetMovieById
export interface GetMovieByIdRequest extends Request {
  query: {
    id: string;
  };
}
export type GetMovieByIdResponseBody = { status: Status; movie?: Movie }
export interface GetMovieByIdResponse extends Response {
  json: (body: GetMovieByIdResponseBody) => this;
}


// GetActorById
export interface GetActorByIdRequest extends Request {
  query: {
    id: string;
  };
}
export type GetActorByIdResponseBody = { status: string; actor?: Actor }
export interface GetActorByIdResponse extends Response {
  json: (body: GetActorByIdResponseBody) => this;
}


// SearchMoviesAndActors
export interface SearchMoviesAndActorsRequest extends Request {
  query: {
    searchQuery: string;
    page: string;
  };
}
export type SearchMoviesAndActorsResponseBody = { status: string; results?: SearchResult[] }
export interface SearchMoviesAndActorsResponse extends Response {
  json: (body: SearchMoviesAndActorsResponseBody) => this;
} 

// GetDailyChallenge
export interface GetDailyChallengeRequest extends Request {
  query: {
    date?: ISOString;
  };
}

export type GetDailyChallengeResponseBody = {
  status: Status;
  start: Actor | Movie;
  startType: EntityType;
  end: Actor | Movie;
  endType: EntityType;
  date: ISOString;
}

export interface GetDailyChallengeResponse extends Response {
  json: (body: GetDailyChallengeResponseBody) => this;
} 