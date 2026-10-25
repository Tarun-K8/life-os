import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  action,
  icon,
  noPadding = false,
}) => {
  return (
    <div
      className={`bg-[#111522]/90 backdrop-blur-sm border border-[#1f263d] rounded-xl shadow-lg transition-all duration-200 hover:border-slate-700/60 ${className}`}
    >
      {(title || action || icon) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f263d]/80">
          <div className="flex items-center gap-3">
            {icon && <div className="text-indigo-400">{icon}</div>}
            <div>
              {title && <h3 className="font-semibold text-slate-100 text-sm tracking-wide">{title}</h3>}
              {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
    </div>
  );
};

export default Card;
