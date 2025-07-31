#!/bin/bash

# Build script for mobile apps (iOS and Android)
set -e

echo "📱 Starting mobile build process..."

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "📦 Installing EAS CLI..."
    npm install -g eas-cli
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --legacy-peer-deps

# Run tests
echo "🧪 Running tests..."
npm run test:ci

# Login to EAS (if not already logged in)
echo "🔐 Checking EAS authentication..."
if ! eas whoami &> /dev/null; then
    echo "Please login to EAS:"
    eas login
fi

# Build for different environments
case "${1:-preview}" in
    "development")
        echo "🔧 Building development builds..."
        eas build --platform all --profile development --non-interactive
        ;;
    "preview")
        echo "👀 Building preview builds..."
        eas build --platform all --profile preview --non-interactive
        ;;
    "production")
        echo "🚀 Building production builds..."
        eas build --platform all --profile production --non-interactive
        ;;
    *)
        echo "❌ Invalid build type. Use: development, preview, or production"
        exit 1
        ;;
esac

echo "✅ Mobile build completed successfully!"
echo "📱 Check your builds at: https://expo.dev/accounts/falandodegti/projects/golf-mk3-pecas-compativeis/builds"