import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  color?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'from-red-600/20 to-transparent'
}: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#101010] border border-white/10 p-6 hover:border-red-600/40 transition-colors duration-200 group">
      <div
        className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} rounded-full blur-2xl pointer-events-none`}
      />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <span className="text-sm font-medium text-gray-300 block mb-2">
            {title}
          </span>
          <span className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            {value}
          </span>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-2">
              {subtitle}
            </p>
          )}
        </div>

        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-colors duration-200">
          {icon}
        </div>
      </div>

      {trend && (
        <div className="relative z-10 mt-4 pt-4 border-t border-white/5 flex items-center text-xs text-red-400 font-bold">
          {trend}
        </div>
      )}
    </div>
  );
}
