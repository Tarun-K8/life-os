import React, { useState } from 'react';
import {
  Activity,
  Dumbbell,
  Moon,
  Plus,
  Scale,
  Trash2,
  Edit2,
  Check,
  TrendingDown,
  TrendingUp,
  Heart,
  Calendar,
} from 'lucide-react';
import { useLifeOs } from '../context/LifeOsContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { MetricLineChart } from '../components/common/Charts';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { getTodayString, getPastDates, formatDisplayDate } from '../utils/dateUtils';
import { FitnessLog, WorkoutExercise } from '../types';

export const FitnessPage: React.FC = () => {
  const { data, saveFitnessLog, deleteFitnessLog } = useLifeOs();
  const todayStr = getTodayString();
  const todayLog = data.fitnessLogs.find(f => f.date === todayStr);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<FitnessLog | null>(null);

  // Form states
  const [date, setDate] = useState(todayStr);
  const [bodyWeight, setBodyWeight] = useState<string>(todayLog?.bodyWeightKg ? String(todayLog.bodyWeightKg) : '');
  const [chestCm, setChestCm] = useState<string>(todayLog?.measurements?.chestCm ? String(todayLog.measurements.chestCm) : '');
  const [waistCm, setWaistCm] = useState<string>(todayLog?.measurements?.waistCm ? String(todayLog.measurements.waistCm) : '');
  const [armsCm, setArmsCm] = useState<string>(todayLog?.measurements?.armsCm ? String(todayLog.measurements.armsCm) : '');
  const [sleepHours, setSleepHours] = useState<number>(todayLog?.sleepHours || 7.5);
  const [sleepConsistency, setSleepConsistency] = useState<FitnessLog['sleepConsistency']>(todayLog?.sleepConsistency || 'Good');
  const [cardioMinutes, setCardioMinutes] = useState<number>(todayLog?.cardioMinutes || 0);
  const [cardioType, setCardioType] = useState<FitnessLog['cardioType']>(todayLog?.cardioType || 'Badminton');
  const [workoutNotes, setWorkoutNotes] = useState<string>(todayLog?.notes || '');

  // Workout exercises state for form
  const [exercises, setExercises] = useState<WorkoutExercise[]>(
    todayLog?.workouts && todayLog.workouts.length > 0
      ? todayLog.workouts
      : [
          {
            id: 'ex-1',
            name: 'Pull-ups / Lat Pulldown',
            skipped: false,
            sets: [
              { reps: 10, weightKg: 0 },
              { reps: 8, weightKg: 0 },
              { reps: 8, weightKg: 0 },
            ],
          },
          {
            id: 'ex-2',
            name: 'Dumbbell Bench Press',
            skipped: false,
            sets: [
              { reps: 10, weightKg: 22 },
              { reps: 10, weightKg: 24 },
              { reps: 8, weightKg: 26 },
            ],
          },
        ]
  );

  // Weight Trend Line Data (Past 14 days)
  const past14 = getPastDates(14, todayStr);
  const weightPoints = past14
    .map(d => {
      const log = data.fitnessLogs.find(f => f.date === d);
      return {
        label: d.split('-').slice(1).join('/'),
        value: log?.bodyWeightKg || 0,
      };
    })
    .filter(pt => pt.value > 0);

  const weightSeries = [
    {
      name: 'Body Weight (kg)',
      color: '#10b981',
      data: weightPoints,
    },
  ];

  // Weekly workout frequency
  const past7 = getPastDates(7, todayStr);
  const weekSessions = data.fitnessLogs.filter(f => past7.includes(f.date));
  const activeWorkoutDays = weekSessions.filter(
    f => (f.workouts && f.workouts.length > 0 && f.workouts.some(w => !w.skipped)) || (f.cardioMinutes && f.cardioMinutes > 0)
  ).length;
  const targetWorkouts = data.profile.weeklyWorkoutTarget || 5;

  const openLogModal = (log?: FitnessLog) => {
    if (log) {
      setEditingLog(log);
      setDate(log.date);
      setBodyWeight(log.bodyWeightKg ? String(log.bodyWeightKg) : '');
      setChestCm(log.measurements?.chestCm ? String(log.measurements.chestCm) : '');
      setWaistCm(log.measurements?.waistCm ? String(log.measurements.waistCm) : '');
      setArmsCm(log.measurements?.armsCm ? String(log.measurements.armsCm) : '');
      setSleepHours(log.sleepHours);
      setSleepConsistency(log.sleepConsistency);
      setCardioMinutes(log.cardioMinutes);
      setCardioType(log.cardioType);
      setWorkoutNotes(log.notes || '');
      setExercises(log.workouts || []);
    } else {
      setEditingLog(null);
      setDate(todayStr);
      setBodyWeight('');
      setChestCm('');
      setWaistCm('');
      setArmsCm('');
      setSleepHours(7.5);
      setSleepConsistency('Good');
      setCardioMinutes(45);
      setCardioType('Badminton');
      setWorkoutNotes('');
      setExercises([
        {
          id: `ex-${Date.now()}-1`,
          name: 'Core Resistance Movement',
          skipped: false,
          sets: [
            { reps: 10, weightKg: 20 },
            { reps: 10, weightKg: 25 },
          ],
        },
      ]);
    }
    setModalOpen(true);
  };

  const handleToggleSkip = (exerciseId: string) => {
    setExercises(prev =>
      prev.map(ex => (ex.id === exerciseId ? { ...ex, skipped: !ex.skipped } : ex))
    );
  };

  const handleAddExercise = () => {
    setExercises(prev => [
      ...prev,
      {
        id: `ex-${Date.now()}`,
        name: 'New Exercise',
        skipped: false,
        sets: [{ reps: 10, weightKg: 20 }],
      },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveFitnessLog({
      date,
      bodyWeightKg: bodyWeight ? Number(bodyWeight) : undefined,
      measurements: {
        chestCm: chestCm ? Number(chestCm) : undefined,
        waistCm: waistCm ? Number(waistCm) : undefined,
        armsCm: armsCm ? Number(armsCm) : undefined,
      },
      sleepHours: Number(sleepHours),
      sleepConsistency,
      cardioMinutes: Number(cardioMinutes) || 0,
      cardioType,
      workouts: exercises,
      notes: workoutNotes.trim() || undefined,
    });
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            Fitness, Athletic Physique & Sleep
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Build a lean, athletic body and sharp mental clarity through badminton, resistance training, and consistent circadian recovery.
          </p>
        </div>

        <button
          onClick={() => openLogModal()}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Log Workout / Sleep</span>
        </button>
      </div>

      {/* Snapshot Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card noPadding className="p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Weekly Workouts</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-slate-100">{activeWorkoutDays}</span>
            <span className="text-xs text-slate-400 font-mono">/ {targetWorkouts} sessions</span>
          </div>
          <ProgressBar progress={(activeWorkoutDays / targetWorkouts) * 100} color="bg-emerald-500" size="sm" className="mt-2.5" />
        </Card>

        <Card noPadding className="p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Latest Weight</span>
            <Scale className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-400 mt-1">
            {todayLog?.bodyWeightKg || data.fitnessLogs[0]?.bodyWeightKg || '71.5'} <span className="text-xs font-normal text-slate-400">kg</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">Athletic body composition</p>
        </Card>

        <Card noPadding className="p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Sleep Consistency</span>
            <Moon className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-300 mt-1">
            {todayLog ? `${todayLog.sleepHours}h` : '7.5h'}
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 font-mono">
            {todayLog?.sleepConsistency || 'Optimal restorative window'}
          </p>
        </Card>

        <Card noPadding className="p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Cardio & Badminton</span>
            <Heart className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
            {todayLog?.cardioMinutes || 0} <span className="text-xs font-normal text-slate-400">mins</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {todayLog?.cardioType || 'High tempo badminton'}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Weight Trend & Today's Exercises */}
        <div className="lg:col-span-2 space-y-4">
          {/* Weight Trend Chart */}
          <Card
            title="Body Weight & Physique Progress"
            subtitle="Steady athletic composition trend line (kg)"
          >
            {weightPoints.length > 0 ? (
              <MetricLineChart
                series={weightSeries}
                height={160}
                min={Math.min(...weightPoints.map(p => p.value)) - 2}
                max={Math.max(...weightPoints.map(p => p.value)) + 2}
                unit="kg"
              />
            ) : (
              <div className="text-center py-8 text-xs text-slate-500">
                Log daily body weight to view progress over time.
              </div>
            )}
          </Card>

          {/* Today's Workout Routine */}
          <Card
            title="Resistance Training & Exercise Log"
            subtitle="Customizable sets, reps & weights. Skip unsuitable exercises freely."
            action={
              <button
                onClick={() => openLogModal(todayLog)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                {todayLog ? 'Edit Today' : '+ Log Session'}
              </button>
            }
          >
            {todayLog?.workouts && todayLog.workouts.length > 0 ? (
              <div className="space-y-3">
                {todayLog.workouts.map(ex => (
                  <div
                    key={ex.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      ex.skipped
                        ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
                        : 'bg-slate-900/80 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Dumbbell className="w-4 h-4 text-indigo-400" />
                        <h4
                          className={`text-xs font-semibold ${
                            ex.skipped ? 'line-through text-slate-500' : 'text-slate-100'
                          }`}
                        >
                          {ex.name}
                        </h4>
                      </div>
                      <Badge variant={ex.skipped ? 'default' : 'success'} size="sm">
                        {ex.skipped ? 'Skipped' : `${ex.sets.length} Sets Logged`}
                      </Badge>
                    </div>

                    {!ex.skipped && (
                      <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px] text-slate-300">
                        {ex.sets.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300"
                          >
                            Set {idx + 1}: {s.reps} reps {s.weightKg > 0 ? `@ ${s.weightKg}kg` : '(Bodyweight)'}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Dumbbell className="w-6 h-6 text-indigo-400" />}
                title="No Exercises Logged For Today"
                description="Hit the gym or play badminton? Record your sets, weights, or cardio duration to stay accountable."
                actionText="Log Today's Workout"
                onAction={() => openLogModal()}
              />
            )}
          </Card>
        </div>

        {/* Right (1 col): Measurements & History */}
        <div className="space-y-4">
          <Card title="Physique Measurements" icon={<Scale className="w-4 h-4 text-indigo-400" />}>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-900/70 border border-slate-800">
                <span className="text-slate-400">Chest Circumference</span>
                <span className="font-mono font-bold text-slate-200">
                  {todayLog?.measurements?.chestCm || '98'} cm
                </span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-900/70 border border-slate-800">
                <span className="text-slate-400">Waist (Lean indicator)</span>
                <span className="font-mono font-bold text-emerald-400">
                  {todayLog?.measurements?.waistCm || '79'} cm
                </span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-900/70 border border-slate-800">
                <span className="text-slate-400">Arms (Flexed)</span>
                <span className="font-mono font-bold text-slate-200">
                  {todayLog?.measurements?.armsCm || '35'} cm
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed bg-slate-900/40 p-2.5 rounded border border-slate-800">
                💡 <span className="font-medium text-slate-300">Athletic Tip:</span> Tracking waist-to-chest ratio is a far more honest indicator of lean athletic conditioning than the scale alone.
              </p>
            </div>
          </Card>

          {/* Past Fitness Logs List */}
          <Card title="Recent Fitness Logs">
            {data.fitnessLogs.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No records yet.</p>
            ) : (
              <div className="space-y-2 text-xs">
                {data.fitnessLogs.slice(0, 5).map(log => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-mono text-slate-400">{log.date}</span>
                      <p className="text-slate-200 font-medium">
                        {log.cardioMinutes > 0 ? `${log.cardioMinutes}m ${log.cardioType}` : `${log.workouts?.length || 0} exercises`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {log.bodyWeightKg && (
                        <span className="font-mono text-emerald-400 font-bold">{log.bodyWeightKg}kg</span>
                      )}
                      <button
                        onClick={() => deleteFitnessLog(log.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Fitness Log Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingLog ? 'Edit Fitness & Recovery' : 'Log Workout & Recovery'}
        subtitle="Track weight, cardio, resistance exercises, and sleep"
        maxWidth="xl"
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
              <label className="block text-xs font-medium text-slate-300 mb-1">Body Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 71.4"
                value={bodyWeight}
                onChange={e => setBodyWeight(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono"
              />
            </div>
          </div>

          {/* Measurements */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Chest (cm)</label>
              <input
                type="number"
                step="0.5"
                placeholder="98"
                value={chestCm}
                onChange={e => setChestCm(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Waist (cm)</label>
              <input
                type="number"
                step="0.5"
                placeholder="79"
                value={waistCm}
                onChange={e => setWaistCm(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Arms (cm)</label>
              <input
                type="number"
                step="0.5"
                placeholder="35"
                value={armsCm}
                onChange={e => setArmsCm(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono"
              />
            </div>
          </div>

          {/* Sleep & Consistency */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Sleep Hours</label>
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
              <label className="block text-xs font-medium text-slate-300 mb-1">Sleep Consistency</label>
              <select
                value={sleepConsistency}
                onChange={e => setSleepConsistency(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200"
              >
                <option value="Excellent">Excellent (Same bedtime & wakeup)</option>
                <option value="Good">Good (Within 45 mins)</option>
                <option value="Irregular">Irregular</option>
                <option value="Poor">Poor / Disrupted</option>
              </select>
            </div>
          </div>

          {/* Cardio / Badminton */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Cardio Activity</label>
              <select
                value={cardioType}
                onChange={e => setCardioType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200"
              >
                <option value="Badminton">Badminton</option>
                <option value="Gym Cardio">Gym Resistance / Weights</option>
                <option value="Running">Running / Jogging</option>
                <option value="Walking">Brisk Walking</option>
                <option value="None">None / Rest</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Duration (Minutes)</label>
              <input
                type="number"
                value={cardioMinutes}
                onChange={e => setCardioMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono"
              />
            </div>
          </div>

          {/* Exercises list */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-300">Exercises in this session:</label>
              <button
                type="button"
                onClick={handleAddExercise}
                className="text-xs text-indigo-400 hover:text-indigo-300"
              >
                + Add Exercise
              </button>
            </div>

            {exercises.map((ex, exIdx) => (
              <div key={ex.id} className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={ex.name}
                    onChange={e => {
                      const updated = [...exercises];
                      updated[exIdx].name = e.target.value;
                      setExercises(updated);
                    }}
                    className="bg-transparent border-b border-slate-700 text-xs font-semibold text-slate-100 focus:outline-none w-2/3"
                  />
                  <button
                    type="button"
                    onClick={() => handleToggleSkip(ex.id)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                      ex.skipped
                        ? 'bg-amber-950/60 border border-amber-800 text-amber-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {ex.skipped ? 'Skipped' : 'Skip Exercise'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md transition-colors"
          >
            Save Fitness Log
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default FitnessPage;
