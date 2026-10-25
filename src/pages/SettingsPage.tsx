import React, { useState } from 'react';
import {
  Settings,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  User,
  CheckCircle,
  AlertTriangle,
  FileJson,
  Database,
  Lock,
} from 'lucide-react';
import { useLifeOs } from '../context/LifeOsContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export const SettingsPage: React.FC = () => {
  const {
    data,
    updateProfile,
    exportDataJson,
    importDataJson,
    resetAllData,
    seedDemoData,
  } = useLifeOs();

  const [name, setName] = useState(data.profile.name);
  const [targetRole, setTargetRole] = useState(data.profile.targetRole);
  const [studyTarget, setStudyTarget] = useState(data.profile.dailyStudyTargetHours);
  const [dsaTarget, setDsaTarget] = useState(data.profile.dailyDsaTarget);
  const [workoutTarget, setWorkoutTarget] = useState(data.profile.weeklyWorkoutTarget);
  const [sleepTarget, setSleepTarget] = useState(data.profile.dailySleepTargetHours);
  const [profileSaved, setProfileSaved] = useState(false);

  // Import / Export state
  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim() || 'Engineer',
      targetRole: targetRole.trim() || 'Software Engineer',
      dailyStudyTargetHours: Number(studyTarget) || 5,
      dailyDsaTarget: Number(dsaTarget) || 2,
      weeklyWorkoutTarget: Number(workoutTarget) || 5,
      dailySleepTargetHours: Number(sleepTarget) || 7.5,
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const handleExport = () => {
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `life_os_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const content = event.target?.result as string;
        const res = importDataJson(content);
        if (res.success) {
          setImportStatus({ success: true, message: 'All LIFE OS records successfully restored!' });
        } else {
          setImportStatus({ success: false, message: res.error || 'Failed to import backup' });
        }
      } catch (err) {
        setImportStatus({ success: false, message: 'Invalid file format' });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
          Settings & Local Data Vault
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-xl">
          Customize your targets, export offline backups, or seed realistic placement sample data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Profile & Target Configuration */}
        <div className="lg:col-span-2 space-y-4">
          <Card title="Student & Placement Targets" icon={<User className="w-4 h-4 text-indigo-400" />}>
            <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Target Job Role</label>
                  <input
                    type="text"
                    required
                    value={targetRole}
                    onChange={e => setTargetRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Daily Study Target</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      max="16"
                      value={studyTarget}
                      onChange={e => setStudyTarget(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-mono"
                    />
                    <span className="text-slate-400 font-mono">hrs</span>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Daily DSA Target</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={dsaTarget}
                      onChange={e => setDsaTarget(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-mono"
                    />
                    <span className="text-slate-400 font-mono">prob</span>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Weekly Workouts</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="1"
                      max="7"
                      value={workoutTarget}
                      onChange={e => setWorkoutTarget(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-mono"
                    />
                    <span className="text-slate-400 font-mono">days</span>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Nightly Sleep</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.5"
                      min="5"
                      max="10"
                      value={sleepTarget}
                      onChange={e => setSleepTarget(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-mono"
                    />
                    <span className="text-slate-400 font-mono">hrs</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                {profileSaved && (
                  <span className="text-emerald-400 font-medium">
                    ✓ Targets updated successfully
                  </span>
                )}
                <button
                  type="submit"
                  className="ml-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-md transition-colors active:scale-95"
                >
                  Save Target Preferences
                </button>
              </div>
            </form>
          </Card>

          {/* Backup & Restore */}
          <Card title="Backup & Restore (JSON Export)" icon={<Database className="w-4 h-4 text-emerald-400" />}>
            <div className="space-y-4 text-xs">
              <p className="text-slate-400 leading-relaxed">
                Export your full dataset into a clean JSON file, or restore from a previous backup anytime. Because data is stored in your device storage, saving periodic backups is recommended.
              </p>

              {importStatus && (
                <div
                  className={`p-3 rounded-lg border flex items-center gap-2 ${
                    importStatus.success
                      ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-800 text-rose-200'
                  }`}
                >
                  {importStatus.success ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  <span>{importStatus.message}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium transition-colors"
                >
                  <Download className="w-4 h-4 text-indigo-400" />
                  <span>Download Full Backup (JSON)</span>
                </button>

                <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>Restore From File</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </Card>

          {/* Seed Sample Demo Data */}
          <Card title="Demo & Sandbox Data" icon={<Sparkles className="w-4 h-4 text-purple-400" />}>
            <div className="space-y-3 text-xs">
              <p className="text-slate-400 leading-relaxed">
                Want to preview how LIFE OS looks with active week-long data? You can populate realistic engineering student logs (LeetCode problems, mock placement applications, workout records, and daily reflections).
              </p>
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => {
                    if (confirm('Load realistic engineering student demo data? Current logs will be merged or replaced.')) {
                      seedDemoData();
                      alert('Demo data loaded successfully! Check Dashboard, Career, and Analytics.');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-800 text-purple-200 font-medium transition-colors"
                >
                  Load Realistic Sample Data
                </button>

                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to reset all data to a clean fresh slate? This cannot be undone unless you have an exported backup.')) {
                      resetAllData();
                      alert('LIFE OS has been reset to clean state.');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900 border border-rose-900 text-rose-300 font-medium transition-colors"
                >
                  Reset to Fresh Clean Slate
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right (1 col): Privacy & Architecture Specs */}
        <div className="space-y-4">
          <Card title="Architecture & Privacy Guarantees" icon={<Lock className="w-4 h-4 text-emerald-400" />}>
            <div className="space-y-3 text-xs text-slate-400 leading-relaxed">
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                <p className="font-semibold text-slate-200">Zero Cloud Leakage</p>
                <p>
                  No external analytics, tracking pixels, or AI prompts are automatically sent. Your reflections, placement applications, and habits reside strictly in local storage.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                <p className="font-semibold text-slate-200">Repository Pattern Storage</p>
                <p>
                  Built with a clean repository abstraction layer (<code className="text-indigo-300 font-mono">IStorageService</code>). Easily pluggable to IndexedDB, PostgreSQL, or SQLite in the future.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                <p className="font-semibold text-slate-200">Honest Tracking Standard</p>
                <p>
                  Does not fake integrations with WhatsApp, LeetCode, or Apple Health. Everything is intentionally entered by you with minimal friction.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
