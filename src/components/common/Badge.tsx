import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'amber' | 'cyan';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-slate-800 text-slate-300 border-slate-700',
  success: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
  warning: 'bg-amber-950/60 text-amber-300 border-amber-800/60',
  danger: 'bg-rose-950/60 text-rose-300 border-rose-800/60',
  info: 'bg-indigo-950/60 text-indigo-300 border-indigo-800/60',
  purple: 'bg-purple-950/60 text-purple-300 border-purple-800/60',
  amber: 'bg-orange-950/60 text-orange-300 border-orange-800/60',
  cyan: 'bg-cyan-950/60 text-cyan-300 border-cyan-800/60',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
  icon,
}) => {
  const sizeStyle = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${variantStyles[variant]} ${sizeStyle} ${className}`}
    >
      {icon && <span className="opacity-80">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
