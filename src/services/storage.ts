import {
  LifeOsData,
  Habit,
  UserProfile,
  DsaProblem,
  StudySession,
  StrugglingTopic,
  PlacementApplication,
  ProjectItem,
  MoodJournalEntry,
  SocialAttentionEntry,
  FitnessLog,
  GoalPlan,
  WeeklyReviewRecord
} from '../types';
import { getTodayString, getPastDates } from '../utils/dateUtils';

const STORAGE_KEY = 'life_os_data_v1';

export const DEFAULT_HABITS: Omit<Habit, 'completions'>[] = [
  {
    id: 'habit-dsa',
    name: 'DSA Practice (1-2 Problems)',
    category: 'DSA',
    description: 'Solve problems independently without jumping to editorials.',
    color: '#6366f1',
    createdDate: getTodayString(),
    isDefault: true,
  },
  {
    id: 'habit-placement',
    name: 'Placement Prep (Core CS / Revision)',
    category: 'Career',
    description: 'Study OS, DBMS, CN, System Design, or Aptitude.',
    color: '#38bdf8',
    createdDate: getTodayString(),
    isDefault: true,
  },
  {
    id: 'habit-project',
    name: 'Project Work / Engineering',
    category: 'Project',
    description: 'Build real portfolio features, fix bugs, or write tests.',
    color: '#ec4899',
    createdDate: getTodayString(),
    isDefault: true,
  },
  {
    id: 'habit-fitness',
    name: 'Gym Workout or Badminton',
    category: 'Fitness',
    description: 'Maintain lean athletic physique and physical stamina.',
    color: '#10b981',
    createdDate: getTodayString(),
    isDefault: true,
  },
  {
    id: 'habit-journal',
    name: 'Evening Journal & Check-in',
    category: 'Mindset',
    description: 'Fast non-judgmental check-in on mood, energy, and wins.',
    color: '#a855f7',
    createdDate: getTodayString(),
    isDefault: true,
  },
  {
    id: 'habit-sleep',
    name: 'Healthy Sleep Routine (7-8h)',
    category: 'Lifestyle',
    description: 'Consistent sleep window for neuroplasticity and recovery.',
    color: '#f59e0b',
    createdDate: getTodayString(),
    isDefault: true,
  },
  {
    id: 'habit-social-limit',
    name: 'Limited Unplanned Social Media',
    category: 'Lifestyle',
    description: 'Avoid endless scrolling or reactive checking during focus hours.',
    color: '#f43f5e',
    createdDate: getTodayString(),
    isDefault: true,
  },
  {
    id: 'habit-intentional-social',
    name: 'Intentional Social Interactions',
    category: 'Social',
    description: 'Genuine bonding with friends/family without letting it derail studies.',
    color: '#14b8a6',
    createdDate: getTodayString(),
    isDefault: true,
  },
];

export const INITIAL_PROFILE: UserProfile = {
  name: 'Tarun',
  targetRole: 'Software Development Engineer (SDE-1)',
  dailyStudyTargetHours: 5,
  dailyDsaTarget: 2,
  weeklyWorkoutTarget: 5,
  dailySleepTargetHours: 7.5,
  theme: 'dark',
};

export function getCleanInitialData(): LifeOsData {
  return {
    profile: INITIAL_PROFILE,
    habits: DEFAULT_HABITS.map(h => ({
      ...h,
      completions: {},
    })),
    dsaProblems: [],
    studySessions: [],
    strugglingTopics: [
      {
        id: 'topic-dp',
        name: 'Dynamic Programming on Trees & Subsequences',
        category: 'DSA',
        confidenceLevel: 2,
        status: 'Needs Revision',
        keyIssues: 'Identifying overlapping subproblems in multi-dimensional states.'
      },
      {
        id: 'topic-graphs',
        name: 'Topological Sort & Dijkstra Algorithm',
        category: 'DSA',
        confidenceLevel: 3,
        status: 'Revising',
        keyIssues: 'Cycle detection in directed graphs.'
      },
      {
        id: 'topic-dbms',
        name: 'Transactions, ACID & Indexing B-Trees',
        category: 'Core CS',
        confidenceLevel: 3,
        status: 'Revising',
        keyIssues: 'Isolation levels and dirty reads.'
      }
    ],
    placements: [],
    projects: [
      {
        id: 'proj-1',
        title: 'Distributed Task Queue System',
        description: 'Lightweight asynchronous job queue in Go with Redis backend and worker polling.',
        techStack: ['Go', 'Redis', 'Docker'],
        progressPercentage: 45,
        status: 'In Progress',
        milestones: [
          { id: 'm1', title: 'Redis connection pool & queue schema', completed: true },
          { id: 'm2', title: 'Worker pool with graceful shutdown', completed: true },
          { id: 'm3', title: 'Exponential backoff & retry mechanism', completed: false },
          { id: 'm4', title: 'Prometheus metrics & dashboard', completed: false }
        ]
      }
    ],
    moodJournal: [],
    socialAttention: [],
    fitnessLogs: [],
    goals: [
      {
        id: 'goal-1',
        title: 'Crack Tier-1 Tech Placement & Master Core DSA',
        timeframe: '90-day',
        category: 'Career & DSA',
        startDate: getTodayString(),
        targetDate: getPastDates(90, getTodayString())[0] || '2026-12-31',
        progress: 35,
        dailyWeeklyActions: [
          'Solve 2 medium problems daily without checking solution for first 30 mins',
          'Revise 1 struggling topic every Saturday',
          'Mock technical interview every alternate Sunday'
        ],
        milestones: [
          { id: 'gm1', title: 'Finish Blind 75 / Striver SDE Core', done: false },
          { id: 'gm2', title: 'Complete 300+ LeetCode problems (60% Medium)', done: false },
          { id: 'gm3', title: 'Ship distributed queue project with documentation', done: false },
          { id: 'gm4', title: 'Clear minimum 3 company Online Assessments', done: false }
        ],
        reviewNotes: 'Consistency beats intensity. Do not binge 10 problems on Sunday and skip Monday.',
        status: 'Active'
      },
      {
        id: 'goal-2',
        title: 'Build Athletic Stamina & Lean Physique',
        timeframe: '90-day',
        category: 'Fitness & Body',
        startDate: getTodayString(),
        targetDate: '2026-12-31',
        progress: 40,
        dailyWeeklyActions: [
          '4 gym resistance sessions + 2 badminton sessions weekly',
          'Prioritize 7.5 hours uninterrupted sleep',
          'Hit 120g protein daily with clean hydration'
        ],
        milestones: [
          { id: 'fg1', title: 'Consistent 5 days/week workout frequency for 4 straight weeks', done: false },
          { id: 'fg2', title: 'Improve badminton endurance (full 60 min high tempo without gassing out)', done: true },
          { id: 'fg3', title: 'Maintain target weight with optimal energy levels', done: false }
        ],
        reviewNotes: 'Fitness supports study focus. Working out prevents placement anxiety.',
        status: 'Active'
      }
    ],
    weeklyReviews: [],
    lastActiveDate: getTodayString(),
  };
}

/**
 * Storage Service Interface
 * Abstracted so the application logic is completely decoupled from localStorage
 * and can be easily ported to IndexedDB, SQLite, or a REST API backend.
 */
export interface IStorageService {
  getData(): LifeOsData;
  saveData(data: LifeOsData): void;
  updateData(updater: (prev: LifeOsData) => LifeOsData): LifeOsData;
  exportData(): string;
  importData(jsonString: string): { success: boolean; error?: string };
  resetData(): void;
  seedRealisticSampleData(): LifeOsData;
  subscribe(listener: (data: LifeOsData) => void): () => void;
}

class LocalStorageService implements IStorageService {
  private listeners: Set<(data: LifeOsData) => void> = new Set();

  getData(): LifeOsData {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY);
      if (!serialized) {
        const initial = getCleanInitialData();
        this.saveData(initial);
        return initial;
      }
      const parsed = JSON.parse(serialized);
      // Ensure any newly added schema fields exist
      return {
        ...getCleanInitialData(),
        ...parsed,
        profile: { ...INITIAL_PROFILE, ...(parsed.profile || {}) },
      };
    } catch (e) {
      console.error('Failed to parse LIFE OS data from localStorage', e);
      return getCleanInitialData();
    }
  }

  saveData(data: LifeOsData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      this.notifyListeners(data);
    } catch (e) {
      console.error('Failed to save LIFE OS data to localStorage', e);
    }
  }

  updateData(updater: (prev: LifeOsData) => LifeOsData): LifeOsData {
    const current = this.getData();
    const updated = updater(current);
    this.saveData(updated);
    return updated;
  }

  exportData(): string {
    const data = this.getData();
    return JSON.stringify(data, null, 2);
  }

  importData(jsonString: string): { success: boolean; error?: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, error: 'Invalid JSON format' };
      }
      if (!Array.isArray(parsed.habits) || !parsed.profile) {
        return { success: false, error: 'Missing core LIFE OS structures (profile or habits)' };
      }
      this.saveData(parsed as LifeOsData);
      return { success: true };
    } catch (e) {
      return { success: false, error: e instanceof Error ? e.message : 'Unknown parsing error' };
    }
  }

  resetData(): void {
    const clean = getCleanInitialData();
    this.saveData(clean);
  }

  seedRealisticSampleData(): LifeOsData {
    const today = getTodayString();
    const past7 = getPastDates(7, today);
    const past14 = getPastDates(14, today);

    const base = getCleanInitialData();

    // Populate realistic habit completions for past 7 days
    const habitsWithHistory: Habit[] = base.habits.map((habit, index) => {
      const completions: Record<string, { completed: boolean; notes?: string }> = {};
      past7.forEach((date, dayIdx) => {
        // High consistency on core habits, realistic occasional miss
        const skipDay = (index === 2 && dayIdx === 2) || (index === 3 && dayIdx === 4);
        completions[date] = {
          completed: !skipDay,
          notes: !skipDay ? 'Completed as planned' : 'Busy with college viva, recovered next day',
        };
      });
      return {
        ...habit,
        completions,
      };
    });

    // Realistic DSA problems solved recently
    const sampleDsa: DsaProblem[] = [
      {
        id: 'dsa-1',
        date: today,
        name: 'Longest Consecutive Sequence',
        platform: 'LeetCode',
        topic: 'Arrays & Hashing',
        difficulty: 'Medium',
        status: 'Solved Independently',
        timeSpentMinutes: 35,
        problemUrl: 'https://leetcode.com/problems/longest-consecutive-sequence/',
        keyLearnings: 'Used HashSet for O(n) lookup. Checked num - 1 to identify streak starts only.',
        revisitNeeded: false,
      },
      {
        id: 'dsa-2',
        date: today,
        name: 'Clone Graph',
        platform: 'LeetCode',
        topic: 'Graphs',
        difficulty: 'Medium',
        status: 'Solved Independently',
        timeSpentMinutes: 40,
        problemUrl: 'https://leetcode.com/problems/clone-graph/',
        keyLearnings: 'DFS with HashMap mapping original node pointer to newly cloned node.',
        revisitNeeded: false,
      },
      {
        id: 'dsa-3',
        date: past7[5] || today,
        name: 'Word Break',
        platform: 'LeetCode',
        topic: 'Dynamic Programming',
        difficulty: 'Medium',
        status: 'Solved with Hints / Editorial',
        timeSpentMinutes: 50,
        problemUrl: 'https://leetcode.com/problems/word-break/',
        keyLearnings: 'Struggled with bottom-up DP transition. dp[i] depends on dp[j] && wordSet.has(s.substring(j, i)).',
        revisitNeeded: true,
      },
      {
        id: 'dsa-4',
        date: past7[4] || today,
        name: 'Course Schedule II',
        platform: 'LeetCode',
        topic: 'Graphs',
        difficulty: 'Medium',
        status: 'Solved Independently',
        timeSpentMinutes: 45,
        problemUrl: 'https://leetcode.com/problems/course-schedule-ii/',
        keyLearnings: 'Kahn algorithm with indegree array and queue. Cycle detected if result size < numCourses.',
        revisitNeeded: false,
      },
      {
        id: 'dsa-5',
        date: past7[3] || today,
        name: 'Trapping Rain Water',
        platform: 'LeetCode',
        topic: 'Two Pointers',
        difficulty: 'Hard',
        status: 'Solved with Hints / Editorial',
        timeSpentMinutes: 65,
        problemUrl: 'https://leetcode.com/problems/trapping-rain-water/',
        keyLearnings: 'Two pointer optimal approach O(1) space: maintain leftMax and rightMax.',
        revisitNeeded: true,
      },
      {
        id: 'dsa-6',
        date: past7[2] || today,
        name: 'Koko Eating Bananas',
        platform: 'LeetCode',
        topic: 'Binary Search',
        difficulty: 'Medium',
        status: 'Solved Independently',
        timeSpentMinutes: 30,
        problemUrl: 'https://leetcode.com/problems/koko-eating-bananas/',
        keyLearnings: 'Binary search on answer space between 1 and max(piles). Monotonic condition holds.',
        revisitNeeded: false,
      }
    ];

    // Realistic study sessions
    const sampleStudy: StudySession[] = [
      {
        id: 'study-1',
        date: today,
        category: 'DSA Practice',
        durationMinutes: 90,
        notes: 'Graphs and Arrays. Solved Clone Graph and Longest Consecutive Sequence.',
      },
      {
        id: 'study-2',
        date: today,
        category: 'Core CS (OS/DBMS/CN)',
        durationMinutes: 60,
        notes: 'DBMS Indexing, B+ Trees vs B Trees, clustering index.',
      },
      {
        id: 'study-3',
        date: past7[5] || today,
        category: 'DSA Practice',
        durationMinutes: 120,
        notes: 'Dynamic programming problems and recursion tree visualization.',
      },
      {
        id: 'study-4',
        date: past7[4] || today,
        category: 'Project Work',
        durationMinutes: 90,
        notes: 'Implemented Redis connection pool for distributed queue project.',
      },
      {
        id: 'study-5',
        date: past7[3] || today,
        category: 'Interview Prep',
        durationMinutes: 60,
        notes: 'Behavioral STAR method preparation and mock intro pitch.',
      }
    ];

    // Realistic placement applications
    const samplePlacements: PlacementApplication[] = [
      {
        id: 'pl-1',
        company: 'Google',
        role: 'Software Engineer, Early Career (2027/Placement)',
        stage: 'Applied',
        appliedDate: past14[10] || today,
        deadline: '2026-11-15',
        location: 'Bengaluru / Hyderabad',
        priority: 'High',
        notes: 'Referred by senior alumni. Brushed up Graphs & DP.',
      },
      {
        id: 'pl-2',
        company: 'Amazon',
        role: 'SDE-1',
        stage: 'OA Pending',
        appliedDate: past14[7] || today,
        oaDate: '2026-10-30',
        deadline: '2026-10-30',
        location: 'Hyderabad',
        priority: 'High',
        notes: 'OA link received: 2 coding questions + Work Style Simulation (Leadership Principles).',
      },
      {
        id: 'pl-3',
        company: 'Atlassian',
        role: 'Associate Software Engineer',
        stage: 'Technical Interview',
        appliedDate: past14[13] || today,
        oaDate: past7[4] || today,
        interviewDate: '2026-11-03',
        location: 'Bengaluru (Remote/Hybrid)',
        compensation: 'CTC ~ 40 LPA (Tier-1 on-campus)',
        priority: 'High',
        notes: 'OA cleared with 100% score! Technical round covers Data Structures & Clean Code.',
      },
      {
        id: 'pl-4',
        company: 'Cisco',
        role: 'Software Engineer (Networking & Cloud)',
        stage: 'OA Cleared',
        appliedDate: past14[12] || today,
        oaDate: past7[6] || today,
        location: 'Bengaluru',
        priority: 'Medium',
        notes: 'Need to review Computer Networks (OSI layers, TCP/UDP, DNS handshake).',
      }
    ];

    // Realistic mood journal entries
    const sampleMood: MoodJournalEntry[] = [
      {
        id: 'mood-1',
        date: today,
        mood: 8,
        energy: 8,
        stress: 4,
        sleepHours: 7.5,
        mainEmotion: 'Focused & Grounded',
        wentWell: 'Solved 2 DSA medium problems cleanly without panic. Hit the gym in the evening.',
        madeDifficult: 'Had a strong urge to open WhatsApp after lunch; put phone in the other room.',
        oneImprovementTomorrow: 'Start DSA session immediately at 9:30 AM rather than browsing tech news first.',
        tags: ['Productive', 'Gym', 'DSA'],
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'mood-2',
        date: past7[5] || today,
        mood: 7,
        energy: 6,
        stress: 5,
        sleepHours: 7.0,
        mainEmotion: 'Determined',
        wentWell: 'Understood bottom-up DP transition for Word Break after struggling initially.',
        madeDifficult: 'Felt tired in the afternoon due to late sleep the previous night.',
        oneImprovementTomorrow: 'Protect the 11:30 PM wind-down routine.',
        tags: ['Learning', 'Discipline'],
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'mood-3',
        date: past7[4] || today,
        mood: 9,
        energy: 9,
        stress: 3,
        sleepHours: 8.0,
        mainEmotion: 'Energized & Victorious',
        wentWell: 'Cleared Atlassian OA! Had a great badminton session with college mates.',
        madeDifficult: 'Mild distraction chatting about OA cutoff marks in the placement group.',
        oneImprovementTomorrow: 'Avoid speculative discussions in college group chats.',
        tags: ['OA Cleared', 'Badminton', 'High Energy'],
        updatedAt: new Date().toISOString(),
      }
    ];

    // Realistic social & focus entries
    const sampleSocial: SocialAttentionEntry[] = [
      {
        id: 'soc-1',
        date: today,
        chatTimeMinutes: 45,
        planned: true,
        interruptedStudy: false,
        feltAfterward: 'Connected',
        maintainedPriorities: true,
        activityDescription: 'Evening call with engineering friend discussing interview prep and projects.',
        privateNotes: 'Supportive talk. Shared problem links on LeetCode.',
      },
      {
        id: 'soc-2',
        date: past7[5] || today,
        chatTimeMinutes: 30,
        planned: true,
        interruptedStudy: false,
        feltAfterward: 'Neutral',
        maintainedPriorities: true,
        activityDescription: 'Quick catchup with hostel friends over dinner.',
      },
      {
        id: 'soc-3',
        date: past7[4] || today,
        chatTimeMinutes: 70,
        planned: false,
        interruptedStudy: true,
        feltAfterward: 'Drained',
        maintainedPriorities: false,
        activityDescription: 'Unplanned texting debate in college group regarding company hiring freezes.',
        privateNotes: 'Realized speculative talk causes unnecessary anxiety without changing anything.',
      }
    ];

    // Realistic fitness logs
    const sampleFitness: FitnessLog[] = [
      {
        id: 'fit-1',
        date: today,
        bodyWeightKg: 71.4,
        measurements: { chestCm: 98, waistCm: 79, armsCm: 35 },
        sleepHours: 7.5,
        sleepConsistency: 'Good',
        cardioMinutes: 0,
        workouts: [
          {
            id: 'ex-1',
            name: 'Pull-ups / Chin-ups',
            skipped: false,
            sets: [
              { reps: 10, weightKg: 0 },
              { reps: 8, weightKg: 0 },
              { reps: 8, weightKg: 0 }
            ]
          },
          {
            id: 'ex-2',
            name: 'Barbell Romanian Deadlift (RDL)',
            skipped: false,
            sets: [
              { reps: 10, weightKg: 60 },
              { reps: 10, weightKg: 70 },
              { reps: 8, weightKg: 75 }
            ]
          },
          {
            id: 'ex-3',
            name: 'Dumbbell Incline Bench Press',
            skipped: false,
            sets: [
              { reps: 10, weightKg: 22 },
              { reps: 10, weightKg: 24 },
              { reps: 8, weightKg: 26 }
            ]
          }
        ],
        notes: 'Good muscle pumps, athletic control on eccentric reps.'
      },
      {
        id: 'fit-2',
        date: past7[4] || today,
        bodyWeightKg: 71.6,
        sleepHours: 8.0,
        sleepConsistency: 'Excellent',
        cardioMinutes: 50,
        cardioType: 'Badminton',
        workouts: [],
        notes: 'High intensity singles match. Great sweat and footwork.'
      }
    ];

    const seededData: LifeOsData = {
      ...base,
      habits: habitsWithHistory,
      dsaProblems: sampleDsa,
      studySessions: sampleStudy,
      placements: samplePlacements,
      moodJournal: sampleMood,
      socialAttention: sampleSocial,
      fitnessLogs: sampleFitness,
      lastActiveDate: today,
    };

    this.saveData(seededData);
    return seededData;
  }

  subscribe(listener: (data: LifeOsData) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(data: LifeOsData): void {
    this.listeners.forEach(fn => {
      try {
        fn(data);
      } catch (err) {
        console.error('Error notifying storage listener', err);
      }
    });
  }
}

export const storageService = new LocalStorageService();
