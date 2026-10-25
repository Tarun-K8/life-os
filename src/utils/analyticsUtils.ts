import { LifeOsData, Habit } from '../types';
import { getCurrentWeekDates, getPastDates, getTodayString } from './dateUtils';

export interface WeeklyAnalyticsReport {
  weekRange: string;
  totalStudyMinutes: number;
  totalStudyHours: number;
  dsaIndependentlySolved: number;
  dsaTotalSolved: number;
  habitCompletionRate: number; // 0 - 100
  workoutCount: number;
  avgSleepHours: number;
  avgMood: number;
  avgEnergy: number;
  totalUnplannedChatMinutes: number;
  totalChatMinutes: number;
  mostConsistentHabits: string[];
  areasNeedingAttention: string[];
  suggestedPriorities: [string, string, string];
  correlations: {
    sleepVsMood: string;
    focusVsDistraction: string;
  };
}

export function computeWeeklyAnalytics(data: LifeOsData): WeeklyAnalyticsReport {
  const currentWeek = getCurrentWeekDates();
  const weekDates = currentWeek.map(w => w.date);
  const weekRange = `${currentWeek[0]?.date || ''} - ${currentWeek[6]?.date || ''}`;

  // 1. Study hours
  const weekStudySessions = data.studySessions.filter(s => weekDates.includes(s.date));
  const totalStudyMinutes = weekStudySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalStudyHours = Number((totalStudyMinutes / 60).toFixed(1));

  // 2. DSA Problems
  const weekDsa = data.dsaProblems.filter(p => weekDates.includes(p.date));
  const dsaIndependentlySolved = weekDsa.filter(p => p.status === 'Solved Independently').length;
  const dsaTotalSolved = weekDsa.length;

  // 3. Habit Completion %
  let totalHabitSlots = 0;
  let completedHabitSlots = 0;
  const habitCompletionCounts: { habit: Habit; count: number }[] = [];

  data.habits.forEach(habit => {
    let habitSuccess = 0;
    weekDates.forEach(date => {
      totalHabitSlots++;
      if (habit.completions[date]?.completed) {
        completedHabitSlots++;
        habitSuccess++;
      }
    });
    habitCompletionCounts.push({ habit, count: habitSuccess });
  });

  const habitCompletionRate = totalHabitSlots > 0 
    ? Math.round((completedHabitSlots / totalHabitSlots) * 100) 
    : 0;

  // Rank habits
  habitCompletionCounts.sort((a, b) => b.count - a.count);
  const mostConsistentHabits = habitCompletionCounts
    .filter(h => h.count >= 4)
    .slice(0, 3)
    .map(h => `${h.habit.name} (${h.count}/7 days)`);

  // 4. Workout count
  const weekFitness = data.fitnessLogs.filter(f => weekDates.includes(f.date));
  const workoutCount = weekFitness.filter(f => 
    (f.workouts && f.workouts.length > 0 && f.workouts.some(w => !w.skipped)) || 
    (f.cardioMinutes && f.cardioMinutes > 0)
  ).length;

  // 5. Sleep & Mood
  const weekMoods = data.moodJournal.filter(m => weekDates.includes(m.date));
  const avgSleepHours = weekMoods.length > 0
    ? Number((weekMoods.reduce((acc, m) => acc + m.sleepHours, 0) / weekMoods.length).toFixed(1))
    : 0;
  const avgMood = weekMoods.length > 0
    ? Number((weekMoods.reduce((acc, m) => acc + m.mood, 0) / weekMoods.length).toFixed(1))
    : 0;
  const avgEnergy = weekMoods.length > 0
    ? Number((weekMoods.reduce((acc, m) => acc + m.energy, 0) / weekMoods.length).toFixed(1))
    : 0;

  // 6. Social & Distraction
  const weekSocial = data.socialAttention.filter(s => weekDates.includes(s.date));
  const totalChatMinutes = weekSocial.reduce((acc, s) => acc + s.chatTimeMinutes, 0);
  const totalUnplannedChatMinutes = weekSocial
    .filter(s => !s.planned || s.interruptedStudy)
    .reduce((acc, s) => acc + s.chatTimeMinutes, 0);

  // 7. Honest Areas Needing Attention
  const areasNeedingAttention: string[] = [];
  if (totalStudyHours < (data.profile.dailyStudyTargetHours * 3) && weekDates.length > 0) {
    areasNeedingAttention.push(`Study time (${totalStudyHours}h) is below target pace (${data.profile.dailyStudyTargetHours * 7}h/wk). Protect your core morning block.`);
  }
  if (dsaIndependentlySolved < 5 && dsaTotalSolved > 0) {
    areasNeedingAttention.push(`Only ${dsaIndependentlySolved} problems were solved independently. Try 25 minutes of pen-and-paper dry running before opening hints.`);
  }
  if (totalUnplannedChatMinutes > 120) {
    areasNeedingAttention.push(`${Math.round(totalUnplannedChatMinutes / 60)}h spent in unplanned chatting or group chats that interrupted focus.`);
  }
  if (avgSleepHours > 0 && avgSleepHours < 7.0) {
    areasNeedingAttention.push(`Average sleep was ${avgSleepHours}h. Sub-7h sleep impairs algorithmic memory retention.`);
  }
  if (workoutCount < 3 && weekFitness.length > 0) {
    areasNeedingAttention.push(`Only ${workoutCount} workout/cardio sessions. Schedule at least 3 sessions to sustain energy.`);
  }
  if (areasNeedingAttention.length === 0) {
    areasNeedingAttention.push("Maintain current steady cadence; don't over-commit or spike targets unrealistically.");
  }

  // 8. Realistic Priorities for next week
  const suggestedPriorities: [string, string, string] = [
    dsaIndependentlySolved < 10 
      ? `Solve 2 DSA Mediums independently daily without rushing to solutions` 
      : `Consolidate 1 hard topic (Graphs / DP) with 5 independent variations`,
    totalUnplannedChatMinutes > 60
      ? `Establish a "No-Chat Focus Block" between 9:00 AM - 1:00 PM`
      : `Complete at least 1 mock technical interview or OA simulation`,
    workoutCount < 4
      ? `Hit 4 gym or badminton sessions and protect 7.5h sleep window`
      : `Complete next sprint milestone on your portfolio project`,
  ];

  // 9. Correlation Insights (Honest pattern discovery from data)
  let sleepVsMood = "Log more days to reveal sleep vs mood patterns.";
  if (weekMoods.length >= 3) {
    const highSleep = weekMoods.filter(m => m.sleepHours >= 7.5);
    const lowSleep = weekMoods.filter(m => m.sleepHours < 7.5);
    if (highSleep.length > 0 && lowSleep.length > 0) {
      const avgHigh = (highSleep.reduce((a, b) => a + b.mood, 0) / highSleep.length).toFixed(1);
      const avgLow = (lowSleep.reduce((a, b) => a + b.mood, 0) / lowSleep.length).toFixed(1);
      sleepVsMood = `On days with >= 7.5h sleep, your average mood was ${avgHigh}/10 vs ${avgLow}/10 on lower sleep days.`;
    } else {
      sleepVsMood = `Consistent sleep maintained at avg ${avgSleepHours}h this week.`;
    }
  }

  let focusVsDistraction = "Balancing social interactions and deep work.";
  if (weekSocial.length > 0 && weekStudySessions.length > 0) {
    const interruptedDays = weekSocial.filter(s => s.interruptedStudy).length;
    if (interruptedDays > 0) {
      focusVsDistraction = `${interruptedDays} study session(s) were interrupted by unplanned notifications or chats.`;
    } else {
      focusVsDistraction = "Zero study interruptions logged this week! Solid boundary control.";
    }
  }

  return {
    weekRange,
    totalStudyMinutes,
    totalStudyHours,
    dsaIndependentlySolved,
    dsaTotalSolved,
    habitCompletionRate,
    workoutCount,
    avgSleepHours,
    avgMood,
    avgEnergy,
    totalUnplannedChatMinutes,
    totalChatMinutes,
    mostConsistentHabits,
    areasNeedingAttention,
    suggestedPriorities,
    correlations: {
      sleepVsMood,
      focusVsDistraction,
    },
  };
}

/**
 * Calculates a 7-day consistency score (0 - 100) based on honest logged actions:
 * - Habit completion rate (40%)
 * - Study target achievement (30%)
 * - Sleep & Workout consistency (20%)
 * - Focus protection (10%)
 */
export function calculateWeeklyConsistencyScore(data: LifeOsData): {
  score: number;
  label: string;
  breakdown: { label: string; score: number; max: number }[];
} {
  const currentWeek = getCurrentWeekDates();
  const weekDates = currentWeek.map(w => w.date);

  // 1. Habit score (max 40)
  let totalHabitSlots = 0;
  let doneHabitSlots = 0;
  data.habits.forEach(h => {
    weekDates.forEach(d => {
      totalHabitSlots++;
      if (h.completions[d]?.completed) doneHabitSlots++;
    });
  });
  const habitPct = totalHabitSlots > 0 ? (doneHabitSlots / totalHabitSlots) : 0;
  const habitScore = Math.round(habitPct * 40);

  // 2. Study score (max 30)
  const weekStudy = data.studySessions.filter(s => weekDates.includes(s.date));
  const totalStudyMinutes = weekStudy.reduce((acc, s) => acc + s.durationMinutes, 0);
  const targetStudyMinutes = data.profile.dailyStudyTargetHours * 7 * 60;
  const studyPct = Math.min(1, targetStudyMinutes > 0 ? totalStudyMinutes / targetStudyMinutes : 0);
  const studyScore = Math.round(studyPct * 30);

  // 3. Physical & Sleep score (max 20)
  const weekFitness = data.fitnessLogs.filter(f => weekDates.includes(f.date));
  const weekMood = data.moodJournal.filter(m => weekDates.includes(m.date));
  const workouts = weekFitness.length;
  const targetWorkouts = Math.max(1, data.profile.weeklyWorkoutTarget);
  const workoutRatio = Math.min(1, workouts / targetWorkouts);
  const goodSleepDays = weekMood.filter(m => m.sleepHours >= 7.0).length;
  const sleepRatio = Math.min(1, goodSleepDays / 5);
  const physicalScore = Math.round(((workoutRatio * 0.6) + (sleepRatio * 0.4)) * 20);

  // 4. Focus Protection score (max 10)
  const weekSocial = data.socialAttention.filter(s => weekDates.includes(s.date));
  const interruptedSessions = weekSocial.filter(s => s.interruptedStudy).length;
  let focusScore = 10;
  if (interruptedSessions >= 4) focusScore = 3;
  else if (interruptedSessions >= 2) focusScore = 6;
  else if (interruptedSessions === 1) focusScore = 8;

  const totalScore = Math.min(100, habitScore + studyScore + physicalScore + focusScore);

  let label = 'Establishing Rhythm';
  if (totalScore >= 85) label = 'Outstanding Flow';
  else if (totalScore >= 70) label = 'Solid Consistency';
  else if (totalScore >= 50) label = 'Steady Progress';

  return {
    score: totalScore,
    label,
    breakdown: [
      { label: 'Habit Execution', score: habitScore, max: 40 },
      { label: 'Focused Study Hours', score: studyScore, max: 30 },
      { label: 'Fitness & Sleep Recovery', score: physicalScore, max: 20 },
      { label: 'Focus & Boundary Control', score: focusScore, max: 10 },
    ],
  };
}
