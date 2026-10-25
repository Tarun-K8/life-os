// Types for LIFE OS

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type ProblemStatus = 
  | 'Solved Independently' 
  | 'Solved with Hints / Editorial' 
  | 'Attempted / Review Needed';

export type Platform = 
  | 'LeetCode' 
  | 'Codeforces' 
  | 'HackerRank' 
  | 'CodeChef' 
  | 'Striver Sheet' 
  | 'NeetCode' 
  | 'GeeksforGeeks' 
  | 'Other';

export type DsaTopic = 
  | 'Arrays & Hashing' 
  | 'Two Pointers' 
  | 'Sliding Window' 
  | 'Binary Search' 
  | 'Trees & BST' 
  | 'Graphs' 
  | 'Dynamic Programming' 
  | 'Recursion & Backtracking' 
  | 'Strings' 
  | 'Linked List' 
  | 'Stack & Queue' 
  | 'Greedy' 
  | 'Bit Manipulation' 
  | 'System Design' 
  | 'Other';

export interface DsaProblem {
  id: string;
  date: string; // YYYY-MM-DD
  name: string;
  platform: Platform;
  topic: DsaTopic;
  difficulty: Difficulty;
  status: ProblemStatus;
  timeSpentMinutes: number;
  problemUrl?: string;
  keyLearnings?: string;
  revisitNeeded: boolean;
}

export interface StudySession {
  id: string;
  date: string; // YYYY-MM-DD
  category: 'DSA Practice' | 'Core CS (OS/DBMS/CN)' | 'System Design' | 'Project Work' | 'Aptitude' | 'Interview Prep';
  durationMinutes: number;
  notes?: string;
}

export interface StrugglingTopic {
  id: string;
  name: string;
  category: string;
  confidenceLevel: 1 | 2 | 3 | 4 | 5; // 1 = High Struggle, 5 = Mastered
  status: 'Needs Revision' | 'Revising' | 'Mastered';
  lastRevisedDate?: string;
  keyIssues?: string;
}

export type ApplicationStage = 
  | 'Wishlist' 
  | 'Applied' 
  | 'OA Pending' 
  | 'OA Cleared' 
  | 'Technical Interview' 
  | 'Managerial / HR' 
  | 'Offer Received' 
  | 'Rejected' 
  | 'Withdrawn';

export interface PlacementApplication {
  id: string;
  company: string;
  role: string;
  stage: ApplicationStage;
  appliedDate: string;
  oaDate?: string;
  interviewDate?: string;
  deadline?: string;
  compensation?: string;
  location?: string;
  notes?: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface ProjectMilestoneItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  repoUrl?: string;
  liveUrl?: string;
  deadline?: string;
  progressPercentage: number;
  milestones: ProjectMilestoneItem[];
  status: 'Planning' | 'In Progress' | 'Shipped';
}

export interface Habit {
  id: string;
  name: string;
  category: 'DSA' | 'Career' | 'Project' | 'Fitness' | 'Mindset' | 'Lifestyle' | 'Social';
  description?: string;
  color?: string;
  createdDate: string;
  isDefault?: boolean;
  completions: Record<string, { completed: boolean; notes?: string }>; // date string -> status
}

export interface MoodJournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  mood: number; // 1-10
  energy: number; // 1-10
  stress: number; // 1-10
  sleepHours: number;
  mainEmotion: string;
  wentWell: string;
  madeDifficult: string;
  oneImprovementTomorrow: string;
  tags?: string[];
  updatedAt: string;
}

export interface SocialAttentionEntry {
  id: string;
  date: string; // YYYY-MM-DD
  chatTimeMinutes: number;
  planned: boolean; // planned vs spontaneous
  interruptedStudy: boolean;
  feltAfterward: 'Energized' | 'Neutral' | 'Drained' | 'Guilty' | 'Connected';
  maintainedPriorities: boolean;
  activityDescription: string;
  privateNotes?: string;
}

export interface ExerciseSet {
  reps: number;
  weightKg: number;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  skipped: boolean;
  sets: ExerciseSet[];
  notes?: string;
}

export interface FitnessLog {
  id: string;
  date: string; // YYYY-MM-DD
  bodyWeightKg?: number;
  measurements?: {
    chestCm?: number;
    waistCm?: number;
    armsCm?: number;
  };
  sleepHours: number;
  sleepConsistency: 'Excellent' | 'Good' | 'Irregular' | 'Poor';
  cardioMinutes: number;
  cardioType?: 'Badminton' | 'Gym Cardio' | 'Running' | 'Walking' | 'None';
  workouts: WorkoutExercise[];
  notes?: string;
}

export interface GoalMilestone {
  id: string;
  title: string;
  done: boolean;
  targetDate?: string;
}

export interface GoalPlan {
  id: string;
  title: string;
  timeframe: '30-day' | '90-day';
  category: 'Career & DSA' | 'Fitness & Body' | 'Mental & Habits' | 'Social & Focus';
  startDate: string;
  targetDate: string;
  progress: number; // 0 - 100
  dailyWeeklyActions: string[];
  milestones: GoalMilestone[];
  reviewNotes?: string;
  status: 'Active' | 'Completed' | 'Paused';
}

export interface WeeklyReviewRecord {
  id: string;
  weekStartDate: string; // YYYY-MM-DD (Monday)
  weekEndDate: string;
  prioritiesForNextWeek: [string, string, string];
  reflectionNotes?: string;
  savedAt: string;
}

export interface UserProfile {
  name: string;
  targetRole: string;
  dailyStudyTargetHours: number;
  dailyDsaTarget: number;
  weeklyWorkoutTarget: number;
  dailySleepTargetHours: number;
  theme: 'dark';
}

export interface LifeOsData {
  profile: UserProfile;
  habits: Habit[];
  dsaProblems: DsaProblem[];
  studySessions: StudySession[];
  strugglingTopics: StrugglingTopic[];
  placements: PlacementApplication[];
  projects: ProjectItem[];
  moodJournal: MoodJournalEntry[];
  socialAttention: SocialAttentionEntry[];
  fitnessLogs: FitnessLog[];
  goals: GoalPlan[];
  weeklyReviews: WeeklyReviewRecord[];
  lastActiveDate: string;
}
