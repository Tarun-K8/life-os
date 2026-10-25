import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 - 100
  color?: string; // tailwind color class or hex
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'bg-indigo-500',
  showLabel = false,
  size = 'md',
  className = '',
  label,
}) => {
  const clamped = Math.max(0, Math.min(100, Math.round(progress)));

  const heightClass = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }[size];

  return (
    <div className={`w-full ${className}`}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center text-xs mb-1.5 text-slate-300">
          <span>{label || 'Progress'}</span>
          <span className="font-mono font-medium text-slate-400">{clamped}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/40 ${heightClass}`}>
        <div
          className={`${heightClass} rounded-full transition-all duration-500 ease-out ${
            color.startsWith('bg-') ? color : 'bg-indigo-500'
          }`}
          style={{
            width: `${clamped}%`,
            ...(color.startsWith('#') ? { backgroundColor: color } : {}),
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
