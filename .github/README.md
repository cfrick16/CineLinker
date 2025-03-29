# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automating CI/CD processes for the CineLinker project.

## Available Workflows

### 1. Development Deployment (`dev-deploy.yml`)

Deploys the application to the development environment.

**Triggers:**
- Push to `develop` branch
- Push to any `feature/*` branch
- Manual trigger via GitHub UI (workflow_dispatch)

**What it does:**
- Builds and lints the code
- Deploys the server and web app to development environments
- Sends notifications on completion

### 2. Production Deployment (`prod-deploy.yml`)

Deploys the application to the production environment.

**Triggers:**
- Push to `main` or `master` branch
- Push of version tags (e.g., `v1.0.0`)
- Manual trigger via GitHub UI (workflow_dispatch)

**What it does:**
- Builds, lints, and tests the code
- Deploys the server and web app to production environments
- Creates a GitHub release when triggered by a tag
- Sends notifications on completion

### 3. Pull Request Checks (`pr-checks.yml`)

Validates pull requests before they are merged.

**Triggers:**
- Pull requests to `main`, `master`, or `develop` branches

**What it does:**
- Builds and lints the code
- Runs tests
- Performs additional checks (bundle size, security scanning, etc.)

## Required Secrets

The following secrets need to be configured in your GitHub repository settings:

### Development Environment
- `DEV_SERVER_DEPLOY_KEY`: Key for server deployment
- `DEV_SERVER_DEPLOY_URL`: URL for server deployment
- `DEV_WEB_DEPLOY_TOKEN`: Token for web app deployment
- `DEV_WEB_DEPLOY_URL`: URL for web app deployment

### Production Environment
- `PROD_SERVER_DEPLOY_KEY`: Key for server deployment
- `PROD_SERVER_DEPLOY_URL`: URL for server deployment
- `PROD_WEB_DEPLOY_TOKEN`: Token for web app deployment
- `PROD_WEB_DEPLOY_URL`: URL for web app deployment

## Customizing Deployments

To customize the deployment process, modify the deployment steps in the respective workflow files. The current implementation includes placeholder commands that should be replaced with actual deployment commands specific to your infrastructure.

## Manual Triggers

All workflows can be triggered manually from the GitHub Actions tab in your repository. This is useful for deploying specific branches or commits without pushing new code.
