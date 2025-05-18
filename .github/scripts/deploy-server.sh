#!/bin/bash

# Exit on error
set -e

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Install dependencies
echo "Installing dependencies..."
pnpm install

# Build TypeScript code
echo "Building TypeScript code..."
pnpm build

# Deploy to AWS Lambda using Serverless Framework
echo "Deploying to AWS Lambda..."
npx serverless deploy --stage ${STAGE:-"dev"}

echo "Deployment complete!" 
