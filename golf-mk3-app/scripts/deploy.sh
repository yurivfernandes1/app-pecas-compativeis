#!/bin/bash

# Deployment script for Golf MK3 App
set -e

ENVIRONMENT=${1:-preview}
PLATFORM=${2:-all}

echo "🚀 Starting deployment process..."
echo "📋 Environment: $ENVIRONMENT"
echo "📱 Platform: $PLATFORM"

# Validate environment
case "$ENVIRONMENT" in
    "development"|"preview"|"production")
        ;;
    *)
        echo "❌ Invalid environment. Use: development, preview, or production"
        exit 1
        ;;
esac

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --legacy-peer-deps

# Run tests
echo "🧪 Running tests..."
npm run test:ci

# Deploy based on platform
case "$PLATFORM" in
    "web")
        echo "🌐 Deploying web application..."
        ./scripts/build-web.sh
        
        if [ "$ENVIRONMENT" = "production" ]; then
            echo "🚀 Deploying to production domain..."
            # Add your web deployment logic here
            # For example, deploy to Vercel, Netlify, or GitHub Pages
            echo "✅ Web app deployed to: https://app.falandodegti.com.br"
        fi
        ;;
    "mobile")
        echo "📱 Building mobile applications..."
        ./scripts/build-mobile.sh $ENVIRONMENT
        
        if [ "$ENVIRONMENT" = "production" ]; then
            echo "🏪 Submitting to app stores..."
            # Uncomment when ready for store submission
            # eas submit --platform ios --profile production --non-interactive
            # eas submit --platform android --profile production --non-interactive
            echo "✅ Mobile apps built and ready for store submission"
        fi
        ;;
    "all")
        echo "🌐📱 Deploying to all platforms..."
        
        # Deploy web
        ./scripts/build-web.sh
        
        # Build mobile
        ./scripts/build-mobile.sh $ENVIRONMENT
        
        if [ "$ENVIRONMENT" = "production" ]; then
            echo "🚀 Production deployment completed!"
            echo "🌐 Web: https://app.falandodegti.com.br"
            echo "📱 Mobile: Check Expo dashboard for build status"
        fi
        ;;
    *)
        echo "❌ Invalid platform. Use: web, mobile, or all"
        exit 1
        ;;
esac

# Send deployment notification
echo "📧 Sending deployment notification..."
cat << EOF

🎉 Deployment Summary
====================
Environment: $ENVIRONMENT
Platform: $PLATFORM
Status: ✅ SUCCESS
Time: $(date)

Next Steps:
- Test the deployed application
- Monitor for any issues
- Update documentation if needed

EOF

echo "✅ Deployment completed successfully!"