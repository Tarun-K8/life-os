import React, { useState } from 'react';
import {
  BookOpen,
  Smile,
  Zap,
  Flame,
  ShieldCheck,
  Moon,
  Sparkles,
  Search,
  Trash2,
  Edit2,
  TrendingUp,
  Brain,
  Info,
} from 'lucide-react';
import { useLifeOs } from '../context/LifeOsContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { MetricLineChart } from '../components/common/Charts';
import { EmptyState } from '../components/common/EmptyState';
import { getTodayString, getPastDates, formatDisplayDate } from '../utils/dateUtils';
import { MoodJournalEntry } from '../types';

export const MoodJournalPage: React.FC = () => {
  const { data, saveMoodEntry, deleteMoodEntry, setQuickAddOpen } = useLifeOs();
  const todayStr = getTodayString();
  const todayEntry = data.moodJournal.find(m => m.date === todayStr);

  // Form states
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [mood, setMood] = useState<number>(todayEntry ? todayEntry.mood : 7);
  const [energy, setEnergy] = useState<number>(todayEntry ? todayEntry.energy : 7);
  const [stress, setStress] = useState<number>(todayEntry ? todayEntry.stress : 4);
  const [sleepHours, setSleepHours] = useState<number>(todayEntry ? todayEntry.sleepHours : 7.5);
  const [mainEmotion, setMainEmotion] = useState<string>(todayEntry ? todayEntry.mainEmotion : 'Focused');
  const [wentWell, setWentWell] = useState<string>(todayEntry ? todayEntry.wentWell : '');
  const [madeDifficult, setMadeDifficult] = useState<string>(todayEntry ? todayEntry.madeDifficult : '');
  const [improvement, setImprovement] = useState<string>(todayEntry ? todayEntry.oneImprovementTomorrow : '');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Trend timeframe
  const [trendDays, setTrendDays] = useState<number>(14);
  const [historySearch, setHistorySearch] = useState<string>('');

  const pastDates = getPastDates(trendDays, todayStr);

  // Prepare line chart data
  const moodChartSeries = [
    {
      name: 'Mood',
      color: '#6366f1',
      data: pastDates.map(date => {
        const entry = data.moodJournal.find(m => m.date === date);
        return {
          label: date.split('-').slice(1).join('/'),
          value: entry ? entry.mood : 5, // fallback neutral
        };
      }),
    },
    {
      name: 'Energy',
      color: '#10b981',
      data: pastDates.map(date => {
        const entry = data.moodJournal.find(m => m.date === date);
        return {
          label: date.split('-').slice(1).join('/'),
          value: entry ? entry.energy : 5,
        };
      }),
    },
    {
      name: 'Stress',
      color: '#f43f5e',
      data: pastDates.map(date => {
        const entry = data.moodJournal.find(m => m.date === date);
        return {
          label: date.split('-').slice(1).join('/'),
          value: entry ? entry.stress : 5,
        };
      }),
    },
  ];

  // Correlation analysis
  const totalEntries = data.moodJournal.length;
  let patternInsight = "Log at least 3 daily check-ins to unlock correlations between your sleep, workouts, and energy levels.";
  if (totalEntries >= 3) {
    const highSleepDays = data.moodJournal.filter(m => m.sleepHours >= 7.5);
    const lowSleepDays = data.moodJournal.filter(m => m.sleepHours < 7.5);

    if (highSleepDays.length > 0 && lowSleepDays.length > 0) {
      const highMoodAvg = (highSleepDays.reduce((a, b) => a + b.mood, 0) / highSleepDays.length).toFixed(1);
      const lowMoodAvg = (lowSleepDays.reduce((a, b) => a + b.mood, 0) / lowSleepDays.length).toFixed(1);
      patternInsight = `Sleep Impact: On days with >= 7.5h sleep, your average mood was ${highMoodAvg}/10 compared to ${lowMoodAvg}/10 on sub-7.5h days. Quality sleep directly fuels your emotional bandwidth.`;
    } else {
      patternInsight = "Consistent sleep baseline detected. Notice if days with afternoon study sessions report higher energy.";
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMoodEntry({
      date: selectedDate,
      mood: Number(mood),
      energy: Number(energy),
      stress: Number(stress),
      sleepHours: Number(sleepHours),
      mainEmotion: mainEmotion.trim() || 'Neutral',
      wentWell: wentWell.trim(),
      madeDifficult: madeDifficult.trim(),
      oneImprovementTomorrow: improvement.trim(),
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const loadEntryForEdit = (entry: MoodJournalEntry) => {
    setSelectedDate(entry.date);
    setMood(entry.mood);
    setEnergy(entry.energy);
    setStress(entry.stress);
    setSleepHours(entry.sleepHours);
    setMainEmotion(entry.mainEmotion);
    setWentWell(entry.wentWell);
    setMadeDifficult(entry.madeDifficult);
    setImprovement(entry.oneImprovementTomorrow);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredHistory = data.moodJournal.filter(m => {
    if (!historySearch.trim()) return true;
    const q = historySearch.toLowerCase();
    return (
      m.mainEmotion.toLowerCase().includes(q) ||
      m.wentWell.toLowerCase().includes(q) ||
      m.madeDifficult.toLowerCase().includes(q) ||
      m.oneImprovementTomorrow.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            Mindset, Mood & Daily Journal
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            A private reflection mirror. Non-judgmental daily self-awareness to uncover patterns between sleep, cognitive fatigue, and focus.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Local Device Only • Private</span>
        </div>
      </div>

      {/* Privacy Notice Banner */}
      <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-900/50 flex items-start gap-3 text-xs text-indigo-300">
        <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-semibold text-slate-200">Reflection Tool Disclaimer:</span> This is a personal self-reflection system, not a diagnostic or clinical therapy application. Your notes remain completely on your machine and are never shared or sent to AI APIs without explicit intent.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Daily Check-in Form */}
        <div className="lg:col-span-2 space-y-4">
          <Card
            title={selectedDate === todayStr ? "Today's Evening Reflection" : `Reflection for ${selectedDate}`}
            subtitle="Fast 2-minute check-in to clear mental cache and plan tomorrow"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-400">Date:</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 font-mono"
                  />
                </div>
                {todayEntry && selectedDate === todayStr && (
                  <Badge variant="success" size="sm">Logged for Today</Badge>
                )}
              </div>

              {/* Sliders: Mood, Energy, Stress */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Mood</span>
                    <span className="font-mono font-bold text-indigo-400">{mood}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={mood}
                    onChange={e => setMood(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>Low</span>
                    <span>Neutral</span>
                    <span>Peak</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Energy</span>
                    <span className="font-mono font-bold text-emerald-400">{energy}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={energy}
                    onChange={e => setEnergy(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>Drained</span>
                    <span>Steady</span>
                    <span>Vibrant</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Stress</span>
                    <span className="font-mono font-bold text-rose-400">{stress}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={stress}
                    onChange={e => setStress(Number(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>Calm</span>
                    <span>Manageable</span>
                    <span>High</span>
                  </div>
                </div>
              </div>

              {/* Sleep & Main Emotion */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Sleep Duration (Hours)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="3"
                    max="14"
                    value={sleepHours}
                    onChange={e => setSleepHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Dominant Emotion
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Grounded, Restless, Content, Hopeful"
                    value={mainEmotion}
                    onChange={e => setMainEmotion(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100"
                  />
                </div>
              </div>

              {/* 3 Prompts */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-emerald-400 mb-1">
                    1. What went well today? (Even small micro-wins)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Cleared 1 graph problem on LeetCode without peeking. Held focus for 90 mins."
                    value={wentWell}
                    onChange={e => setWentWell(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-400 mb-1">
                    2. What made today difficult? (Friction points)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Spent 45 minutes on WhatsApp discussion about OA cutoffs, which created mild anxiety."
                    value={madeDifficult}
                    onChange={e => setMadeDifficult(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-indigo-400 mb-1">
                    3. What is one small improvement for tomorrow?
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Put phone in airplane mode from 9:30 AM to 1:00 PM for deep work."
                    value={improvement}
                    onChange={e => setImprovement(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                {savedSuccess && (
                  <span className="text-xs text-emerald-400 font-medium">
                    ✓ Reflection saved successfully
                  </span>
                )}
                <button
                  type="submit"
                  className="ml-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md transition-colors active:scale-95"
                >
                  Save Daily Check-in
                </button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right (1 col): Trends & Pattern Discovery */}
        <div className="space-y-4">
          <Card
            title="Emotional & Energy Trends"
            subtitle="Mood, Energy & Stress trajectory"
            action={
              <select
                value={trendDays}
                onChange={e => setTrendDays(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-[11px] text-slate-300"
              >
                <option value={7}>7 Days</option>
                <option value={14}>14 Days</option>
                <option value={30}>30 Days</option>
              </select>
            }
          >
            <MetricLineChart series={moodChartSeries} height={150} min={1} max={10} />
          </Card>

          {/* Pattern Discovery Card */}
          <Card title="Pattern Discovery" icon={<Brain className="w-4 h-4 text-purple-400" />}>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 leading-relaxed text-slate-300">
                <p className="font-semibold text-indigo-300 mb-1">Data-driven Insight:</p>
                <p className="text-slate-300">{patternInsight}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <p className="font-medium text-slate-200 mb-1">Neuro-Performance Correlation</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  DSA retention and stress resilience are highly dependent on sleep consistency. Avoid cutting sleep below 7h to "grind"; cognitive debt reduces problem-solving speed by up to 40%.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Historical Journal Archive */}
      <Card
        title="Journal Archive & History"
        subtitle="Search through past reflections, thoughts, and lessons learned"
        action={
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search thoughts..."
              value={historySearch}
              onChange={e => setHistorySearch(e.target.value)}
              className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder:text-slate-500 w-40 sm:w-56"
            />
          </div>
        }
      >
        {filteredHistory.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="w-6 h-6 text-indigo-400" />}
            title="No Journal Entries Found"
            description="Complete your first daily reflection above to begin archiving your progress and mindset."
          />
        ) : (
          <div className="space-y-3">
            {filteredHistory.map(entry => (
              <div
                key={entry.id}
                className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-slate-200">{entry.date}</span>
                    <Badge variant="cyan" size="sm">{entry.mainEmotion}</Badge>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {entry.sleepHours}h sleep
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-indigo-400">Mood: {entry.mood}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-emerald-400">Energy: {entry.energy}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-rose-400">Stress: {entry.stress}</span>
                    </div>

                    <button
                      onClick={() => loadEntryForEdit(entry)}
                      className="text-slate-400 hover:text-indigo-300 p-1"
                      title="Edit Entry"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete journal entry for ${entry.date}?`)) {
                          deleteMoodEntry(entry.id);
                        }
                      }}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-slate-300">
                  {entry.wentWell && (
                    <div className="p-2.5 rounded bg-slate-950/40 border border-emerald-950/60">
                      <p className="text-[11px] font-semibold text-emerald-400 mb-0.5">Went Well:</p>
                      <p className="leading-relaxed">{entry.wentWell}</p>
                    </div>
                  )}
                  {entry.madeDifficult && (
                    <div className="p-2.5 rounded bg-slate-950/40 border border-amber-950/60">
                      <p className="text-[11px] font-semibold text-amber-400 mb-0.5">Difficulties:</p>
                      <p className="leading-relaxed">{entry.madeDifficult}</p>
                    </div>
                  )}
                  {entry.oneImprovementTomorrow && (
                    <div className="p-2.5 rounded bg-slate-950/40 border border-indigo-950/60">
                      <p className="text-[11px] font-semibold text-indigo-400 mb-0.5">Tomorrow's Improvement:</p>
                      <p className="leading-relaxed">{entry.oneImprovementTomorrow}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default MoodJournalPage;
