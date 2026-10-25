import React, { useState } from 'react';
import {
  MessageSquare,
  ShieldCheck,
  Plus,
  AlertCircle,
  HeartHandshake,
  Trash2,
  Edit2,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';
import { useLifeOs } from '../context/LifeOsContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { getTodayString, getCurrentWeekDates } from '../utils/dateUtils';
import { SocialAttentionEntry } from '../types';

export const SocialFocusPage: React.FC = () => {
  const { data, addSocialEntry, editSocialEntry, deleteSocialEntry } = useLifeOs();
  const todayStr = getTodayString();
  const currentWeek = getCurrentWeekDates();
  const weekDates = currentWeek.map(w => w.date);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<SocialAttentionEntry | null>(null);

  // Form states
  const [date, setDate] = useState(todayStr);
  const [chatMinutes, setChatMinutes] = useState<number>(30);
  const [planned, setPlanned] = useState<boolean>(true);
  const [interrupted, setInterrupted] = useState<boolean>(false);
  const [feltAfterward, setFeltAfterward] = useState<SocialAttentionEntry['feltAfterward']>('Connected');
  const [maintained, setMaintained] = useState<boolean>(true);
  const [desc, setDesc] = useState('');
  const [privateNotes, setPrivateNotes] = useState('');

  // Weekly calculations
  const weekEntries = data.socialAttention.filter(s => weekDates.includes(s.date));
  const totalWeekMinutes = weekEntries.reduce((acc, s) => acc + s.chatTimeMinutes, 0);
  const plannedMinutes = weekEntries.filter(s => s.planned).reduce((acc, s) => acc + s.chatTimeMinutes, 0);
  const unplannedMinutes = weekEntries.filter(s => !s.planned).reduce((acc, s) => acc + s.chatTimeMinutes, 0);
  const interruptionCount = weekEntries.filter(s => s.interruptedStudy).length;
  const plannedRatio = totalWeekMinutes > 0 ? Math.round((plannedMinutes / totalWeekMinutes) * 100) : 100;

  const openAddModal = () => {
    setEditingEntry(null);
    setDate(todayStr);
    setChatMinutes(30);
    setPlanned(true);
    setInterrupted(false);
    setFeltAfterward('Connected');
    setMaintained(true);
    setDesc('');
    setPrivateNotes('');
    setModalOpen(true);
  };

  const openEditModal = (entry: SocialAttentionEntry) => {
    setEditingEntry(entry);
    setDate(entry.date);
    setChatMinutes(entry.chatTimeMinutes);
    setPlanned(entry.planned);
    setInterrupted(entry.interruptedStudy);
    setFeltAfterward(entry.feltAfterward);
    setMaintained(entry.maintainedPriorities);
    setDesc(entry.activityDescription);
    setPrivateNotes(entry.privateNotes || '');
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEntry) {
      editSocialEntry({
        ...editingEntry,
        date,
        chatTimeMinutes: Number(chatMinutes) || 15,
        planned,
        interruptedStudy: interrupted,
        feltAfterward,
        maintainedPriorities: maintained,
        activityDescription: desc.trim() || 'Conversation / Socializing',
        privateNotes: privateNotes.trim() || undefined,
      });
    } else {
      addSocialEntry({
        date,
        chatTimeMinutes: Number(chatMinutes) || 15,
        planned,
        interruptedStudy: interrupted,
        feltAfterward,
        maintainedPriorities: maintained,
        activityDescription: desc.trim() || 'Conversation / Socializing',
        privateNotes: privateNotes.trim() || undefined,
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
            Social Life & Attention Protection
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Cultivate intentional connections without letting mindless reactive chatting disrupt your focus. This is about balance, not isolation.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Log Social Activity</span>
        </button>
      </div>

      {/* Ethical Statement & Philosophy */}
      <div className="p-4 rounded-xl bg-[#111522] border border-[#1f263d] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
        <div className="flex items-start gap-3">
          <HeartHandshake className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="font-semibold text-slate-200">The Focus-Connection Harmony Principle</h4>
            <p className="text-slate-400 leading-relaxed max-w-2xl">
              Engineering students need supportive friends and decompression. LIFE OS does not shame you for spending time with people or count message frequencies. Its sole purpose is to help you distinguish between high-value intentional bonding vs unconscious distraction loops.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800/40 whitespace-nowrap">
          <ShieldCheck className="w-4 h-4" />
          <span>Zero Contact Scrapes</span>
        </div>
      </div>

      {/* Weekly Attention Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card noPadding className="p-4">
          <span className="text-xs text-slate-400">Total Chat This Week</span>
          <div className="text-2xl font-bold font-mono text-slate-100 mt-1">
            {Math.round(totalWeekMinutes / 60)}h {totalWeekMinutes % 60}m
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">
            Avg ~{Math.round(totalWeekMinutes / 7)}m / day
          </p>
        </Card>

        <Card noPadding className="p-4">
          <span className="text-xs text-slate-400">Planned vs Spontaneous</span>
          <div className="text-2xl font-bold font-mono text-indigo-400 mt-1">
            {plannedRatio}%
          </div>
          <ProgressBar progress={plannedRatio} size="sm" className="mt-2" />
        </Card>

        <Card noPadding className="p-4">
          <span className="text-xs text-slate-400">Study Interruptions</span>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
            {interruptionCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {interruptionCount === 0 ? 'Zero study leaks!' : 'Sessions derailed by chat'}
          </p>
        </Card>

        <Card noPadding className="p-4">
          <span className="text-xs text-slate-400">Unplanned Chatter</span>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
            {unplannedMinutes}m
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Impulsive group chat scrolls</p>
        </Card>
      </div>

      {/* Social Log History */}
      <Card
        title="Recent Social & Conversation Records"
        subtitle="Reflect on whether interactions replenished your spirit or compromised your priorities"
      >
        {data.socialAttention.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="w-6 h-6 text-indigo-400" />}
            title="No Social Attention Entries Yet"
            description="Log your daily conversations, phone calls, or group chats to understand how they impact your study momentum."
            actionText="Log First Social Activity"
            onAction={openAddModal}
          />
        ) : (
          <div className="space-y-3">
            {data.socialAttention.map(entry => (
              <div
                key={entry.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-slate-400">{entry.date}</span>
                    <span className="font-semibold text-slate-200">{entry.activityDescription}</span>
                    <Badge variant={entry.planned ? 'success' : 'warning'} size="sm">
                      {entry.planned ? 'Planned' : 'Unplanned'}
                    </Badge>
                    <Badge
                      variant={
                        entry.feltAfterward === 'Connected' || entry.feltAfterward === 'Energized'
                          ? 'success'
                          : entry.feltAfterward === 'Drained' || entry.feltAfterward === 'Guilty'
                          ? 'danger'
                          : 'default'
                      }
                      size="sm"
                    >
                      Felt: {entry.feltAfterward}
                    </Badge>
                    {entry.interruptedStudy && (
                      <Badge variant="danger" size="sm">Interrupted Study</Badge>
                    )}
                  </div>

                  {entry.privateNotes && (
                    <p className="text-slate-400 bg-slate-950/40 p-2 rounded border border-slate-800/80 max-w-2xl leading-relaxed">
                      {entry.privateNotes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className="font-mono text-slate-300 font-bold">{entry.chatTimeMinutes}m</span>
                  <button
                    onClick={() => openEditModal(entry)}
                    className="p-1 text-slate-400 hover:text-indigo-300"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this social record?')) {
                        deleteSocialEntry(entry.id);
                      }
                    }}
                    className="p-1 text-slate-500 hover:text-rose-400"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Social Log Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingEntry ? 'Edit Social Activity' : 'Log Social Activity / Chat'}
        subtitle="Mindful reflection on your interactions and priorities"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Approx. Time (Minutes)</label>
              <input
                type="number"
                min="5"
                max="600"
                value={chatMinutes}
                onChange={e => setChatMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Was this planned?</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPlanned(true)}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-medium ${
                    planned ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Yes (Planned)
                </button>
                <button
                  type="button"
                  onClick={() => setPlanned(false)}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-medium ${
                    !planned ? 'bg-amber-950/60 border-amber-600 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  No (Spontaneous)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Interrupted Study Block?</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setInterrupted(false)}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-medium ${
                    !interrupted ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  No
                </button>
                <button
                  type="button"
                  onClick={() => setInterrupted(true)}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-medium ${
                    interrupted ? 'bg-rose-950/60 border-rose-600 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">How did you feel afterward?</label>
              <select
                value={feltAfterward}
                onChange={e => setFeltAfterward(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200"
              >
                <option value="Connected">Connected & Supported</option>
                <option value="Energized">Energized</option>
                <option value="Neutral">Neutral</option>
                <option value="Drained">Drained / Overstimulated</option>
                <option value="Guilty">Guilty about lost time</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Maintained Priorities?</label>
              <select
                value={maintained ? 'yes' : 'no'}
                onChange={e => setMaintained(e.target.value === 'yes')}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200"
              >
                <option value="yes">Yes (Kept goals intact)</option>
                <option value="no">No (Lost track of schedule)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Brief Description</label>
            <input
              type="text"
              placeholder="e.g. Dinner catchup with engineering friends"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Private Reflection Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Any takeaways or boundaries to enforce next time..."
              value={privateNotes}
              onChange={e => setPrivateNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md"
          >
            {editingEntry ? 'Update Social Entry' : 'Save Social Record'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default SocialFocusPage;
