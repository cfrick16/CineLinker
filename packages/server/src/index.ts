import express from 'express';
import cors from 'cors';
import { SearchMoviesAndActorsRequest, SearchMoviesAndActorsResponse, 
  GetMovieByIdRequest, GetMovieByIdResponse, 
  GetActorByIdRequest, GetActorByIdResponse,
  GetDailyChallengeRequest, GetDailyChallengeResponse,
  GetDailyChallengeResponseBody
} from '@cinelinker/shared'; 
import { actorsService } from './services/ActorsService';
import { searchService } from './services/SearchService';
import { movieService } from './services/MovieService';
import { dailyChallengeService } from './services/DailyChallengeService';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/searchMoviesAndActors', (req: SearchMoviesAndActorsRequest, res: SearchMoviesAndActorsResponse) => {
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

app.get('/api/getDailyChallenge', (req: GetDailyChallengeRequest, res: GetDailyChallengeResponse) => {
  dailyChallengeService.getDailyChallenge(req.query.date).then((challenge: GetDailyChallengeResponseBody) => {
    res.json(challenge);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 