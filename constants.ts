import { Problem, User } from "./types";

export const SAMPLE_PROBLEMS: Problem[] = [
  {
    id: "p1",
    title: "Two Sum",
    difficulty: "Easy",
    baseDescription: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target."
  },
  {
    id: "p2",
    title: "Merge Intervals",
    difficulty: "Medium",
    baseDescription: "Given an array of intervals where intervals[i] = [start, end], merge all overlapping intervals."
  },
  {
    id: "p3",
    title: "Trapping Rain Water",
    difficulty: "Hard",
    baseDescription: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining."
  }
];

export const MOCK_USER: User = {
  id: "u1",
  username: "NeoCoder",
  logicRating: 1450,
  codingRating: 1620,
  streak: 12,
  xp: 12450,
  conceptsLearned: ["Variables", "Loops", "Recursion", "REST API", "HTTP"],
  tutorialsCompleted: ["Backend 101", "REST APIs Explained"]
};

export const LEADERBOARD_DATA: User[] = [
  { id: "u2", username: "Algorithmic_Titan", logicRating: 1980, codingRating: 2100, streak: 45, xp: 28900, conceptsLearned: [], tutorialsCompleted: [] },
  { id: "u3", username: "ByteNinja", logicRating: 1850, codingRating: 1950, streak: 32, xp: 24500, conceptsLearned: [], tutorialsCompleted: [] },
  { id: "u4", username: "NullPointer_Ex", logicRating: 1720, codingRating: 1800, streak: 15, xp: 19200, conceptsLearned: [], tutorialsCompleted: [] },
  MOCK_USER,
  { id: "u5", username: "RecursiveDream", logicRating: 1400, codingRating: 1550, streak: 8, xp: 11800, conceptsLearned: [], tutorialsCompleted: [] },
  { id: "u6", username: "ConsoleLogHero", logicRating: 1350, codingRating: 1420, streak: 3, xp: 9500, conceptsLearned: [], tutorialsCompleted: [] },
  { id: "u7", username: "GitPushForce", logicRating: 1200, codingRating: 1300, streak: 1, xp: 8100, conceptsLearned: [], tutorialsCompleted: [] },
  { id: "u8", username: "PixelDust", logicRating: 1100, codingRating: 1250, streak: 5, xp: 6400, conceptsLearned: [], tutorialsCompleted: [] },
  { id: "u9", username: "StackUnderflow", logicRating: 950, codingRating: 1100, streak: 0, xp: 4200, conceptsLearned: [], tutorialsCompleted: [] },
  { id: "u10", username: "JuniorDev_01", logicRating: 800, codingRating: 900, streak: 2, xp: 2100, conceptsLearned: [], tutorialsCompleted: [] },
];
