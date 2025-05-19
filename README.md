# CineLinker

A modern web application for movie enthusiasts.

[![Development Deployment](https://github.com/username/cinelinker/actions/workflows/dev-deploy.yml/badge.svg)](https://github.com/username/cinelinker/actions/workflows/dev-deploy.yml)
[![Production Deployment](https://github.com/username/cinelinker/actions/workflows/prod-deploy.yml/badge.svg)](https://github.com/username/cinelinker/actions/workflows/prod-deploy.yml)
[![Pull Request Checks](https://github.com/username/cinelinker/actions/workflows/pr-checks.yml/badge.svg)](https://github.com/username/cinelinker/actions/workflows/pr-checks.yml)

## Project Structure

This is a monorepo containing the following packages:

- `packages/web`: React frontend application
- `packages/server`: Backend server
- `packages/shared`: Shared types and utilities

## How to load new challenges to DDB 
Note: Feel free to skip any of these steps if you want to input entries manually. Or edit the DDB manually
1. cd into packages/server
2. Run ```pnpm populate-movies-and-actors```. This will generate 400 movies and actors in resources/movies.csv and resources/actors.csv
3. Comb through movies and actors and remove unwanted entries
4. Set the desired start date and max number of days in populateChallenges.ts
5. Run ```pnpm populate-challenges```. This will create as many possible challenges up to MAX_NUMBER_OF_DAYS without reusing an actor or movie in resources/challenges.csv.
6. Run ```pnpm migrate-daily-challenges``` This will load all of those challenges into DDB and the website will use that on the current date. 

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start development servers:
   ```bash
   pnpm dev
   ```

3. Build for production:
   ```bash
   pnpm build
   ```


Deploy Frontend -> 
cd packages/web && ./build.sh
cd dist && zip -r ../web-app.zip . && cd ..
Add web-app.zip to amplify


Deploy Backend -> 
cd packages/server && chmod +x deploy.sh
./deploy.sh


## Available Scripts

- `pnpm dev`: Start all packages in development mode
- `pnpm build`: Build all packages
- `pnpm start`: Start all packages in production mode
- `pnpm lint`: Run linting across all packages
- `pnpm test`: Run tests across all packages

## CI/CD

This project uses GitHub Actions for continuous integration and deployment:

- **Development Deployment**: Automatically deploys to the development environment when code is pushed to the `develop` branch or any `feature/*` branch.
- **Production Deployment**: Automatically deploys to the production environment when code is pushed to the `main`/`master` branch or when a new version tag is created.
- **Pull Request Checks**: Runs linting, building, and testing on all pull requests to ensure code quality before merging.

For more details on the CI/CD setup, see the [GitHub Actions documentation](.github/README.md).
