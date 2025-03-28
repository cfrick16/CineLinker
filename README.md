# CineLinker

A modern web application for movie enthusiasts.

## Project Structure

This is a monorepo containing the following packages:

- `packages/web`: React frontend application
- `packages/server`: Backend server
- `packages/shared`: Shared types and utilities

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