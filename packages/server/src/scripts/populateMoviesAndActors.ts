import * as fs from 'fs';
import * as path from 'path';
import { actorsService } from '../services/ActorsService';
import { movieService } from '../services/MovieService';

async function writeToCSV(data: {id: number, name: string}[], csvPathString: string) {
  try {
    // Get 20 popular actors from TMDB
    
    const csvPath = path.join(__dirname, csvPathString);
    
    // Create CSV header
    const header = 'id,name\n';
    
    // Create CSV rows
    const rows = data.map(entry => 
      `${entry.id},${entry.name}`
    ).join('\n');

    // Write to file
    fs.writeFileSync(csvPath, header + rows);
    console.log(`Generated ${data.length} entries in ${csvPath}`);
  } catch (error) {
    console.error('Error generating actors:', error);
  }
}

movieService.getPopularMovies(400).then(movies => {
  writeToCSV(movies, 'resources/movies.csv');
});

actorsService.getPopularActors(400).then(actors => {
  writeToCSV(actors, 'resources/actors.csv');
});
