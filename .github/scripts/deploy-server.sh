#!/bin/bash

# Exit on error
set -e

# Configuration
AWS_REGION=${AWS_REGION:-"us-west-2"}
ECR_REPO_NAME=${ECR_REPOSITORY:-"cinelinker-server"}
IMAGE_TAG=${IMAGE_TAG:-"latest"}
ECS_CLUSTER=${ECS_CLUSTER:-"cinelinker-cluster"}
ECS_SERVICE=${ECS_SERVICE:-"cinelinker-service"}

# Get AWS account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REPO_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}"

echo "🚀 Starting deployment..."

# Authenticate Docker to ECR
echo "🔑 Logging into ECR..."
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

# Build the Docker image for linux/amd64 platform
echo "🏗️  Building Docker image..."
docker build --platform linux/amd64 -t ${ECR_REPO_NAME}:${IMAGE_TAG} -f packages/server/Dockerfile .

# Tag the image for ECR
echo "🏷️  Tagging image for ECR..."
docker tag ${ECR_REPO_NAME}:${IMAGE_TAG} ${ECR_REPO_URI}:${IMAGE_TAG}

# Push the image to ECR
echo "⬆️  Pushing image to ECR..."
docker push ${ECR_REPO_URI}:${IMAGE_TAG}

# Update ECS service to use the new image
echo "🔄 Updating ECS service..."
aws ecs update-service --cluster ${ECS_CLUSTER} --service ${ECS_SERVICE} --force-new-deployment

echo "✅ Deployment completed successfully!"
