#!/bin/bash

# ==============================================================================
# SyntaxArena GCP Deployment Script (Cloud Run)
# ==============================================================================

# 1. Configuration - UPDATE THESE VALUES
PROJECT_ID="gen-lang-client-0771422120" # e.g., "my-syntax-arena-123"
REGION="us-central1"
BACKEND_SERVICE="syntaxarena-backend"
FRONTEND_SERVICE="syntaxarena-frontend"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "Error: gcloud CLI is not installed. Please install it first."
    exit 1
fi

# Check if user is authenticated
AUTH_USER=$(gcloud auth list --filter=status:ACTIVE --format="value(account)")
if [ -z "$AUTH_USER" ]; then
    echo "❌ Error: You are not logged in to gcloud."
    echo "👉 Please run: gcloud auth login"
    exit 1
fi

# Check for required API environment variables
MISSING_KEYS=()
[ -z "$NVIDIA_API_KEY" ] && MISSING_KEYS+=("NVIDIA_API_KEY")
[ -z "$NVIDIA_RESUME_PARSER_KEY" ] && MISSING_KEYS+=("NVIDIA_RESUME_PARSER_KEY")
[ -z "$GEMINI_API_KEY" ] && MISSING_KEYS+=("GEMINI_API_KEY")
[ -z "$OPENAI_API_KEY" ] && MISSING_KEYS+=("OPENAI_API_KEY")

# Firebase Frontend Keys (Required for build)
[ -z "$VITE_FIREBASE_API_KEY" ] && MISSING_KEYS+=("VITE_FIREBASE_API_KEY")
[ -z "$VITE_FIREBASE_AUTH_DOMAIN" ] && MISSING_KEYS+=("VITE_FIREBASE_AUTH_DOMAIN")
[ -z "$VITE_FIREBASE_PROJECT_ID" ] && MISSING_KEYS+=("VITE_FIREBASE_PROJECT_ID")
[ -z "$VITE_FIREBASE_APP_ID" ] && MISSING_KEYS+=("VITE_FIREBASE_APP_ID")

if [ ${#MISSING_KEYS[@]} -ne 0 ]; then
    echo "⚠️ Warning: The following environment variables are not set: ${MISSING_KEYS[*]}"
    read -p "Do you want to continue deployment without them? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "🚀 Starting deployment to GCP Project: $PROJECT_ID ($AUTH_USER)..."

# 2. Build and push Backend
echo "📦 Building and pushing Backend..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/$BACKEND_SERVICE backend/

# 3. Deploy Backend
echo "☁️ Deploying Backend to Cloud Run..."
gcloud run deploy $BACKEND_SERVICE \
  --image gcr.io/$PROJECT_ID/$BACKEND_SERVICE \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars "NVIDIA_API_KEY=$NVIDIA_API_KEY,NVIDIA_RESUME_PARSER_KEY=$NVIDIA_RESUME_PARSER_KEY,GEMINI_API_KEY=$GEMINI_API_KEY,OPENAI_API_KEY=$OPENAI_API_KEY" \
  --port 8080

# Get backend URL
BACKEND_URL=$(gcloud run services describe $BACKEND_SERVICE --platform managed --region $REGION --format 'value(status.url)')
echo "✅ Backend deployed at: $BACKEND_URL"

# 4. Prepare Frontend with Backend URL
# If you have constants that need the backend URL, you would update them here.
# For now, we assume nginx.conf handles the proxying based on relative paths (/api).

# 5. Build and push Frontend
echo "📦 Building and pushing Frontend..."
# Use a temporary Dockerfile because gcloud builds submit expects 'Dockerfile' by default
cp Dockerfile.frontend Dockerfile
gcloud builds submit --tag gcr.io/$PROJECT_ID/$FRONTEND_SERVICE .
rm Dockerfile

# 6. Deploy Frontend
echo "☁️ Deploying Frontend to Cloud Run..."
gcloud run deploy $FRONTEND_SERVICE \
  --image gcr.io/$PROJECT_ID/$FRONTEND_SERVICE \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars BACKEND_URL=$BACKEND_URL \
  --port 80

FRONTEND_URL=$(gcloud run services describe $FRONTEND_SERVICE --platform managed --region $REGION --format 'value(status.url)')
echo "🎉 Deployment Complete!"
echo "🔗 Frontend URL: $FRONTEND_URL"
echo "🔗 Backend URL: $BACKEND_URL"
