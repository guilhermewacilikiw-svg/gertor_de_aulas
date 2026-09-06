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
    <div className="relative overflow-hidden rounded-2xl bg-[#0e0e14] border border-white/10 p-6 shadow-xl hover:border-red-600/40 transition-all duration-300 group">
      {/* Background Gradient Accent */}
      <div 
        className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`} 
      />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
            {title}
          </span>
          <span className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-sm">
            {value}
          </span>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-2 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-all duration-300 shadow-md">
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
