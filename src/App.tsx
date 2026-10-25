import React, { useState } from 'react';
import { LifeOsProvider, useLifeOs } from './context/LifeOsContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { QuickAddModal } from './components/modals/QuickAddModal';

// Pages
import { Dashboard } from './pages/Dashboard';
import { HabitsPage } from './pages/HabitsPage';
import { CareerPage } from './pages/CareerPage';
import { MoodJournalPage } from './pages/MoodJournalPage';
import { SocialFocusPage } from './pages/SocialFocusPage';
import { FitnessPage } from './pages/FitnessPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { GoalsPage } from './pages/GoalsPage';
import { SettingsPage } from './pages/SettingsPage';

import {
  X,
  LayoutDashboard,
  CheckSquare,
  Code2,
  BookOpen,
  MessageSquare,
  Activity,
  BarChart3,
  Target,
  Settings,
  Compass,
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab } = useLifeOs();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const ALL_PAGES = [
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

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'habits':
        return <HabitsPage />;
      case 'career':
        return <CareerPage />;
      case 'mood':
        return <MoodJournalPage />;
      case 'social':
        return <SocialFocusPage />;
      case 'fitness':
        return <FitnessPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'goals':
        return <GoalsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0d14] text-slate-100 font-sans">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-[#0d111c] border-r border-[#1a2136] h-full p-4 flex flex-col z-10 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#1a2136]">
              <div className="flex items-center gap-2.5">
                <Compass className="w-5 h-5 text-indigo-400" />
                <span className="font-extrabold text-base tracking-tight text-white">LIFE OS</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
              {ALL_PAGES.map(p => {
                const Icon = p.icon;
                const isActive = activeTab === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActiveTab(p.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-24 lg:pb-12">
          {renderActivePage()}
        </main>

        {/* Mobile Navigation */}
        <BottomNav onOpenMoreMenu={() => setMobileMenuOpen(true)} />
      </div>

      {/* Global Quick Add Speed-Dial Modal */}
      <QuickAddModal />
    </div>
  );
};

export default function App() {
  return (
    <LifeOsProvider>
      <MainLayout />
    </LifeOsProvider>
  );
}
