import express from 'express';
import cors from 'cors';
import { SearchRequest, SearchResponse, GetMovieByIdRequest, GetMovieByIdResponse, GetActorByIdRequest, GetActorByIdResponse } from '@cinelinker/shared'; 
import { actorsService } from './services/ActorsService';
import { searchService } from './services/SearchService';
import { movieService } from './services/MovieService';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/searchMoviesAndActors', (req: SearchRequest, res: SearchResponse) => {
  searchService.searchMoviesAndActors(req.query.searchQuery).then((results) => {
      res.json({ status: 'success', results: results });
  });
});

app.get('/api/getMovieById', (req: GetMovieByIdRequest, res: GetMovieByIdResponse) => {
  movieService.getMovieById(req.query.id).then((movie) => {
      res.json({ status: 'success', movie: movie });
  });
});

app.get('/api/getActorById', (req: GetActorByIdRequest, res: GetActorByIdResponse) => {
  actorsService.getActorById(req.query.id).then((actor) => {
      res.json({ status: 'success', actor: actor });
  });
});




app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 