import React from 'react';
import {
  Code2,
  Clock,
  CheckCircle2,
  Activity,
  Moon,
  MessageSquare,
  Sparkles,
  ArrowRight,
  PlusCircle,
  Flame,
  ShieldAlert,
  Compass,
  Smile,
  Zap,
} from 'lucide-react';
import { useLifeOs } from '../context/LifeOsContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { DonutProgress } from '../components/common/Charts';
import { getTodayString, formatDisplayDate, calculateHabitStreak } from '../utils/dateUtils';
import { getTodayReflection } from '../utils/quotes';
import { calculateWeeklyConsistencyScore } from '../utils/analyticsUtils';

export const Dashboard: React.FC = () => {
  const {
    data,
    setActiveTab,
    setQuickAddOpen,
    toggleHabit,
  } = useLifeOs();

  const todayStr = getTodayString();
  const reflection = getTodayReflection(todayStr);
  const consistency = calculateWeeklyConsistencyScore(data);

  // Today's metrics
  // 1. DSA Problems solved today
  const todayDsa = data.dsaProblems.filter(p => p.date === todayStr);
  const todayIndependentDsa = todayDsa.filter(p => p.status === 'Solved Independently');

  // 2. Study hours today
  const todayStudySessions = data.studySessions.filter(s => s.date === todayStr);
  const todayStudyMinutes = todayStudySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const todayStudyHours = (todayStudyMinutes / 60).toFixed(1);
  const studyTargetHours = data.profile.dailyStudyTargetHours || 5;
  const studyProgressPct = Math.min(100, Math.round((todayStudyMinutes / (studyTargetHours * 60)) * 100));

  // 3. Habits today
  const totalHabits = data.habits.length;
  const completedHabitsToday = data.habits.filter(h => h.completions[todayStr]?.completed).length;
  const habitPct = totalHabits > 0 ? Math.round((completedHabitsToday / totalHabits) * 100) : 0;

  // 4. Mood entry today
  const todayMood = data.moodJournal.find(m => m.date === todayStr);

  // 5. Fitness today
  const todayFitness = data.fitnessLogs.find(f => f.date === todayStr);

  // 6. Social / Distraction today
  const todaySocial = data.socialAttention.filter(s => s.date === todayStr);
  const todayChatMinutes = todaySocial.reduce((acc, s) => acc + s.chatTimeMinutes, 0);
  const todayUnplannedMinutes = todaySocial
    .filter(s => !s.planned || s.interruptedStudy)
    .reduce((acc, s) => acc + s.chatTimeMinutes, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Calm Realistic Motivational Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950/70 via-[#13192c] to-[#0f1422] border border-indigo-900/40 p-5 sm:p-6 shadow-xl">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-[11px] font-mono uppercase font-semibold text-indigo-400 bg-indigo-950/80 px-2.5 py-0.5 rounded-full border border-indigo-800/50">
                <Sparkles className="w-3 h-3" />
                {reflection.source}
              </span>
              <span className="text-xs text-slate-400 font-mono">Today's Perspective</span>
            </div>
            <p className="text-sm sm:text-base font-medium text-slate-100 leading-snug">
              "{reflection.quote}"
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              {reflection.context}
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
            <button
              onClick={() => setQuickAddOpen(true, 'dsa')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all active:scale-95 whitespace-nowrap"
            >
              <Code2 className="w-4 h-4" />
              <span>Log DSA Solve</span>
            </button>
            <button
              onClick={() => setQuickAddOpen(true, 'mood')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-slate-200 text-xs font-medium transition-all whitespace-nowrap"
            >
              <Smile className="w-3.5 h-3.5 text-indigo-400" />
              <span>{todayMood ? 'Edit Check-in' : 'Daily Check-in'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Snapshot Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: Focused Study */}
        <Card noPadding className="p-4 border-indigo-950/70 hover:border-indigo-800/50">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Focused Study</span>
            <div className="p-1.5 rounded-lg bg-indigo-950/60 text-indigo-400 border border-indigo-900/60">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-slate-100">{todayStudyHours}</span>
            <span className="text-xs text-slate-400 font-mono">/ {studyTargetHours}h target</span>
          </div>
          <ProgressBar progress={studyProgressPct} size="sm" className="mt-3" />
        </Card>

        {/* Metric 2: DSA Problems */}
        <Card noPadding className="p-4 border-indigo-950/70 hover:border-indigo-800/50">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">DSA Solved Today</span>
            <div className="p-1.5 rounded-lg bg-purple-950/60 text-purple-400 border border-purple-900/60">
              <Code2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-slate-100">{todayDsa.length}</span>
            <span className="text-xs text-slate-400 font-mono">
              ({todayIndependentDsa.length} independent)
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-purple-300">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span>Target: {data.profile.dailyDsaTarget || 2} problems/day</span>
          </div>
        </Card>

        {/* Metric 3: Habit Execution */}
        <Card noPadding className="p-4 border-indigo-950/70 hover:border-indigo-800/50">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Habit Execution</span>
            <div className="p-1.5 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-900/60">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-slate-100">
              {completedHabitsToday}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ {totalHabits} done</span>
          </div>
          <ProgressBar progress={habitPct} color="bg-emerald-500" size="sm" className="mt-3" />
        </Card>

        {/* Metric 4: Distraction / Chat Monitor */}
        <Card noPadding className="p-4 border-indigo-950/70 hover:border-indigo-800/50">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Social & Distraction</span>
            <div className="p-1.5 rounded-lg bg-amber-950/60 text-amber-400 border border-amber-900/60">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-slate-100">{todayChatMinutes}m</span>
            <span className="text-xs text-slate-400 font-mono">logged</span>
          </div>
          <p className="mt-2.5 text-[11px] text-slate-400 truncate">
            {todayUnplannedMinutes > 0 ? (
              <span className="text-amber-400 font-medium">{todayUnplannedMinutes}m unplanned / interrupt</span>
            ) : (
              <span className="text-emerald-400">Zero focus interruptions</span>
            )}
          </p>
        </Card>
      </div>

      {/* 3. Main Dashboard Grid: Habits & Consistency Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Today's Active Habit Tracker */}
        <div className="lg:col-span-2 space-y-4">
          <Card
            title="Today's Habit Checklist"
            subtitle={`${completedHabitsToday} of ${totalHabits} completed today. Missed a day previously? Recovery preserves your momentum.`}
            action={
              <button
                onClick={() => setActiveTab('habits')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                <span>Full Habit View</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            }
          >
            <div className="space-y-2">
              {data.habits.map(habit => {
                const isCompleted = habit.completions[todayStr]?.completed;
                const streakInfo = calculateHabitStreak(habit.completions, todayStr);

                return (
                  <div
                    key={habit.id}
                    onClick={() => toggleHabit(habit.id, todayStr)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${
                      isCompleted
                        ? 'bg-slate-900/80 border-slate-700/60 opacity-90'
                        : 'bg-[#14192b]/70 border-[#20273f] hover:border-indigo-600/50 hover:bg-[#181f35]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                          isCompleted
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm shadow-indigo-600/30'
                            : 'border-slate-600 bg-slate-900/60'
                        }`}
                      >
                        {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>

                      <div className="min-w-0">
                        <p
                          className={`text-xs font-semibold truncate ${
                            isCompleted ? 'line-through text-slate-400' : 'text-slate-100'
                          }`}
                        >
                          {habit.name}
                        </p>
                        {habit.description && (
                          <p className="text-[11px] text-slate-500 truncate max-w-sm">
                            {habit.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant={streakInfo.currentStreak > 0 ? 'info' : 'default'}
                        size="sm"
                        icon={<Flame className="w-3 h-3 text-amber-400" />}
                      >
                        <span className="font-mono">{streakInfo.currentStreak}d</span>
                      </Badge>
                      {streakInfo.recovered && (
                        <span
                          title="Missed day recovered! Chain protected."
                          className="text-[10px] text-emerald-400 font-mono hidden sm:inline"
                        >
                          Recovered
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Placement & Recent DSA Quick Feed */}
          <Card
            title="Recent Problem Solves & Career Sprint"
            subtitle="Honest tracking: independent solves vs editorial lookups"
            action={
              <button
                onClick={() => setActiveTab('career')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                <span>Career Pipeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            }
          >
            {data.dsaProblems.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">
                <Code2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p>No DSA problems logged yet.</p>
                <button
                  onClick={() => setQuickAddOpen(true, 'dsa')}
                  className="mt-2 text-indigo-400 hover:underline"
                >
                  Log your first problem solve
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {data.dsaProblems.slice(0, 4).map(prob => (
                  <div
                    key={prob.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono text-slate-500 text-[11px]">{prob.date}</span>
                      <span className="font-semibold text-slate-200 truncate">{prob.name}</span>
                      <Badge
                        size="sm"
                        variant={
                          prob.difficulty === 'Hard'
                            ? 'danger'
                            : prob.difficulty === 'Medium'
                            ? 'warning'
                            : 'success'
                        }
                      >
                        {prob.difficulty}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        size="sm"
                        variant={
                          prob.status === 'Solved Independently' ? 'purple' : 'default'
                        }
                      >
                        {prob.status}
                      </Badge>
                      <span className="text-[11px] font-mono text-slate-400">{prob.timeSpentMinutes}m</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right (1 col): Weekly Consistency & Life Check-ins */}
        <div className="space-y-4">
          {/* Consistency Score Widget */}
          <Card
            title="Weekly Consistency Score"
            subtitle="Honest composite of habits, deep study & recovery"
          >
            <div className="flex flex-col items-center justify-center py-2">
              <DonutProgress
                percentage={consistency.score}
                color={
                  consistency.score >= 80
                    ? '#10b981'
                    : consistency.score >= 60
                    ? '#6366f1'
                    : '#f59e0b'
                }
                sublabel={consistency.label}
              />
            </div>

            <div className="mt-4 space-y-2 pt-3 border-t border-slate-800">
              {consistency.breakdown.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">{item.label}</span>
                    <span className="font-mono text-slate-300">
                      {item.score} / {item.max}
                    </span>
                  </div>
                  <ProgressBar
                    progress={(item.score / item.max) * 100}
                    size="sm"
                    color="bg-indigo-500"
                  />
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-500 mt-4 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
              💡 <span className="font-medium text-slate-400">Philosophy:</span> Missing a single day never breaks your score entirely. The algorithm values bounce-back resilience over superficial streaks.
            </p>
          </Card>

          {/* Today's Wellness & Physical Summary */}
          <Card title="Physical & Mental Snapshot">
            <div className="space-y-3 text-xs">
              {/* Mood & Sleep */}
              <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <div>
                    <p className="font-medium text-slate-200">Sleep & Energy</p>
                    <p className="text-[11px] text-slate-400">
                      {todayMood
                        ? `${todayMood.sleepHours}h sleep • Energy: ${todayMood.energy}/10`
                        : 'No sleep log yet today'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setQuickAddOpen(true, 'mood')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  {todayMood ? 'Edit' : 'Log'}
                </button>
              </div>

              {/* Workout & Cardio */}
              <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="font-medium text-slate-200">Physical Training</p>
                    <p className="text-[11px] text-slate-400">
                      {todayFitness
                        ? `${todayFitness.cardioMinutes || 0}m cardio / ${todayFitness.workouts?.length || 0} exercises`
                        : 'Rest or workout pending'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setQuickAddOpen(true, 'fitness')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  {todayFitness ? 'Edit' : 'Log'}
                </button>
              </div>

              {/* Placement Goals Snapshot */}
              <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4 text-purple-400" />
                  <div>
                    <p className="font-medium text-slate-200">Target Role</p>
                    <p className="text-[11px] text-slate-400">{data.profile.targetRole}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('career')}
                  className="text-xs text-purple-400 hover:text-purple-300 font-medium"
                >
                  View
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
