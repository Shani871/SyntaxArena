# SyntaxArena 🚀

**SyntaxArena** is a premium, gamified coding and learning platform designed to help developers master technical concepts through real-time competition, AI-driven visualization, and interactive exercises.

![Project Preview](https://via.placeholder.com/800x400?text=SyntaxArena+Preview)

## 🌟 Key Features

### ⚔️ Battle Arena
Engage in real-time multi-player coding battles. Compete against others to solve algorithmic challenges faster and climb the global leaderboards.

### 🧠 AI Code Visualizer
Visualize code execution like never before. See line-by-line execution paths, variable state changes, and logic flow powered by advanced AI analysis.

### 📝 Aptitude Playground
AI-generated aptitude assessments tailored to specific computer science topics. Get instant feedback and detailed explanations for every answer.

### 📄 Resume Builder
Automatically generate professional, tech-focused resumes from your SyntaxArena profile data, projects, and achievements.

### 🗺️ AI Concept Simplifier & API Visualizer
- **Concept Simplifier**: Explains complex CS concepts in simple terms and multiple languages.
- **API Visualizer**: Generates visual flow diagrams for API routes and logic structures.

### 📊 Gamified Dashboard
Track your progress with XP, levels, ranks, and daily streaks. Manage your priority "protocols" (Todo list) and scheduled battles.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Vanilla CSS for custom components)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Editor**: Monaco Editor & React Simple Code Editor

### Backend
- **Framework**: Spring Boot 3.4.1
- **Language**: Java 17
- **Authentication**: Firebase Admin SDK
- **Real-time**: WebSockets (STOMP + SockJS)
- **AI Integration**: Google Gemini AI & NVIDIA AI APIs

### Infrastructure
- **Containerization**: Docker
- **Deployment**: Google Cloud Run
- **CI/CD**: Shell scripts for automated deployment

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Java 17 & Maven
- Firebase Project (for Auth and Admin SDK)
- Gemini API Key

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shani871/SyntaxArena.git
   cd SyntaxArena
   ```

2. **Frontend Setup**
   ```bash
   npm install
   # Create a .env file with VITE_FIREBASE_ keys
   npm run dev
   ```

3. **Backend Setup**
   ```bash
   cd backend
   # Configure application.properties with your Firebase and AI keys
   mvn spring-boot:run
   ```

## 🏗️ Project Structure

```text
├── backend/            # Spring Boot backend
│   └── src/            # Java source code & configurations
├── components/         # Reusable React components
├── views/              # Main application views (Auth, Dashboard, BattleArena, etc.)
├── services/           # API and AI service integrations
├── hooks/              # Custom React hooks
├── types.ts            # Global TypeScript definitions
└── constants.ts        # Mock data and global constants
```

## 📜 License
This project is licensed under the MIT License.

---
Built with ❤️ by the SyntaxArena Team.
