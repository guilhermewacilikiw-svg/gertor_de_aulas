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
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
      <div className="min-w-0">
        {badgeText && (
          <p className="inline-flex items-center gap-2 text-sm text-gray-400 mb-1">
            {badgeIcon && <span className="text-red-500" aria-hidden="true">{badgeIcon}</span>}
            {badgeText}
          </p>
        )}
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        {subtitle && (
          <p className="text-sm text-gray-400 max-w-2xl mt-1">{subtitle}</p>
        )}
      </div>

      {action && (
        <div className="shrink-0 flex items-center gap-3 w-full md:w-auto">
          {action}
        </div>
      )}
    </div>
  );
}
