# Setup and Troubleshooting Guide

## Prerequisites
- Node.js (Latest LTS recommended)
- Maven (for backend)

## Common Issues & Fixes

### 1. PowerShell Execution Policy Error
**Error:** `npm : File ... cannot be loaded because running scripts is disabled on this system.`
**Fix:** 
- Run the included `dev.bat` file instead of `npm run dev`.
- OR, run this command in PowerShell as Administrator:
  ```powershell
  Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

### 2. Maven Not Found
**Error:** `'mvn' is not recognized...`
**Fix:**
- Ensure Maven is installed and added to your system PATH.
- Verify by running `mvn -v` in a new terminal.

**Tip:** You can try installing Maven via winget (Run in Admin Terminal):
```powershell
winget install -e --id Maven.Maven
```

## Running the Project

### Frontend
```bash
dev.bat
# OR if policy is fixed:
npm run dev
```

### Backend
Navigate to `backend` directory:
```bash
cd backend
.\mvnw spring-boot:run
```
