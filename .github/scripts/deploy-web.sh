#!/bin/bash
set -e

# ... (keep all the initial setup and ZIP creation the same until the deployment part)

# Start the deployment and get the job ID
log "Starting the deployment"
DEPLOYMENT_RESULT=$(aws amplify start-deployment \
  --app-id $AMPLIFY_APP_ID \
  --branch-name $AMPLIFY_BRANCH \
  --zip-file fileb://$ZIP_FILE \
  --output json)

JOB_ID=$(echo $DEPLOYMENT_RESULT | jq -r '.jobId')

if [ -z "$JOB_ID" ]; then
  log "Error: Failed to start deployment"
  exit 1
fi

log "Started deployment with job ID: $JOB_ID"

# Get the Amplify app URL
APP_URL=$(aws amplify get-app --app-id $AMPLIFY_APP_ID --output json | jq -r '.app.defaultDomain')
BRANCH_URL="https://${AMPLIFY_BRANCH}.${APP_URL}"

log "Deployment started. You can monitor the progress at: $BRANCH_URL"

# Clean up
log "Cleaning up temporary files"
rm $ZIP_FILE
