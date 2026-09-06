import React from 'react';

type StatusType = 
  | 'active' 
  | 'inactive' 
  | 'pending' 
  | 'trialing' 
  | 'completed' 
  | 'cancelled' 
  | 'published' 
  | 'draft' 
  | 'scheduled';

interface StatusBadgeProps {
  status: string;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className = '' }: StatusBadgeProps) {
  const normalized = status.toLowerCase() as StatusType;

  let colorClasses = 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  let defaultLabel = status;

  switch (normalized) {
    case 'active':
      colorClasses = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]';
      defaultLabel = 'Ativo';
      break;
    case 'published':
      colorClasses = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      defaultLabel = 'Publicado';
      break;
    case 'completed':
      colorClasses = 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      defaultLabel = 'Concluído';
      break;
    case 'pending':
      colorClasses = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      defaultLabel = 'Pendente';
      break;
    case 'trialing':
      colorClasses = 'bg-amber-500/15 text-amber-400 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]';
      defaultLabel = 'Em Teste (Trial)';
      break;
    case 'scheduled':
      colorClasses = 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
      defaultLabel = 'Agendado';
      break;
    case 'draft':
      colorClasses = 'bg-white/10 text-gray-300 border-white/20';
      defaultLabel = 'Rascunho';
      break;
    case 'inactive':
      colorClasses = 'bg-neutral-800 text-gray-400 border-white/10';
      defaultLabel = 'Inativo';
      break;
    case 'cancelled':
      colorClasses = 'bg-red-500/15 text-red-400 border-red-500/30 shadow-[0_0_12px_rgba(239,68,68,0.15)]';
      defaultLabel = 'Cancelado';
      break;
    default:
      colorClasses = 'bg-red-600/10 text-red-400 border-red-600/20';
      defaultLabel = status;
  }

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${colorClasses} ${className}`}
    >
      {label || defaultLabel}
    </span>
  );
}
