import React, { createContext, useContext, useState, useEffect } from 'react';
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
import { storageService } from '../services/storage';
import { getTodayString } from '../utils/dateUtils';

interface LifeOsContextType {
  data: LifeOsData;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  quickAddOpen: boolean;
  setQuickAddOpen: (open: boolean, initialType?: string) => void;
  quickAddInitialType: string;

  // Profile
  updateProfile: (profile: Partial<UserProfile>) => void;

  // Habits
  addHabit: (habit: Omit<Habit, 'id' | 'createdDate' | 'completions'>) => void;
  editHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
  toggleHabit: (habitId: string, dateStr: string, notes?: string) => void;

  // Career & DSA
  addDsaProblem: (problem: Omit<DsaProblem, 'id'>) => void;
  editDsaProblem: (problem: DsaProblem) => void;
  deleteDsaProblem: (id: string) => void;
  addStudySession: (session: Omit<StudySession, 'id'>) => void;
  deleteStudySession: (id: string) => void;
  addStrugglingTopic: (topic: Omit<StrugglingTopic, 'id'>) => void;
  editStrugglingTopic: (topic: StrugglingTopic) => void;
  deleteStrugglingTopic: (id: string) => void;

  // Placements & Projects
  addPlacement: (app: Omit<PlacementApplication, 'id'>) => void;
  editPlacement: (app: PlacementApplication) => void;
  deletePlacement: (id: string) => void;
  addProject: (proj: Omit<ProjectItem, 'id'>) => void;
  editProject: (proj: ProjectItem) => void;
  deleteProject: (id: string) => void;
  toggleProjectMilestone: (projectId: string, milestoneId: string) => void;

  // Mood & Journal
  saveMoodEntry: (entry: Omit<MoodJournalEntry, 'id' | 'updatedAt'>) => void;
  deleteMoodEntry: (id: string) => void;

  // Social & Attention
  addSocialEntry: (entry: Omit<SocialAttentionEntry, 'id'>) => void;
  editSocialEntry: (entry: SocialAttentionEntry) => void;
  deleteSocialEntry: (id: string) => void;

  // Fitness
  saveFitnessLog: (log: Omit<FitnessLog, 'id'>) => void;
  deleteFitnessLog: (id: string) => void;

  // Goals
  addGoal: (goal: Omit<GoalPlan, 'id'>) => void;
  editGoal: (goal: GoalPlan) => void;
  deleteGoal: (id: string) => void;
  toggleGoalMilestone: (goalId: string, milestoneId: string) => void;

  // Weekly review
  saveWeeklyReview: (review: Omit<WeeklyReviewRecord, 'id' | 'savedAt'>) => void;

  // Data management
  seedDemoData: () => void;
  resetAllData: () => void;
  exportDataJson: () => string;
  importDataJson: (json: string) => { success: boolean; error?: string };
}

const LifeOsContext = createContext<LifeOsContextType | undefined>(undefined);

export const LifeOsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<LifeOsData>(() => storageService.getData());
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [quickAddOpen, setQuickAddOpenState] = useState<boolean>(false);
  const [quickAddInitialType, setQuickAddInitialType] = useState<string>('dsa');

  useEffect(() => {
    const unsubscribe = storageService.subscribe(updated => {
      setData({ ...updated });
    });
    return () => unsubscribe();
  }, []);

  const setQuickAddOpen = (open: boolean, initialType: string = 'dsa') => {
    setQuickAddInitialType(initialType);
    setQuickAddOpenState(open);
  };

  // Profile
  const updateProfile = (profile: Partial<UserProfile>) => {
    storageService.updateData(prev => ({
      ...prev,
      profile: { ...prev.profile, ...profile },
    }));
  };

  // Habits
  const addHabit = (habitData: Omit<Habit, 'id' | 'createdDate' | 'completions'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: `habit-${Date.now()}`,
      createdDate: getTodayString(),
      completions: {},
    };
    storageService.updateData(prev => ({
      ...prev,
      habits: [...prev.habits, newHabit],
    }));
  };

  const editHabit = (habit: Habit) => {
    storageService.updateData(prev => ({
      ...prev,
      habits: prev.habits.map(h => (h.id === habit.id ? habit : h)),
    }));
  };

  const deleteHabit = (id: string) => {
    storageService.updateData(prev => ({
      ...prev,
      habits: prev.habits.filter(h => h.id !== id),
    }));
  };

  const toggleHabit = (habitId: string, dateStr: string, notes?: string) => {
    storageService.updateData(prev => {
      const habits = prev.habits.map(h => {
        if (h.id !== habitId) return h;
        const currentCompletion = h.completions[dateStr]?.completed;
        const updatedCompletions = { ...h.completions };
        if (currentCompletion) {
          delete updatedCompletions[dateStr];
        } else {
          updatedCompletions[dateStr] = {
            completed: true,
            notes: notes || undefined,
          };
        }
        return {
          ...h,
          completions: updatedCompletions,
        };
      });
      return { ...prev, habits };
    });
  };

  // DSA Problems
  const addDsaProblem = (problem: Omit<DsaProblem, 'id'>) => {
    const newProb: DsaProblem = {
      ...problem,
      id: `dsa-${Date.now()}`,
    };
    storageService.updateData(prev => ({
      ...prev,
      dsaProblems: [newProb, ...prev.dsaProblems],
    }));
  };

  const editDsaProblem = (problem: DsaProblem) => {
    storageService.updateData(prev => ({
      ...prev,
      dsaProblems: prev.dsaProblems.map(p => (p.id === problem.id ? problem : p)),
    }));
  };

  const deleteDsaProblem = (id: string) => {
    storageService.updateData(prev => ({
      ...prev,
      dsaProblems: prev.dsaProblems.filter(p => p.id !== id),
    }));
  };

  // Study Sessions
  const addStudySession = (session: Omit<StudySession, 'id'>) => {
    const newSession: StudySession = {
      ...session,
      id: `study-${Date.now()}`,
    };
    storageService.updateData(prev => ({
      ...prev,
      studySessions: [newSession, ...prev.studySessions],
    }));
  };

  const deleteStudySession = (id: string) => {
    storageService.updateData(prev => ({
      ...prev,
      studySessions: prev.studySessions.filter(s => s.id !== id),
    }));
  };

  // Struggling Topics
  const addStrugglingTopic = (topic: Omit<StrugglingTopic, 'id'>) => {
    const newTopic: StrugglingTopic = {
      ...topic,
      id: `topic-${Date.now()}`,
    };
    storageService.updateData(prev => ({
      ...prev,
      strugglingTopics: [...prev.strugglingTopics, newTopic],
    }));
  };

  const editStrugglingTopic = (topic: StrugglingTopic) => {
    storageService.updateData(prev => ({
      ...prev,
      strugglingTopics: prev.strugglingTopics.map(t => (t.id === topic.id ? topic : t)),
    }));
  };

  const deleteStrugglingTopic = (id: string) => {
    storageService.updateData(prev => ({
      ...prev,
      strugglingTopics: prev.strugglingTopics.filter(t => t.id !== id),
    }));
  };

  // Placements
  const addPlacement = (app: Omit<PlacementApplication, 'id'>) => {
    const newApp: PlacementApplication = {
      ...app,
      id: `placement-${Date.now()}`,
    };
    storageService.updateData(prev => ({
      ...prev,
      placements: [newApp, ...prev.placements],
    }));
  };

  const editPlacement = (app: PlacementApplication) => {
    storageService.updateData(prev => ({
      ...prev,
      placements: prev.placements.map(p => (p.id === app.id ? app : p)),
    }));
  };

  const deletePlacement = (id: string) => {
    storageService.updateData(prev => ({
      ...prev,
      placements: prev.placements.filter(p => p.id !== id),
    }));
  };

  // Projects
  const addProject = (proj: Omit<ProjectItem, 'id'>) => {
    const newProj: ProjectItem = {
      ...proj,
      id: `proj-${Date.now()}`,
    };
    storageService.updateData(prev => ({
      ...prev,
      projects: [...prev.projects, newProj],
    }));
  };

  const editProject = (proj: ProjectItem) => {
    storageService.updateData(prev => ({
      ...prev,
      projects: prev.projects.map(p => (p.id === proj.id ? proj : p)),
    }));
  };

  const deleteProject = (id: string) => {
    storageService.updateData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id),
    }));
  };

  const toggleProjectMilestone = (projectId: string, milestoneId: string) => {
    storageService.updateData(prev => {
      const projects = prev.projects.map(p => {
        if (p.id !== projectId) return p;
        const updatedMilestones = p.milestones.map(m =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const total = updatedMilestones.length;
        const progressPercentage = total > 0 ? Math.round((completedCount / total) * 100) : p.progressPercentage;
        return {
          ...p,
          milestones: updatedMilestones,
          progressPercentage,
        };
      });
      return { ...prev, projects };
    });
  };

  // Mood & Journal
  const saveMoodEntry = (entry: Omit<MoodJournalEntry, 'id' | 'updatedAt'>) => {
    storageService.updateData(prev => {
      const existingIndex = prev.moodJournal.findIndex(m => m.date === entry.date);
      const updatedList = [...prev.moodJournal];
      const now = new Date().toISOString();
      if (existingIndex >= 0) {
        updatedList[existingIndex] = {
          ...entry,
          id: prev.moodJournal[existingIndex].id,
          updatedAt: now,
        };
      } else {
        updatedList.unshift({
          ...entry,
          id: `mood-${Date.now()}`,
          updatedAt: now,
        });
      }
      return { ...prev, moodJournal: updatedList };
    });
  };

  const deleteMoodEntry = (id: string) => {
    storageService.updateData(prev => ({
      ...prev,
      moodJournal: prev.moodJournal.filter(m => m.id !== id),
    }));
  };

  // Social & Attention
  const addSocialEntry = (entry: Omit<SocialAttentionEntry, 'id'>) => {
    const newEntry: SocialAttentionEntry = {
      ...entry,
      id: `social-${Date.now()}`,
    };
    storageService.updateData(prev => ({
      ...prev,
      socialAttention: [newEntry, ...prev.socialAttention],
    }));
  };

  const editSocialEntry = (entry: SocialAttentionEntry) => {
    storageService.updateData(prev => ({
      ...prev,
      socialAttention: prev.socialAttention.map(s => (s.id === entry.id ? entry : s)),
    }));
  };

  const deleteSocialEntry = (id: string) => {
    storageService.updateData(prev => ({
      ...prev,
      socialAttention: prev.socialAttention.filter(s => s.id !== id),
    }));
  };

  // Fitness
  const saveFitnessLog = (log: Omit<FitnessLog, 'id'>) => {
    storageService.updateData(prev => {
      const existingIdx = prev.fitnessLogs.findIndex(f => f.date === log.date);
      const list = [...prev.fitnessLogs];
      if (existingIdx >= 0) {
        list[existingIdx] = {
          ...log,
          id: prev.fitnessLogs[existingIdx].id,
        };
      } else {
        list.unshift({
          ...log,
          id: `fit-${Date.now()}`,
        });
      }
      return { ...prev, fitnessLogs: list };
    });
  };

  const deleteFitnessLog = (id: string) => {
    storageService.updateData(prev => ({
      ...prev,
      fitnessLogs: prev.fitnessLogs.filter(f => f.id !== id),
    }));
  };

  // Goals
  const addGoal = (goal: Omit<GoalPlan, 'id'>) => {
    const newGoal: GoalPlan = {
      ...goal,
      id: `goal-${Date.now()}`,
    };
    storageService.updateData(prev => ({
      ...prev,
      goals: [...prev.goals, newGoal],
    }));
  };

  const editGoal = (goal: GoalPlan) => {
    storageService.updateData(prev => ({
      ...prev,
      goals: prev.goals.map(g => (g.id === goal.id ? goal : g)),
    }));
  };

  const deleteGoal = (id: string) => {
    storageService.updateData(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== id),
    }));
  };

  const toggleGoalMilestone = (goalId: string, milestoneId: string) => {
    storageService.updateData(prev => {
      const goals = prev.goals.map(g => {
        if (g.id !== goalId) return g;
        const milestones = g.milestones.map(m =>
          m.id === milestoneId ? { ...m, done: !m.done } : m
        );
        const doneCount = milestones.filter(m => m.done).length;
        const progress = milestones.length > 0 ? Math.round((doneCount / milestones.length) * 100) : g.progress;
        return {
          ...g,
          milestones,
          progress,
        };
      });
      return { ...prev, goals };
    });
  };

  // Weekly review
  const saveWeeklyReview = (review: Omit<WeeklyReviewRecord, 'id' | 'savedAt'>) => {
    const newRev: WeeklyReviewRecord = {
      ...review,
      id: `review-${Date.now()}`,
      savedAt: new Date().toISOString(),
    };
    storageService.updateData(prev => ({
      ...prev,
      weeklyReviews: [newRev, ...prev.weeklyReviews.filter(r => r.weekStartDate !== review.weekStartDate)],
    }));
  };

  // Seed & Reset
  const seedDemoData = () => {
    const updated = storageService.seedRealisticSampleData();
    setData(updated);
  };

  const resetAllData = () => {
    storageService.resetData();
    setData(storageService.getData());
  };

  const exportDataJson = () => {
    return storageService.exportData();
  };

  const importDataJson = (json: string) => {
    const result = storageService.importData(json);
    if (result.success) {
      setData(storageService.getData());
    }
    return result;
  };

  return (
    <LifeOsContext.Provider
      value={{
        data,
        activeTab,
        setActiveTab,
        quickAddOpen,
        setQuickAddOpen,
        quickAddInitialType,
        updateProfile,
        addHabit,
        editHabit,
        deleteHabit,
        toggleHabit,
        addDsaProblem,
        editDsaProblem,
        deleteDsaProblem,
        addStudySession,
        deleteStudySession,
        addStrugglingTopic,
        editStrugglingTopic,
        deleteStrugglingTopic,
        addPlacement,
        editPlacement,
        deletePlacement,
        addProject,
        editProject,
        deleteProject,
        toggleProjectMilestone,
        saveMoodEntry,
        deleteMoodEntry,
        addSocialEntry,
        editSocialEntry,
        deleteSocialEntry,
        saveFitnessLog,
        deleteFitnessLog,
        addGoal,
        editGoal,
        deleteGoal,
        toggleGoalMilestone,
        saveWeeklyReview,
        seedDemoData,
        resetAllData,
        exportDataJson,
        importDataJson,
      }}
    >
      {children}
    </LifeOsContext.Provider>
  );
};

export const useLifeOs = () => {
  const context = useContext(LifeOsContext);
  if (!context) {
    throw new Error('useLifeOs must be used within a LifeOsProvider');
  }
  return context;
};
