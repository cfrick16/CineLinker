import { Request, Response } from 'express';
import { Movie, Actor, SearchResult } from './types';


export interface GetMovieByIdRequest extends Request {
  query: {
    id: string;
  };
}

export interface GetMovieByIdResponse extends Response {
  json: (body: { status: string; movie?: Movie }) => this;
}


export interface GetActorByIdRequest extends Request {
  query: {
    id: string;
  };
}

export interface GetActorByIdResponse extends Response {
  json: (body: { status: string; actor?: Actor }) => this;
}

export interface SearchRequest extends Request {
  query: {
    searchQuery: string;
  };
}

export interface SearchResponse extends Response {
  json: (body: { status: string; results?: SearchResult[] }) => this;
} 
