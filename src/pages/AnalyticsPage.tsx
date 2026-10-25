import React, { useState } from 'react';
import {
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Target,
  Sparkles,
  Save,
  Clock,
  Code2,
  Activity,
  Moon,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { useLifeOs } from '../context/LifeOsContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { DonutProgress } from '../components/common/Charts';
import { computeWeeklyAnalytics } from '../utils/analyticsUtils';
import { getCurrentWeekDates, getTodayString } from '../utils/dateUtils';

export const AnalyticsPage: React.FC = () => {
  const { data, saveWeeklyReview } = useLifeOs();
  const report = computeWeeklyAnalytics(data);
  const currentWeek = getCurrentWeekDates();
  const weekStart = currentWeek[0]?.date || getTodayString();
  const weekEnd = currentWeek[6]?.date || getTodayString();

  // Saved reviews
  const existingReview = data.weeklyReviews.find(r => r.weekStartDate === weekStart);

  const [priority1, setPriority1] = useState(
    existingReview?.prioritiesForNextWeek[0] || report.suggestedPriorities[0]
  );
  const [priority2, setPriority2] = useState(
    existingReview?.prioritiesForNextWeek[1] || report.suggestedPriorities[1]
  );
  const [priority3, setPriority3] = useState(
    existingReview?.prioritiesForNextWeek[2] || report.suggestedPriorities[2]
  );
  const [reflectionNotes, setReflectionNotes] = useState(existingReview?.reflectionNotes || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    saveWeeklyReview({
      weekStartDate: weekStart,
      weekEndDate: weekEnd,
      prioritiesForNextWeek: [priority1, priority2, priority3],
      reflectionNotes: reflectionNotes.trim() || undefined,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            Analytics & Weekly Retrospective
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Honest, objective feedback on your placement preparation, habit adherence, and attention management. No artificial scores.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
          <span>Week: {report.weekRange}</span>
        </div>
      </div>

      {/* Honest Scorecard Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card noPadding className="p-3.5">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Study Hours</span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-100 mt-1">
            {report.totalStudyHours}h
          </div>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">
            Target: {data.profile.dailyStudyTargetHours * 7}h/wk
          </p>
        </Card>

        <Card noPadding className="p-3.5">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <Code2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Pure DSA Solves</span>
          </div>
          <div className="text-xl font-bold font-mono text-purple-400 mt-1">
            {report.dsaIndependentlySolved}
          </div>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">
            Total solved: {report.dsaTotalSolved}
          </p>
        </Card>

        <Card noPadding className="p-3.5">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Habits Done</span>
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            {report.habitCompletionRate}%
          </div>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">Across all habits</p>
        </Card>

        <Card noPadding className="p-3.5">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <Activity className="w-3.5 h-3.5 text-rose-400" />
            <span>Workouts</span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-100 mt-1">
            {report.workoutCount}
          </div>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">Gym / Badminton</p>
        </Card>

        <Card noPadding className="p-3.5">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <Moon className="w-3.5 h-3.5 text-indigo-400" />
            <span>Avg Sleep</span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-100 mt-1">
            {report.avgSleepHours > 0 ? `${report.avgSleepHours}h` : '—'}
          </div>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">
            Mood: {report.avgMood > 0 ? `${report.avgMood}/10` : '—'}
          </p>
        </Card>

        <Card noPadding className="p-3.5">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            <span>Unplanned Chat</span>
          </div>
          <div className="text-xl font-bold font-mono text-amber-400 mt-1">
            {Math.round(report.totalUnplannedChatMinutes / 60)}h {report.totalUnplannedChatMinutes % 60}m
          </div>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">Distraction time</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Consistent & Areas Needing Attention */}
        <div className="space-y-4">
          <Card title="Consistent Habits & Strengths" icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}>
            {report.mostConsistentHabits.length === 0 ? (
              <p className="text-xs text-slate-400 py-3">
                Log completions across this week to highlight your top habits.
              </p>
            ) : (
              <div className="space-y-2">
                {report.mostConsistentHabits.map((habitText, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-xs text-emerald-300 flex items-center justify-between"
                  >
                    <span className="font-medium">{habitText}</span>
                    <Badge variant="success" size="sm">High Adherence</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="Areas Needing Realistic Attention" icon={<AlertTriangle className="w-4 h-4 text-amber-400" />}>
            <div className="space-y-2">
              {report.areasNeedingAttention.map((area, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-amber-950/20 border border-amber-900/40 text-xs text-amber-200 leading-relaxed flex items-start gap-2.5"
                >
                  <span className="text-amber-400 font-bold mt-0.5">•</span>
                  <span>{area}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Correlations Discovery */}
          <Card title="Correlations & System Feedback">
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[11px] font-mono text-indigo-400 font-semibold block mb-1">
                  Sleep & Mood Synergy:
                </span>
                <p className="text-slate-300 leading-relaxed">{report.correlations.sleepVsMood}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[11px] font-mono text-emerald-400 font-semibold block mb-1">
                  Attention & Focus Boundary:
                </span>
                <p className="text-slate-300 leading-relaxed">{report.correlations.focusVsDistraction}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Three Realistic Priorities For Next Week */}
        <div className="space-y-4">
          <Card
            title="3 Realistic Priorities for Next Week"
            subtitle="Editable commitments tailored to close placement & habit gaps"
          >
            <form onSubmit={handleSaveReview} className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-indigo-400 mb-1">
                    Priority 1: Core Career / DSA
                  </label>
                  <input
                    type="text"
                    required
                    value={priority1}
                    onChange={e => setPriority1(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-400 mb-1">
                    Priority 2: Focus & Study Rhythm
                  </label>
                  <input
                    type="text"
                    required
                    value={priority2}
                    onChange={e => setPriority2(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-rose-400 mb-1">
                    Priority 3: Physical Stamina / Recovery
                  </label>
                  <input
                    type="text"
                    required
                    value={priority3}
                    onChange={e => setPriority3(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Personal Retrospective Notes (What will I do differently?)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Reflect on this past week's highs, mistakes, and mindset adjustments..."
                    value={reflectionNotes}
                    onChange={e => setReflectionNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                {savedSuccess && (
                  <span className="text-xs text-emerald-400 font-medium">
                    ✓ Weekly priorities saved for next sprint!
                  </span>
                )}
                <button
                  type="submit"
                  className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md transition-all active:scale-95"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Lock In Priorities</span>
                </button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
