import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Code2,
  BookOpen,
  MessageSquare,
  Activity,
  BarChart3,
  Target,
  Settings,
  PlusCircle,
  Sparkles,
  Compass,
} from 'lucide-react';
import { useLifeOs } from '../../context/LifeOsContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'habits', label: 'Habits & Streaks', icon: CheckSquare },
  { id: 'career', label: 'Career & DSA', icon: Code2 },
  { id: 'mood', label: 'Mood & Journal', icon: BookOpen },
  { id: 'social', label: 'Social & Focus', icon: MessageSquare },
  { id: 'fitness', label: 'Fitness & Body', icon: Activity },
  { id: 'analytics', label: 'Weekly Review', icon: BarChart3 },
  { id: 'goals', label: '30 / 90-Day Goals', icon: Target },
  { id: 'settings', label: 'Settings & Data', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, setQuickAddOpen, data } = useLifeOs();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#0d111c] border-r border-[#1a2136] h-screen sticky top-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-[#1a2136]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              LIFE OS
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                PRO
              </span>
            </span>
            <p className="text-[11px] text-slate-400 truncate max-w-[140px]">
              {data.profile.targetRole || 'Engineering Student'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Log Action */}
      <div className="px-4 py-3">
        <button
          onClick={() => setQuickAddOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Quick Log Activity</span>
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1">
          Command Center
        </div>
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-indigo-400' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400 font-mono">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Minimal Footer / Student Status */}
      <div className="p-4 border-t border-[#1a2136] bg-[#0b0e17]/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
            {data.profile.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-200 truncate">{data.profile.name}</p>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Focus Mode Active
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
