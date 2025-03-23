import { Request, Response } from 'express';
import { Movie, Actor } from './types';


export interface SearchMoviesRequest extends Request {
  query: {
    searchQuery: string;
  };
}

export interface SearchMoviesResponse extends Response {
  json: (body: { status: string; movies?: Movie[] }) => this;
} 


export interface SearchActorsRequest extends Request {
  query: {
    searchQuery: string;
  };
}

export interface SearchActorsResponse extends Response {
  json: (body: { status: string; actors?: Actor[] }) => this;
}  