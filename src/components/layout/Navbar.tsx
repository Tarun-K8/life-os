import React from 'react';
import { PlusCircle, ShieldCheck, Calendar, Bell, Menu } from 'lucide-react';
import { useLifeOs } from '../../context/LifeOsContext';
import { getTodayString, formatDisplayDate } from '../../utils/dateUtils';

interface NavbarProps {
  onOpenMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu }) => {
  const { data, setQuickAddOpen } = useLifeOs();
  const todayStr = getTodayString();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="sticky top-0 z-20 bg-[#0a0d14]/85 backdrop-blur-md border-b border-[#1a2136] px-4 sm:px-6 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Greeting */}
        <div className="flex items-center gap-3">
          {onOpenMobileMenu && (
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">
                {getGreeting()}, {data.profile.name}
              </h1>
              <span className="hidden sm:inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {data.profile.targetRole || 'Engineer'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>{formatDisplayDate(todayStr)}</span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Privacy badge */}
          <div
            title="All records are encrypted in device storage. Zero external telemetry."
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-xs cursor-default"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px]">Private & Local</span>
          </div>

          {/* Quick Log Button */}
          <button
            onClick={() => setQuickAddOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shadow-sm active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Quick Log</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
