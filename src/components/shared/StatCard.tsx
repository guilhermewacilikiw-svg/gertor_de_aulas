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
}: StatCardProps) {
  return (
    <div className="rounded-xl bg-white/[0.04] p-4">
      <div className="flex items-center justify-between text-gray-400">
        <span className="text-sm">{title}</span>
        <span className="[&>svg]:w-4 [&>svg]:h-4" aria-hidden="true">{icon}</span>
      </div>
      <p className="text-3xl font-semibold text-white mt-2">{value}</p>
      {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
      {trend && <p className="text-sm text-red-400 mt-2">{trend}</p>}
    </div>
  );
}
