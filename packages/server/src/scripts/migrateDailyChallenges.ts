import { DynamoDB } from 'aws-sdk';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parse/sync';

interface AWSError {
  code?: string;
  message?: string;
}

interface Challenge {
  nodePosition: "left" | "right";
  date: string;
  tmdbId: string;
  entityType: "actor" | "movie";
  name: string;
}

const dynamoDB = new DynamoDB.DocumentClient({
  region: 'us-west-2'
});

const dynamoDBService = new DynamoDB({
  region: 'us-west-2'
});

const TABLE_NAME = 'CinelinkerStartingNodes';

async function readChallengesFromCSV(): Promise<Challenge[]> {
  const csvPath = path.join(__dirname, 'challenges.csv');
  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  
  const records: Challenge[] = csv.parse(fileContent, {
    columns: true,
    skip_empty_lines: true
  });

  console.log(records);
  return records;
}

async function migrateDailyChallenges() {
  try {
    // Create the table if it doesn't exist
    try {
      await dynamoDBService.createTable({
        TableName: TABLE_NAME,
        KeySchema: [
          { AttributeName: 'dateAndNodeNumber', KeyType: 'HASH' },
          { AttributeName: 'date', KeyType: 'RANGE' }
        ],
        AttributeDefinitions: [
          { AttributeName: 'dateAndNodeNumber', AttributeType: 'S' },
          { AttributeName: 'date', AttributeType: 'S' }
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        }
      }).promise();
      console.log('Created table:', TABLE_NAME);
    } catch (error: unknown) {
      const awsError = error as AWSError;
      if (awsError.code === 'ResourceInUseException') {
        console.log('Table already exists:', TABLE_NAME);
      } else {
        throw error;
      }
    }

    // Read challenges from CSV
    const challenges = await readChallengesFromCSV();
    console.log(`Found ${challenges.length} challenges in CSV`);
    console.log(`Found ${challenges[0].date} challenges in CSV`);


    // Migrate each challenge
    for (const challenge of challenges) {
      const params = {
        RequestItems: {
          [TABLE_NAME]: [
            {
              PutRequest: {
                Item:{
                  ...challenge,
                  dateAndNodeNumber: challenge.date + '-' + challenge.nodePosition
                }
              }
            },
          ]
        }
      };

      await dynamoDB.batchWrite(params).promise();
      console.log(`Migrated challenge for date ${challenge.date}`);
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

migrateDailyChallenges(); 