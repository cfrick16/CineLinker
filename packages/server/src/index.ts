import express from 'express';
import cors from 'cors';
import { SearchMoviesRequest, SearchMoviesResponse, SearchActorsRequest, 
  SearchActorsResponse,
} from '@cinelinker/shared'; 
import { movieService } from './services/MovieService';
import { actorsService } from './services/ActorsService';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/searchMovies', (req: SearchMoviesRequest, res: SearchMoviesResponse) => {
  movieService.searchMovies(req.query.searchQuery).then((movies) => {
      res.json({ status: 'success', movies: movies });
  });
});

app.get('/api/searchActors', (req: SearchActorsRequest, res: SearchActorsResponse) => {
  actorsService.searchActors(req.query.searchQuery).then((actors) => {
      res.json({ status: 'success', actors: actors });
  });
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 