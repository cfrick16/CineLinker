#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting build..."

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build the app
echo "🏗️  Building the app..."
# Ensure we're using production environment
NODE_ENV=production pnpm build

echo "✅ Build completed successfully!"
