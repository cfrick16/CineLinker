#!/bin/bash

# Exit on error
set -e

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Deploy to AWS Lambda using Serverless Framework
echo "Deploying to AWS Lambda..."
cd packages/server
pnpm serverless deploy --stage ${STAGE:-"dev"}

echo "Deployment complete!" 
