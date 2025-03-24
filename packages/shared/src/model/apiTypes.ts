import { Request, Response } from 'express';
import { Movie, Actor, SearchResult } from './types';

// GetMovieById
export interface GetMovieByIdRequest extends Request {
  query: {
    id: string;
  };
}
export type GetMovieByIdResponseBody = { status: string; movie?: Movie }
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
  };
}
export type SearchMoviesAndActorsResponseBody = { status: string; results?: SearchResult[] }
export interface SearchMoviesAndActorsResponse extends Response {
  json: (body: SearchMoviesAndActorsResponseBody) => this;
} 
