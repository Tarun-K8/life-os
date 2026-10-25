import React, { useState, useEffect } from 'react';
import {
  X,
  Code2,
  BookOpen,
  Clock,
  Activity,
  MessageSquare,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useLifeOs } from '../../context/LifeOsContext';
import { getTodayString } from '../../utils/dateUtils';
import { Platform, DsaTopic, Difficulty, ProblemStatus } from '../../types';

export const QuickAddModal: React.FC = () => {
  const {
    quickAddOpen,
    setQuickAddOpen,
    quickAddInitialType,
    addDsaProblem,
    addStudySession,
    saveMoodEntry,
    addSocialEntry,
    saveFitnessLog,
  } = useLifeOs();

  const [activeTab, setActiveTab] = useState<string>('dsa');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    if (quickAddInitialType) {
      setActiveTab(quickAddInitialType);
    }
  }, [quickAddInitialType, quickAddOpen]);

  // Form states
  // 1. DSA Form
  const [dsaName, setDsaName] = useState('');
  const [dsaPlatform, setDsaPlatform] = useState<Platform>('LeetCode');
  const [dsaTopic, setDsaTopic] = useState<DsaTopic>('Arrays & Hashing');
  const [dsaDifficulty, setDsaDifficulty] = useState<Difficulty>('Medium');
  const [dsaStatus, setDsaStatus] = useState<ProblemStatus>('Solved Independently');
  const [dsaTime, setDsaTime] = useState<number>(35);
  const [dsaUrl, setDsaUrl] = useState('');
  const [dsaLearnings, setDsaLearnings] = useState('');
  const [dsaRevisit, setDsaRevisit] = useState(false);

  // 2. Study Session Form
  const [studyCategory, setStudyCategory] = useState<'DSA Practice' | 'Core CS (OS/DBMS/CN)' | 'System Design' | 'Project Work' | 'Aptitude' | 'Interview Prep'>('DSA Practice');
  const [studyDuration, setStudyDuration] = useState<number>(60);
  const [studyNotes, setStudyNotes] = useState('');

  // 3. Mood Form
  const [moodRating, setMoodRating] = useState<number>(7);
  const [energyRating, setEnergyRating] = useState<number>(7);
  const [stressRating, setStressRating] = useState<number>(4);
  const [sleepHours, setSleepHours] = useState<number>(7.5);
  const [mainEmotion, setMainEmotion] = useState('Focused');
  const [wentWell, setWentWell] = useState('');
  const [madeDifficult, setMadeDifficult] = useState('');
  const [improvement, setImprovement] = useState('');

  // 4. Social & Chat Form
  const [chatTime, setChatTime] = useState<number>(30);
  const [chatPlanned, setChatPlanned] = useState<boolean>(true);
  const [chatInterrupted, setChatInterrupted] = useState<boolean>(false);
  const [chatFeeling, setChatFeeling] = useState<'Energized' | 'Neutral' | 'Drained' | 'Guilty' | 'Connected'>('Connected');
  const [chatMaintained, setChatMaintained] = useState<boolean>(true);
  const [chatDesc, setChatDesc] = useState('');
  const [chatNotes, setChatNotes] = useState('');

  // 5. Workout / Fitness Form
  const [fitWeight, setFitWeight] = useState<string>('');
  const [fitCardioTime, setFitCardioTime] = useState<number>(0);
  const [fitCardioType, setFitCardioType] = useState<'Badminton' | 'Gym Cardio' | 'Running' | 'Walking' | 'None'>('Badminton');
  const [fitNotes, setFitNotes] = useState('');

  const triggerSuccess = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
      setQuickAddOpen(false);
    }, 900);
  };

  const handleDsaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dsaName.trim()) return;

    addDsaProblem({
      date: getTodayString(),
      name: dsaName.trim(),
      platform: dsaPlatform,
      topic: dsaTopic,
      difficulty: dsaDifficulty,
      status: dsaStatus,
      timeSpentMinutes: Number(dsaTime) || 30,
      problemUrl: dsaUrl.trim() || undefined,
      keyLearnings: dsaLearnings.trim() || undefined,
      revisitNeeded: dsaRevisit,
    });

    // Auto-log study session for this problem if selected
    addStudySession({
      date: getTodayString(),
      category: 'DSA Practice',
      durationMinutes: Number(dsaTime) || 30,
      notes: `Solved ${dsaName} (${dsaDifficulty}, ${dsaStatus})`,
    });

    setDsaName('');
    setDsaLearnings('');
    setDsaUrl('');
    triggerSuccess('DSA problem & study time logged!');
  };

  const handleStudySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addStudySession({
      date: getTodayString(),
      category: studyCategory,
      durationMinutes: Number(studyDuration) || 45,
      notes: studyNotes.trim() || undefined,
    });
    setStudyNotes('');
    triggerSuccess('Study session saved!');
  };

  const handleMoodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMoodEntry({
      date: getTodayString(),
      mood: Number(moodRating),
      energy: Number(energyRating),
      stress: Number(stressRating),
      sleepHours: Number(sleepHours),
      mainEmotion,
      wentWell: wentWell.trim(),
      madeDifficult: madeDifficult.trim(),
      oneImprovementTomorrow: improvement.trim(),
    });
    triggerSuccess('Daily check-in recorded!');
  };

  const handleSocialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSocialEntry({
      date: getTodayString(),
      chatTimeMinutes: Number(chatTime) || 15,
      planned: chatPlanned,
      interruptedStudy: chatInterrupted,
      feltAfterward: chatFeeling,
      maintainedPriorities: chatMaintained,
      activityDescription: chatDesc.trim() || 'Chat / Social interaction',
      privateNotes: chatNotes.trim() || undefined,
    });
    setChatDesc('');
    setChatNotes('');
    triggerSuccess('Social attention entry saved!');
  };

  const handleFitnessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveFitnessLog({
      date: getTodayString(),
      bodyWeightKg: fitWeight ? Number(fitWeight) : undefined,
      sleepHours: Number(sleepHours),
      sleepConsistency: 'Good',
      cardioMinutes: Number(fitCardioTime) || 0,
      cardioType: fitCardioType,
      workouts: [],
      notes: fitNotes.trim() || undefined,
    });
    setFitNotes('');
    triggerSuccess('Fitness log saved!');
  };

  return (
    <Modal
      isOpen={quickAddOpen}
      onClose={() => setQuickAddOpen(false)}
      title="Quick Activity Logger"
      subtitle="Fast, friction-free tracking for your daily placement and life metrics"
      maxWidth="xl"
    >
      {/* Category selector */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800 mb-5 overflow-x-auto">
        {[
          { id: 'dsa', label: 'DSA Problem', icon: Code2 },
          { id: 'study', label: 'Study Session', icon: Clock },
          { id: 'mood', label: 'Daily Check-in', icon: BookOpen },
          { id: 'social', label: 'Social & Chat', icon: MessageSquare },
          { id: 'fitness', label: 'Fitness & Sleep', icon: Activity },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[100px] flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {successToast && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* DSA Form */}
      {activeTab === 'dsa' && (
        <form onSubmit={handleDsaSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Problem Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Trapping Rain Water, Course Schedule, LRU Cache"
              value={dsaName}
              onChange={e => setDsaName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Platform</label>
              <select
                value={dsaPlatform}
                onChange={e => setDsaPlatform(e.target.value as Platform)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="LeetCode">LeetCode</option>
                <option value="Striver Sheet">Striver Sheet</option>
                <option value="NeetCode">NeetCode</option>
                <option value="Codeforces">Codeforces</option>
                <option value="GeeksforGeeks">GeeksforGeeks</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Topic</label>
              <select
                value={dsaTopic}
                onChange={e => setDsaTopic(e.target.value as DsaTopic)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Arrays & Hashing">Arrays & Hashing</option>
                <option value="Two Pointers">Two Pointers</option>
                <option value="Sliding Window">Sliding Window</option>
                <option value="Binary Search">Binary Search</option>
                <option value="Trees & BST">Trees & BST</option>
                <option value="Graphs">Graphs</option>
                <option value="Dynamic Programming">Dynamic Programming</option>
                <option value="Recursion & Backtracking">Recursion & Backtracking</option>
                <option value="Stack & Queue">Stack & Queue</option>
                <option value="Linked List">Linked List</option>
                <option value="Greedy">Greedy</option>
                <option value="System Design">System Design</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-medium text-slate-300 mb-1">Difficulty</label>
              <select
                value={dsaDifficulty}
                onChange={e => setDsaDifficulty(e.target.value as Difficulty)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Honest Solve Status */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-300">
                Honest Solve Status <span className="text-rose-400">*</span>
              </label>
              <span className="text-[10px] text-amber-400/90 flex items-center gap-1">
                <HelpCircle className="w-3 h-3" />
                No fake metrics
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'Solved Independently', label: 'Solved Independently', desc: 'No solution peek' },
                { id: 'Solved with Hints / Editorial', label: 'With Editorial / Hint', desc: 'Checked approach' },
                { id: 'Attempted / Review Needed', label: 'Needs Review', desc: 'Stuck or timeout' },
              ].map(opt => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setDsaStatus(opt.id as ProblemStatus)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    dsaStatus === opt.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <p className="text-xs font-semibold">{opt.label}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Time Spent (Minutes)</label>
              <input
                type="number"
                min="5"
                max="240"
                value={dsaTime}
                onChange={e => setDsaTime(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Problem URL (Optional)</label>
              <input
                type="url"
                placeholder="https://leetcode.com/..."
                value={dsaUrl}
                onChange={e => setDsaUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Key Pattern / Reflection (What clicked?)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Inverted condition; two pointer approach requires sorting first..."
              value={dsaLearnings}
              onChange={e => setDsaLearnings(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-100 placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="revisit"
              checked={dsaRevisit}
              onChange={e => setDsaRevisit(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0"
            />
            <label htmlFor="revisit" className="text-xs text-slate-300">
              Flag for revision next week (Struggling topic)
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors shadow-md shadow-indigo-600/30"
          >
            Save DSA Problem
          </button>
        </form>
      )}

      {/* Study Session Form */}
      {activeTab === 'study' && (
        <form onSubmit={handleStudySubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Study Category</label>
            <select
              value={studyCategory}
              onChange={e => setStudyCategory(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-100"
            >
              <option value="DSA Practice">DSA Practice</option>
              <option value="Core CS (OS/DBMS/CN)">Core CS (OS / DBMS / Computer Networks)</option>
              <option value="System Design">System Design & Architecture</option>
              <option value="Project Work">Project Work / Engineering</option>
              <option value="Interview Prep">Interview Prep & Behavioral (STAR)</option>
              <option value="Aptitude">Aptitude & Logical Reasoning</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Focused Duration (Minutes)
            </label>
            <div className="flex items-center gap-2">
              {[25, 45, 60, 90, 120].map(mins => (
                <button
                  type="button"
                  key={mins}
                  onClick={() => setStudyDuration(mins)}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                    studyDuration === mins
                      ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
            <input
              type="number"
              min="5"
              max="480"
              value={studyDuration}
              onChange={e => setStudyDuration(Number(e.target.value))}
              className="mt-2 w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Session Notes (Optional)</label>
            <textarea
              rows={3}
              placeholder="e.g. Read through Operating System paging and virtual memory concepts; solved 5 questions."
              value={studyNotes}
              onChange={e => setStudyNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-100 placeholder:text-slate-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors shadow-md"
          >
            Log Focused Study Time
          </button>
        </form>
      )}

      {/* Mood & Journal Form */}
      {activeTab === 'mood' && (
        <form onSubmit={handleMoodSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Mood: <span className="font-mono text-indigo-400 font-bold">{moodRating}/10</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={moodRating}
                onChange={e => setMoodRating(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Energy: <span className="font-mono text-emerald-400 font-bold">{energyRating}/10</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={energyRating}
                onChange={e => setEnergyRating(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Stress: <span className="font-mono text-rose-400 font-bold">{stressRating}/10</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={stressRating}
                onChange={e => setStressRating(Number(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Sleep Duration (Hours)</label>
              <input
                type="number"
                step="0.5"
                min="3"
                max="14"
                value={sleepHours}
                onChange={e => setSleepHours(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Main Emotion</label>
              <input
                type="text"
                placeholder="e.g. Grounded, Anxious, Satisfied"
                value={mainEmotion}
                onChange={e => setMainEmotion(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-100"
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <div>
              <label className="block text-xs font-medium text-emerald-400">1. What went well today?</label>
              <input
                type="text"
                placeholder="e.g. Focused 2 solid hours without checking phone."
                value={wentWell}
                onChange={e => setWentWell(e.target.value)}
                className="mt-1 w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-amber-400">2. What made today difficult?</label>
              <input
                type="text"
                placeholder="e.g. Started afternoon study late due to chatting."
                value={madeDifficult}
                onChange={e => setMadeDifficult(e.target.value)}
                className="mt-1 w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-indigo-400">3. One small improvement for tomorrow?</label>
              <input
                type="text"
                placeholder="e.g. Put phone in drawer before opening IDE."
                value={improvement}
                onChange={e => setImprovement(e.target.value)}
                className="mt-1 w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-100"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors shadow-md"
          >
            Save Daily Reflection
          </button>
        </form>
      )}

      {/* Social & Chat Form */}
      {activeTab === 'social' && (
        <form onSubmit={handleSocialSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Approximate Chat / Social Time (Minutes)
            </label>
            <input
              type="number"
              min="5"
              max="600"
              value={chatTime}
              onChange={e => setChatTime(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Timing Type</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setChatPlanned(true)}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-medium ${
                    chatPlanned
                      ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Planned
                </button>
                <button
                  type="button"
                  onClick={() => setChatPlanned(false)}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-medium ${
                    !chatPlanned
                      ? 'bg-amber-950/60 border-amber-600 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Unplanned
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Interrupted Study?</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setChatInterrupted(false)}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-medium ${
                    !chatInterrupted
                      ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  No
                </button>
                <button
                  type="button"
                  onClick={() => setChatInterrupted(true)}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-medium ${
                    chatInterrupted
                      ? 'bg-rose-950/60 border-rose-600 text-rose-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Felt Afterward</label>
              <select
                value={chatFeeling}
                onChange={e => setChatFeeling(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-200"
              >
                <option value="Connected">Connected & Supported</option>
                <option value="Energized">Energized</option>
                <option value="Neutral">Neutral</option>
                <option value="Drained">Drained / Overwhelmed</option>
                <option value="Guilty">Guilty about lost time</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Maintained Priorities?</label>
              <select
                value={chatMaintained ? 'yes' : 'no'}
                onChange={e => setChatMaintained(e.target.value === 'yes')}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-200"
              >
                <option value="yes">Yes (Kept goals intact)</option>
                <option value="no">No (Lost track of schedule)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Interaction Brief</label>
            <input
              type="text"
              placeholder="e.g. Chat with college senior regarding interview tips"
              value={chatDesc}
              onChange={e => setChatDesc(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-100"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors shadow-md"
          >
            Log Social & Focus Record
          </button>
        </form>
      )}

      {/* Fitness Form */}
      {activeTab === 'fitness' && (
        <form onSubmit={handleFitnessSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Body Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 71.5"
                value={fitWeight}
                onChange={e => setFitWeight(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Cardio / Activity Type</label>
              <select
                value={fitCardioType}
                onChange={e => setFitCardioType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-200"
              >
                <option value="Badminton">Badminton</option>
                <option value="Gym Cardio">Gym Resistance / Weights</option>
                <option value="Running">Running / Jogging</option>
                <option value="Walking">Brisk Walking</option>
                <option value="None">Rest Day</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Session Duration (Minutes)</label>
            <input
              type="number"
              min="0"
              max="240"
              value={fitCardioTime}
              onChange={e => setFitCardioTime(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Workout Notes / Exercises</label>
            <textarea
              rows={2}
              placeholder="e.g. Back & Biceps: 3 sets pullups, 3 sets lat pulldowns. Feeling athletic and strong."
              value={fitNotes}
              onChange={e => setFitNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-100 placeholder:text-slate-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors shadow-md"
          >
            Save Fitness Log
          </button>
        </form>
      )}
    </Modal>
  );
};

export default QuickAddModal;
