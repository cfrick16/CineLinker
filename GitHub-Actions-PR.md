# Pull Request: Add GitHub Actions CI/CD Integration

## Overview

This PR adds GitHub Actions workflows to automate the CI/CD process for the CineLinker project. It implements separate workflows for development and production deployments, as well as pull request validation.

## Problem

Previously, the project lacked automated CI/CD pipelines, requiring manual deployment to development and production environments. This was time-consuming, error-prone, and inconsistent.

## Solution

The solution implements three GitHub Actions workflows:
1. Development deployment workflow
2. Production deployment workflow
3. Pull request validation workflow

These workflows automate the build, test, and deployment processes, ensuring consistent and reliable deployments across environments.

## Changes

### 1. Added GitHub Actions Workflow Files

- Created `.github/workflows/dev-deploy.yml` for development deployments
  - Triggers on pushes to `develop` and `feature/*` branches
  - Builds and lints the code
  - Deploys to development environments

- Created `.github/workflows/prod-deploy.yml` for production deployments
  - Triggers on pushes to `main`/`master` branches and version tags
  - Builds, lints, and tests the code
  - Deploys to production environments
  - Creates GitHub releases for tagged versions

- Created `.github/workflows/pr-checks.yml` for pull request validation
  - Triggers on pull requests to `main`, `master`, and `develop` branches
  - Builds, lints, and tests the code
  - Performs additional checks (bundle size, security scanning)

### 2. Added Documentation

- Created `.github/README.md` with detailed documentation on the CI/CD setup
  - Workflow descriptions
  - Required secrets
  - Customization instructions

- Updated the main `README.md` to include CI/CD information
  - Added GitHub Actions workflow badges
  - Added a CI/CD section with a brief overview of the workflows

## Implementation Details

The workflows are designed to work with the project's monorepo structure using pnpm workspaces. They handle:

- Proper Node.js and pnpm setup
- Dependency installation
- Building all packages
- Linting and testing
- Environment-specific deployments
- Notifications on completion

## Required Setup

To fully utilize these workflows, the following GitHub repository secrets need to be configured:

### Development Environment
- `DEV_SERVER_DEPLOY_KEY`
- `DEV_SERVER_DEPLOY_URL`
- `DEV_WEB_DEPLOY_TOKEN`
- `DEV_WEB_DEPLOY_URL`

### Production Environment
- `PROD_SERVER_DEPLOY_KEY`
- `PROD_SERVER_DEPLOY_URL`
- `PROD_WEB_DEPLOY_TOKEN`
- `PROD_WEB_DEPLOY_URL`

## Future Improvements

Potential future improvements could include:
- Adding environment-specific configuration management
- Implementing canary deployments
- Adding performance testing
- Setting up automatic dependency updates
- Implementing deployment approval gates for production
