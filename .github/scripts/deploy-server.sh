#!/bin/bash

# Exit on error
set -e

# Configuration
AWS_REGION=${AWS_REGION:-"us-west-2"}
STAGE=${STAGE:-"dev"}

echo "🚀 Starting deployment..."

# Deploy to Lambda using Serverless Framework
echo "📦 Deploying to Lambda..."
cd packages/server
pnpm serverless deploy --stage ${STAGE}

echo "✅ Deployment completed successfully!"
