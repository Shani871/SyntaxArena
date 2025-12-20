@echo off
SET PROJECT_ID=936430520001
SET REGION=europe-west1

echo === Step 1: Deploying SyntaxArena Backend ===
cd backend
call gcloud builds submit --tag gcr.io/%PROJECT_ID%/syntax-backend
call gcloud run deploy syntax-backend --image gcr.io/%PROJECT_ID%/syntax-backend --platform managed --allow-unauthenticated --region %REGION%

REM Get the backend URL
for /f "tokens=*" %%a in ('gcloud run services describe syntax-backend --platform managed --region %REGION% --format="value(status.url)"') do set BACKEND_URL=%%a
echo Backend URL is: %BACKEND_URL%

echo === Step 2: Deploying SyntaxArena Frontend ===
cd ..
call gcloud builds submit --tag gcr.io/%PROJECT_ID%/syntax-frontend --build-arg VITE_API_BASE_URL=%BACKEND_URL%
call gcloud run deploy syntax-frontend --image gcr.io/%PROJECT_ID%/syntax-frontend --platform managed --allow-unauthenticated --region %REGION%

echo === Deployment Complete ===
pause
