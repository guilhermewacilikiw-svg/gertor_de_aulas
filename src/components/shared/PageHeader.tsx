import React from 'react';

interface PageHeaderProps {
  badgeIcon?: React.ReactNode;
  badgeText?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({
  badgeIcon,
  badgeText,
  title,
  subtitle,
  action
}: PageHeaderProps) {
  return (
    <div className="relative w-full rounded-2xl bg-[#0a0a0f] border border-white/10 overflow-hidden shadow-2xl p-8 md:p-10">
      {/* Glow effects */}
      <div 
        className="absolute top-0 right-0 w-96 h-96 bg-red-600/15 rounded-full blur-[100px] animate-pulse mix-blend-screen translate-x-1/3 -translate-y-1/3 pointer-events-none" 
      />
      <div 
        className="absolute bottom-0 left-0 w-80 h-80 bg-red-900/15 rounded-full blur-[80px] animate-pulse mix-blend-screen -translate-x-1/3 translate-y-1/3 pointer-events-none" 
        style={{ animationDelay: '2s' }} 
      />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          {badgeText && (
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-white/5 rounded-full border border-white/10 mb-4 backdrop-blur-md">
              {badgeIcon && <span className="text-red-500">{badgeIcon}</span>}
              <span className="text-xs font-black uppercase tracking-widest text-white/80">
                {badgeText}
              </span>
            </div>
          )}
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-400 max-w-2xl text-base md:text-lg mt-2 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        {action && (
          <div className="shrink-0 flex items-center gap-3 w-full md:w-auto">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
