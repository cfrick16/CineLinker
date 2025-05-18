import * as fs from 'fs';
import * as path from 'path';
import { Challenge, EntityType } from '@cinelinker/shared';
import { parse } from 'csv-parse/sync';

const MOVIE_PERCENTAGE = 0.3;
interface CsvModel {
  id: string;
  name: string;
}


function readCsvFile<T>(filePath: string): T[] {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return parse(fileContent, {
    columns: true,
    skip_empty_lines: true
  });
}

// Read actors and movies from CSV files
const actorsPath = path.join(__dirname, 'resources/actors.csv');
const moviesPath = path.join(__dirname, 'resources/movies.csv');

const sampleActors: CsvModel[] = readCsvFile<CsvModel>(actorsPath);
const sampleMovies: CsvModel[] = readCsvFile<CsvModel>(moviesPath);

function getRandomItem<T>(array: T[]): T {
  const randomIndex = Math.floor(Math.random() * array.length);
  const item = array[randomIndex];
  array.splice(randomIndex, 1); // Remove the item at randomIndex
  return item;
}

function generateRandomChallenge(date: string): Challenge[] {
  const startType: EntityType = Math.random() > MOVIE_PERCENTAGE ? EntityType.Actor : EntityType.Movie;
  const endType: EntityType = Math.random() > MOVIE_PERCENTAGE ? EntityType.Actor : EntityType.Movie;
  
  const startData = startType === EntityType.Actor ? getRandomItem(sampleActors) : getRandomItem(sampleMovies);
  const endData = endType === EntityType.Actor ? getRandomItem(sampleActors) : getRandomItem(sampleMovies);


  // If the start and end are the same, generate a new challenge
  if(startData.id === endData.id && startType === endType) {
    return generateRandomChallenge(date);
  }

  return [{
    date,
    dateAndNodeNumber: `${date}-left`,
    entityType: startType,
    name: startData.name,
    tmdbId: startData.id,
    nodePosition: "left"
  }, {
    date,
    dateAndNodeNumber: `${date}-right`,
    entityType: endType,
    name: endData.name,
    tmdbId: endData.id,
    nodePosition: "right"
  }];
}

function generateChallenges(startDate: Date, numberOfDays: number): Challenge[] {
  const challenges: Challenge[] = [];
  const currentDate = new Date(startDate);

  for (let i = 0; i < numberOfDays; i++) {
    if(sampleActors.length < 2 || sampleMovies.length < 2) {
      console.log('Not enough data to generate challenges');
      break;
    }
    const dateStr = currentDate.toISOString().split('T')[0];
    challenges.push(...generateRandomChallenge(dateStr));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return challenges;
}

function writeChallengesToCSV(challenges: Challenge[]) {
  const csvPath = path.join(__dirname, 'resources/challenges.csv');
  
  // Create CSV header
  const header = 'date,name,tmdbId,entityType,nodePosition\n';
  
  // Create CSV rows
  const rows = challenges.map(challenge => 
    `${challenge.date},${challenge.name},${challenge.tmdbId},${challenge.entityType},${challenge.nodePosition}`
  ).join('\n');

  // Write to file
  fs.writeFileSync(csvPath, header + rows);
  console.log(`Generated ${challenges.length} challenges in ${csvPath}`);
}

// Generate challenges for the next 30 days starting from today
const startDate = new Date();
const numberOfDays = 400;
const challenges = generateChallenges(startDate, numberOfDays);
writeChallengesToCSV(challenges); 