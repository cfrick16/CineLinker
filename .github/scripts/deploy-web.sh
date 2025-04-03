#!/bin/bash
set -e

# AWS Deployment Script for CineLinker Web Frontend
# This script deploys the web frontend to AWS Amplify
# It assumes AWS credentials are set as environment variables

# Log function for better visibility
log() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Check required environment variables
required_vars=(
  "AWS_ACCESS_KEY_ID"
  "AWS_SECRET_ACCESS_KEY"
  "AWS_REGION"
  "AMPLIFY_APP_ID"
  "AMPLIFY_BRANCH"
)

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    log "Error: Required environment variable $var is not set"
    exit 1
  fi
done

# Set deployment environment
ENVIRONMENT=${ENVIRONMENT:-"development"}
log "Deploying web frontend to $ENVIRONMENT environment on AWS Amplify"

# Build directory
BUILD_DIR=${BUILD_DIR:-"packages/web/dist"}
if [ ! -d "$BUILD_DIR" ]; then
  log "Error: Build directory $BUILD_DIR does not exist"
  exit 1
fi

# Configure AWS CLI
log "Configuring AWS CLI"
aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
aws configure set default.region $AWS_REGION

# Create a ZIP file of the build directory
ZIP_FILE="build.zip"
log "Creating ZIP file of the build directory"
cd $BUILD_DIR
zip -r ../../$ZIP_FILE .
cd ../../

# Start a deployment job on Amplify
log "Starting deployment job on Amplify for app ID: $AMPLIFY_APP_ID, branch: $AMPLIFY_BRANCH"
JOB_ID=$(aws amplify create-deployment --app-id $AMPLIFY_APP_ID --branch-name $AMPLIFY_BRANCH --output json --zip-file fileb://$ZIP_FILE | jq -r '.jobId')

if [ -z "$JOB_ID" ]; then
  log "Error: Failed to create deployment job"
  exit 1
fi

log "Created deployment job with ID: $JOB_ID"

# Start the deployment
log "Starting the deployment"
aws amplify start-deployment --app-id $AMPLIFY_APP_ID --branch-name $AMPLIFY_BRANCH --job-id $JOB_ID

# Wait for the deployment to complete
log "Waiting for deployment to complete..."
aws amplify wait job-complete --app-id $AMPLIFY_APP_ID --branch-name $AMPLIFY_BRANCH --job-id $JOB_ID

# Get the deployment status
DEPLOYMENT_STATUS=$(aws amplify get-job --app-id $AMPLIFY_APP_ID --branch-name $AMPLIFY_BRANCH --job-id $JOB_ID --output json | jq -r '.job.summary.status')

if [ "$DEPLOYMENT_STATUS" == "SUCCEED" ]; then
  log "Deployment completed successfully"
  
  # Get the Amplify app URL
  APP_URL=$(aws amplify get-app --app-id $AMPLIFY_APP_ID --output json | jq -r '.app.defaultDomain')
  BRANCH_URL="https://${AMPLIFY_BRANCH}.${APP_URL}"
  
  log "Web frontend deployed successfully to: $BRANCH_URL"
else
  log "Deployment failed with status: $DEPLOYMENT_STATUS"
  exit 1
fi

# Clean up
log "Cleaning up temporary files"
rm $ZIP_FILE
