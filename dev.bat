@echo off
echo Starting SyntaxArena Development Environment...
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: npm is not installed or not in PATH.
    pause
    exit /b 1
)

REM Run the npm command using npm.cmd to bypass PowerShell execution policy
echo Running: npm.cmd run dev
npm.cmd run dev
