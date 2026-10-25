import React, { useState } from 'react';
import {
  Plus,
  CheckCircle2,
  Flame,
  Calendar,
  Trash2,
  Edit2,
  Sparkles,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { useLifeOs } from '../context/LifeOsContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import {
  getTodayString,
  getCurrentWeekDates,
  getPastDates,
  calculateHabitStreak,
  formatDisplayDate,
} from '../utils/dateUtils';
import { Habit } from '../types';

export const HabitsPage: React.FC = () => {
  const { data, addHabit, editHabit, deleteHabit, toggleHabit } = useLifeOs();
  const todayStr = getTodayString();
  const currentWeek = getCurrentWeekDates();
  const past30Days = getPastDates(30, todayStr);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Habit['category']>('DSA');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#6366f1');

  const openAddModal = () => {
    setEditingHabit(null);
    setName('');
    setCategory('DSA');
    setDescription('');
    setColor('#6366f1');
    setModalOpen(true);
  };

  const openEditModal = (h: Habit) => {
    setEditingHabit(h);
    setName(h.name);
    setCategory(h.category);
    setDescription(h.description || '');
    setColor(h.color || '#6366f1');
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingHabit) {
      editHabit({
        ...editingHabit,
        name: name.trim(),
        category,
        description: description.trim() || undefined,
        color,
      });
    } else {
      addHabit({
        name: name.trim(),
        category,
        description: description.trim() || undefined,
        color,
      });
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            Daily Habits & Rhythm
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
            Progress is forged in small, protected routines. Built-in missed-day recovery ensures a single hectic day never breaks your identity or momentum.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Habit</span>
        </button>
      </div>

      {/* Week overview bar */}
      <div className="bg-[#111522] border border-[#1f263d] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <span>Current Week Schedule (Mon - Sun):</span>
        </div>
        <div className="flex items-center gap-2">
          {currentWeek.map(day => (
            <div
              key={day.date}
              className={`flex flex-col items-center px-2.5 py-1 rounded-lg text-center ${
                day.isToday
                  ? 'bg-indigo-600/20 border border-indigo-500 text-indigo-300 font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400'
              }`}
            >
              <span className="text-[10px] uppercase font-mono">{day.dayName}</span>
              <span className="text-xs font-mono font-medium">{day.date.split('-')[2]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Habits Grid */}
      <div className="space-y-3">
        {data.habits.map(habit => {
          const streakInfo = calculateHabitStreak(habit.completions, todayStr);
          const isDoneToday = habit.completions[todayStr]?.completed;

          return (
            <Card
              key={habit.id}
              noPadding
              className="p-4 sm:p-5 hover:border-slate-700 transition-all"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                {/* Left info */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <button
                    onClick={() => toggleHabit(habit.id, todayStr)}
                    className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                      isDoneToday
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                        : 'bg-slate-900 border-slate-700 text-transparent hover:border-indigo-400'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        className={`text-sm font-semibold truncate ${
                          isDoneToday ? 'text-slate-300' : 'text-slate-100'
                        }`}
                      >
                        {habit.name}
                      </h3>
                      <Badge size="sm" variant="default">
                        {habit.category}
                      </Badge>
                      {habit.isDefault && (
                        <span className="text-[10px] text-slate-500 font-mono">Core</span>
                      )}
                    </div>
                    {habit.description && (
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                        {habit.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* 7-day completion strip for this habit */}
                <div className="flex items-center gap-1.5 self-center lg:self-auto">
                  {currentWeek.map(day => {
                    const isChecked = habit.completions[day.date]?.completed;
                    return (
                      <button
                        key={day.date}
                        onClick={() => toggleHabit(habit.id, day.date)}
                        title={`${habit.name} on ${day.date}: ${isChecked ? 'Completed' : 'Missed'}`}
                        className={`w-7 h-7 rounded-lg text-xs font-mono flex items-center justify-center transition-all border ${
                          isChecked
                            ? 'bg-emerald-950/80 border-emerald-600/80 text-emerald-300 font-bold'
                            : day.isToday
                            ? 'bg-slate-900 border-indigo-500/60 text-slate-500 hover:text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-600 hover:text-slate-300'
                        }`}
                      >
                        {isChecked ? '✓' : day.dayName.charAt(0)}
                      </button>
                    );
                  })}
                </div>

                {/* Streak stats & actions */}
                <div className="flex items-center justify-between lg:justify-end gap-3 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-800/40 text-amber-300 text-xs font-mono font-bold">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>{streakInfo.currentStreak}d streak</span>
                    </div>
                    {streakInfo.recovered && (
                      <span
                        title="1 missed day was recovered without streak penalty!"
                        className="text-[10px] text-emerald-400 font-mono bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40"
                      >
                        Recovered
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-slate-400">
                    <button
                      onClick={() => openEditModal(habit)}
                      className="p-1.5 rounded-lg hover:text-slate-200 hover:bg-slate-800"
                      title="Edit Habit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${habit.name}"? Historical logs will be removed.`)) {
                          deleteHabit(habit.id);
                        }
                      }}
                      className="p-1.5 rounded-lg hover:text-rose-400 hover:bg-slate-800"
                      title="Delete Habit"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Habit Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingHabit ? 'Edit Habit' : 'Create Custom Habit'}
        subtitle="Establish routines aligned with your engineering, fitness, or focus priorities"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Habit Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Read Tech Blog / System Design Chapter"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200"
              >
                <option value="DSA">DSA Practice</option>
                <option value="Career">Career & Placement</option>
                <option value="Project">Project & Code</option>
                <option value="Fitness">Fitness & Health</option>
                <option value="Mindset">Mindset & Journal</option>
                <option value="Lifestyle">Sleep & Lifestyle</option>
                <option value="Social">Social Balance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Theme Accent</label>
              <div className="flex items-center gap-2 pt-1">
                {['#6366f1', '#38bdf8', '#10b981', '#ec4899', '#f59e0b', '#a855f7'].map(c => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                      color === c ? 'border-white scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Purpose / Description
            </label>
            <textarea
              rows={2}
              placeholder="Why this habit matters and what minimum completion looks like..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md transition-colors"
          >
            {editingHabit ? 'Update Habit' : 'Create Habit'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default HabitsPage;
