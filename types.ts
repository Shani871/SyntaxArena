
export interface User {
  id: string;
  username: string;
  logicRating: number;
  codingRating: number;
  streak: number;
  xp: number;
  conceptsLearned: string[];
  tutorialsCompleted: string[];
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  baseDescription: string;
  generatedStory?: string; // The AI variant
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  feedback?: 'like' | 'dislike';
}

export interface BattleState {
  isActive: boolean;
  timeLeft: number;
  myProgress: number; // 0-100
  opponentProgress: number; // 0-100
  opponentName: string;
}

export enum GameMode {
  AUTH = 'AUTH',
  ASSESSMENT = 'ASSESSMENT',
  BATTLE = 'BATTLE',
  PRACTICE = 'PRACTICE',
  VISUALIZER = 'VISUALIZER',
  DASHBOARD = 'DASHBOARD',
  LEADERBOARD = 'LEADERBOARD',
  PLAYGROUND = 'PLAYGROUND',
  TUTORIALS = 'TUTORIALS',
  DOCS = 'DOCS',
  HOME = 'HOME',
  PROFILE = 'PROFILE',
  APTITUDE = 'APTITUDE',
  JOBS = 'JOBS',
  SETTINGS = 'SETTINGS',

}



export interface VisualizerStep {
  step: number;
  description: string;
  changedVariables: Record<string, string>;
}
