import { DynamoDB } from 'aws-sdk';
import { startNodes } from '../mockdata/sampleData';

const dynamoDB = new DynamoDB.DocumentClient({
  region: 'us-west-2'
});

const dynamoDBService = new DynamoDB({
  region: 'us-west-2'
});

const TABLE_NAME = 'CinelinkerStartingNodes';

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
    } catch (error: any) {
      if (error.code === 'ResourceInUseException') {
        console.log('Table already exists:', TABLE_NAME);
      } else {
        throw error;
      }
    }

    // Migrate each challenge
    for (const [date, nodes] of startNodes.entries()) {
      if (nodes.length !== 2) {
        console.warn(`Skipping invalid challenge for date ${date}: expected 2 nodes, got ${nodes.length}`);
        continue;
      }

      // Create start node
      const startNode = {
        dateAndNodeNumber: `${date}-1`,
        date,
        tmdbId: nodes[0].id,
        entityType: nodes[0].entityType,
        name: nodes[0].title
      };

      // Create end node
      const endNode = {
        dateAndNodeNumber: `${date}-2`,
        date,
        tmdbId: nodes[1].id,
        entityType: nodes[1].entityType,
        name: nodes[1].title
      };

      // Use batchWrite to write both items atomically
      const params = {
        RequestItems: {
          [TABLE_NAME]: [
            {
              PutRequest: {
                Item: startNode
              }
            },
            {
              PutRequest: {
                Item: endNode
              }
            }
          ]
        }
      };

      await dynamoDB.batchWrite(params).promise();
      console.log(`Migrated challenge for date ${date}`);
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

migrateDailyChallenges(); 