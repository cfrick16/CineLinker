import express from 'express';
import cors from 'cors';
import { SearchMoviesAndActorsRequest, SearchMoviesAndActorsResponse, 
  GetMovieByIdRequest, GetMovieByIdResponse, 
  GetActorByIdRequest, GetActorByIdResponse,
  GetDailyChallengeRequest, GetDailyChallengeResponse,
  GetDailyChallengeResponseBody,
} from '@cinelinker/shared'; 
import { actorsService } from './services/ActorsService';
import { searchService } from './services/SearchService';
import { movieService } from './services/MovieService';
import { dailyChallengeService } from './services/DailyChallengeService';
import { challengeGeneratorService } from './services/ChallengeGeneratorService';
import { challengeSolverService } from './services/ChallengeSolverService';
import { Handler } from 'aws-lambda';
import serverless from 'serverless-http';

const app = express();
const port = process.env.PORT || 4000;

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://www.cinelinker.com',
        'https://cinelinker.com',
        'https://api.cinelinker.com',
        'https://www.dev.cinelinker.com',
        'https://dev.cinelinker.com',
      ]
    : '*', // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/searchMoviesAndActors', (req: SearchMoviesAndActorsRequest, res: SearchMoviesAndActorsResponse) => {
  searchService.searchMoviesAndActors(req.query.searchQuery, req.query.page ? parseInt(req.query.page) : 1).then((results) => {
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

// Challenge Generator endpoints
app.get('/api/generateChallenge', (req, res) => {
  const difficultyLevel = req.query.difficulty ? parseInt(req.query.difficulty as string) : 5;
  challengeGeneratorService.generateChallenge(difficultyLevel).then((challenge) => {
    res.json(challenge);
  });
});

app.get('/api/generateChallengeByPathCount', (req, res) => {
  const minPaths = req.query.minPaths ? parseInt(req.query.minPaths as string) : 2;
  const maxPaths = req.query.maxPaths ? parseInt(req.query.maxPaths as string) : 5;
  challengeGeneratorService.generateChallengeByPathCount(minPaths, maxPaths).then((challenge) => {
    res.json(challenge);
  });
});

app.get('/api/generateChallengeByPopularity', (req, res) => {
  const popularityLevel = req.query.popularity ? parseInt(req.query.popularity as string) : 8;
  challengeGeneratorService.generateChallengeByPopularity(popularityLevel).then((challenge) => {
    res.json(challenge);
  });
});

// Challenge Solver endpoints
app.get('/api/findPath', async (req, res) => {
  const startActorId = req.query.startActorId as string;
  const endActorId = req.query.endActorId as string;
  const maxDepth = req.query.maxDepth ? parseInt(req.query.maxDepth as string) : 6;
  
  if (!startActorId || !endActorId) {
    return res.status(400).json({ status: 'error', message: 'Missing required parameters' });
  }
  
  try {
    const path = await challengeSolverService.findPath(startActorId, endActorId, maxDepth);
    res.json({ status: 'success', path });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to find path' });
  }
});

app.get('/api/findAllPaths', async (req, res) => {
  const startActorId = req.query.startActorId as string;
  const endActorId = req.query.endActorId as string;
  const maxDepth = req.query.maxDepth ? parseInt(req.query.maxDepth as string) : 4;
  const maxPaths = req.query.maxPaths ? parseInt(req.query.maxPaths as string) : 10;
  
  if (!startActorId || !endActorId) {
    return res.status(400).json({ status: 'error', message: 'Missing required parameters' });
  }
  
  try {
    const paths = await challengeSolverService.findAllPaths(startActorId, endActorId, maxDepth, maxPaths);
    res.json({ status: 'success', paths });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to find paths' });
  }
});

app.post('/api/getHint', async (req, res) => {
  const { startActorId, endActorId, currentPath } = req.body;
  
  if (!startActorId || !endActorId || !currentPath) {
    return res.status(400).json({ status: 'error', message: 'Missing required parameters' });
  }
  
  try {
    const hint = await challengeSolverService.getHint(startActorId, endActorId, currentPath);
    res.json({ status: 'success', hint });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to get hint' });
  }
});

// Only start the server if not running in Lambda
if (process.env.AWS_LAMBDA_FUNCTION_NAME === undefined) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

// Create the handler
export const handler: Handler = serverless(app);
