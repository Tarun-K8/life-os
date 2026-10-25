import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Code2,
  BookOpen,
  MoreHorizontal,
} from 'lucide-react';
import { useLifeOs } from '../../context/LifeOsContext';

interface BottomNavProps {
  onOpenMoreMenu: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenMoreMenu }) => {
  const { activeTab, setActiveTab } = useLifeOs();

  const PRIMARY_TABS = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'habits', label: 'Habits', icon: CheckSquare },
    { id: 'career', label: 'DSA & Career', icon: Code2 },
    { id: 'mood', label: 'Journal', icon: BookOpen },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0d111c]/95 backdrop-blur-md border-t border-[#1a2136] px-2 py-2 flex items-center justify-around">
      {PRIMARY_TABS.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
              isActive
                ? 'text-indigo-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}

      {/* More Button */}
      <button
        onClick={onOpenMoreMenu}
        className="flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium text-slate-400 hover:text-slate-200"
      >
        <MoreHorizontal className="w-5 h-5 mb-0.5" />
        <span>More</span>
      </button>
    </nav>
  );
};

export default BottomNav;
