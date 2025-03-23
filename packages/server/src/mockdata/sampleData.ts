import { Movie, Actor } from '@cinelinker/shared';   

// Sample Actors
export const sampleActors: Actor[] = [
  {
    id: "a1",
    name: "Morgan Freeman",
    movieIds: ["m1", "m4"] 
  },
  {
    id: "a2",
    name: "Christian Bale",
    movieIds: ["m2", "m4"]
  },
  {
    id: "a3",
    name: "Scarlett Johansson",
    movieIds: ["m3"]
  }
];

// Sample Movies
export const sampleMovies: Movie[] = [
  {
    id: "m1",
    title: "The Shawshank Redemption",
    year: 1994,
    actorIds: ["a1"] // Morgan Freeman
  },
  {
    id: "m2",
    title: "The Prestige",
    year: 2010,
    actorIds: ["a2", "a3"] // Scarlett Johansson and Christian Bale
  },
  {
    id: "m3",
    title: "Lost in Translation",
    year: 2003,
    actorIds: ["a3"] // Scarlett Johansson
  },
  {
    id: "m4",
    title: "The Dark Knight",
    year: 2008,
    actorIds: ["a1", "a2"] // Morgan Freeman & Christian Bale
  }
];