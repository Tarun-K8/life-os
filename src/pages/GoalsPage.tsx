import React, { useState } from 'react';
import {
  Target,
  Plus,
  Calendar,
  CheckCircle2,
  Trash2,
  Edit2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Flame,
  Check,
} from 'lucide-react';
import { useLifeOs } from '../context/LifeOsContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { getTodayString, getPastDates, formatDisplayDate } from '../utils/dateUtils';
import { GoalPlan, GoalMilestone } from '../types';

export const GoalsPage: React.FC = () => {
  const { data, addGoal, editGoal, deleteGoal, toggleGoalMilestone } = useLifeOs();
  const todayStr = getTodayString();

  const [timeframeView, setTimeframeView] = useState<'all' | '30-day' | '90-day'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<GoalPlan | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [timeframe, setTimeframe] = useState<'30-day' | '90-day'>('90-day');
  const [category, setCategory] = useState<GoalPlan['category']>('Career & DSA');
  const [targetDate, setTargetDate] = useState('');
  const [actionsText, setActionsText] = useState('Solve 2 problems daily\nRevise weak topics every weekend');
  const [milestonesText, setMilestonesText] = useState('Complete LeetCode Top 100\nPass 3 Company Online Assessments\nShip portfolio system');
  const [reviewNotes, setReviewNotes] = useState('');

  const filteredGoals = data.goals.filter(g => {
    if (timeframeView === 'all') return true;
    return g.timeframe === timeframeView;
  });

  const openAddModal = (tf?: '30-day' | '90-day') => {
    setEditingGoal(null);
    setTitle('');
    setTimeframe(tf || '90-day');
    setCategory('Career & DSA');
    const futureDate = tf === '30-day' ? getPastDates(-30, todayStr)[0] : getPastDates(-90, todayStr)[0];
    setTargetDate(futureDate || '2026-12-31');
    setActionsText('Daily 2 hours DSA practice\nSleep 7.5 hours nightly');
    setMilestonesText('Phase 1 Milestone\nPhase 2 Milestone\nFinal Delivery');
    setReviewNotes('');
    setModalOpen(true);
  };

  const openEditModal = (goal: GoalPlan) => {
    setEditingGoal(goal);
    setTitle(goal.title);
    setTimeframe(goal.timeframe);
    setCategory(goal.category);
    setTargetDate(goal.targetDate);
    setActionsText(goal.dailyWeeklyActions.join('\n'));
    setMilestonesText(goal.milestones.map(m => m.title).join('\n'));
    setReviewNotes(goal.reviewNotes || '');
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const actions = actionsText.split('\n').map(s => s.trim()).filter(Boolean);
    const milestones: GoalMilestone[] = milestonesText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)
      .map((t, idx) => {
        // preserve existing completed state if editing
        const existing = editingGoal?.milestones[idx];
        return {
          id: existing ? existing.id : `m-${Date.now()}-${idx}`,
          title: t,
          done: existing ? existing.done : false,
        };
      });

    const doneCount = milestones.filter(m => m.done).length;
    const progress = milestones.length > 0 ? Math.round((doneCount / milestones.length) * 100) : 0;

    if (editingGoal) {
      editGoal({
        ...editingGoal,
        title: title.trim(),
        timeframe,
        category,
        targetDate,
        dailyWeeklyActions: actions,
        milestones,
        progress,
        reviewNotes: reviewNotes.trim() || undefined,
      });
    } else {
      addGoal({
        title: title.trim(),
        timeframe,
        category,
        startDate: todayStr,
        targetDate: targetDate || '2026-12-31',
        progress: 0,
        dailyWeeklyActions: actions,
        milestones,
        reviewNotes: reviewNotes.trim() || undefined,
        status: 'Active',
      });
    }

    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            30-Day & 90-Day Placement Trajectories
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Break macro career aspirations into concrete milestones and repeatable daily habits. A missed day is an iteration, not failure.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openAddModal('30-day')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-400" />
            <span>+ 30-Day Goal</span>
          </button>
          <button
            onClick={() => openAddModal('90-day')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ 90-Day Goal</span>
          </button>
        </div>
      </div>

      {/* Resilience Mindset Note */}
      <div className="p-4 rounded-xl bg-[#111522] border border-[#1f263d] flex items-start gap-3 text-xs">
        <Sparkles className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-semibold text-slate-200">The 90-Day Engineering Mindset</h4>
          <p className="text-slate-400 leading-relaxed">
            In 90 days, you can solve 180 DSA mediums, master Operating Systems & DBMS, and construct a high-impact portfolio system. Do not treat a single off-day as a reason to abandon the plan. Compound progress is robust against occasional turbulence.
          </p>
        </div>
      </div>

      {/* Timeframe Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1f263d] pb-2">
        {[
          { id: 'all', label: 'All Plans', count: data.goals.length },
          { id: '30-day', label: '30-Day Sprints', count: data.goals.filter(g => g.timeframe === '30-day').length },
          { id: '90-day', label: '90-Day Trajectories', count: data.goals.filter(g => g.timeframe === '90-day').length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setTimeframeView(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              timeframeView === tab.id
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Goals Grid */}
      {filteredGoals.length === 0 ? (
        <EmptyState
          icon={<Target className="w-6 h-6 text-indigo-400" />}
          title="No Goals Created in this View"
          description="Create structured 30 or 90-day goals with incremental milestones and daily habits."
          actionText="Create 90-Day Goal"
          onAction={() => openAddModal('90-day')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGoals.map(goal => (
            <Card
              key={goal.id}
              title={goal.title}
              subtitle={`${goal.timeframe} • Target: ${goal.targetDate}`}
              action={
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      goal.category === 'Career & DSA'
                        ? 'purple'
                        : goal.category === 'Fitness & Body'
                        ? 'success'
                        : 'info'
                    }
                    size="sm"
                  >
                    {goal.category}
                  </Badge>
                  <button
                    onClick={() => openEditModal(goal)}
                    className="text-slate-400 hover:text-indigo-300 p-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${goal.title}"?`)) {
                        deleteGoal(goal.id);
                      }
                    }}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              }
            >
              <div className="space-y-4 text-xs">
                {/* Progress */}
                <ProgressBar progress={goal.progress} showLabel label="Milestone Completion" />

                {/* Milestones checklist */}
                <div className="space-y-1.5">
                  <p className="font-semibold text-slate-300 text-[11px] uppercase tracking-wider">
                    Key Milestones:
                  </p>
                  {goal.milestones.map(m => (
                    <div
                      key={m.id}
                      onClick={() => toggleGoalMilestone(goal.id, m.id)}
                      className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/60 hover:bg-slate-900 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={m.done}
                        onChange={() => {}}
                        className="rounded bg-slate-800 border-slate-700 text-indigo-600 pointer-events-none"
                      />
                      <span className={m.done ? 'line-through text-slate-500' : 'text-slate-200'}>
                        {m.title}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Daily actions */}
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <p className="font-semibold text-indigo-400 text-[11px]">Daily / Weekly Actions:</p>
                  <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                    {goal.dailyWeeklyActions.map((action, aIdx) => (
                      <li key={aIdx} className="leading-relaxed truncate">
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                {goal.reviewNotes && (
                  <p className="text-slate-400 italic bg-slate-900/40 p-2 rounded border border-slate-800">
                    "{goal.reviewNotes}"
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Goal Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingGoal ? 'Edit Goal' : 'Create 30 / 90-Day Goal'}
        subtitle="Clarify your engineering placement or fitness roadmap"
        maxWidth="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Goal Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Master Graphs & DP + Clear 2 Placement OAs"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Timeframe</label>
              <select
                value={timeframe}
                onChange={e => setTimeframe(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200"
              >
                <option value="30-day">30-Day Sprint</option>
                <option value="90-day">90-Day Trajectory</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200"
              >
                <option value="Career & DSA">Career & DSA</option>
                <option value="Fitness & Body">Fitness & Body</option>
                <option value="Mental & Habits">Mental & Habits</option>
                <option value="Social & Focus">Social & Focus</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Target Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={e => setTargetDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Milestones (One per line)
            </label>
            <textarea
              rows={3}
              placeholder="Complete Striver SDE sheet DP section&#10;Conduct 2 peer mock interviews&#10;Deploy full stack project"
              value={milestonesText}
              onChange={e => setMilestonesText(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Daily / Weekly Actions (One per line)
            </label>
            <textarea
              rows={2}
              placeholder="Solve 2 medium problems every morning&#10;Review struggling topics on Saturday"
              value={actionsText}
              onChange={e => setActionsText(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Review Notes / Philosophy
            </label>
            <input
              type="text"
              placeholder="e.g. Focus on understanding algorithm mechanics, not raw question counts."
              value={reviewNotes}
              onChange={e => setReviewNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md transition-colors"
          >
            {editingGoal ? 'Update Goal' : 'Lock in Goal'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default GoalsPage;
