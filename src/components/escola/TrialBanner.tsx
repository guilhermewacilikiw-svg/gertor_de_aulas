'use client';

import Link from 'next/link';
import { Sparkles, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { SchoolSubscriptionInfo } from '@/lib/saas/limits';

interface TrialBannerProps {
  subscription: SchoolSubscriptionInfo | null;
}

export function TrialBanner({ subscription }: TrialBannerProps) {
  if (!subscription) return null;

  const { status, trialDaysLeft, isTrialActive, isSubscriptionValid, plan } = subscription;

  // 1. Alerta de Inadimplência ou Expirado
  if (!isSubscriptionValid) {
    return (
      <div className="w-full bg-red-950/80 border-b border-red-500/30 px-4 py-2.5 text-white flex flex-wrap items-center justify-between gap-3 text-xs shadow-lg backdrop-blur-md sticky top-0 z-40 animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="flex items-center gap-2 font-bold">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 animate-bounce" />
          <span>
            Seu período de testes ou assinatura expirou. Regularize o plano da sua escola para desbloquear todos os recursos.
          </span>
        </div>
        <Link
          href="/escola/assinatura"
          className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg font-black uppercase tracking-wider text-[11px] transition-all flex items-center gap-1.5 shadow-md shadow-red-600/30 shrink-0"
        >
          Regularizar Agora
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  // 2. Banner de Trial Ativo com Contagem Regressiva
  if (isTrialActive) {
    return (
      <div className="w-full bg-gradient-to-r from-red-950/60 via-[#12121A] to-neutral-900 border-b border-red-500/20 px-4 py-2 text-white flex flex-wrap items-center justify-between gap-3 text-xs backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
            <Sparkles className="w-3 h-3 text-red-400 animate-spin duration-3000" />
          </div>
          <span className="text-gray-300">
            Você está no <strong className="text-white font-black">Período de Testes Grátis</strong> do Plano <strong className="text-red-400">{plan?.name || 'Stage Pro'}</strong>.
            Restam <span className="px-2 py-0.5 bg-red-500/20 text-red-300 rounded font-black border border-red-500/30">{trialDaysLeft} {trialDaysLeft === 1 ? 'dia' : 'dias'}</span> de acesso livre.
          </span>
        </div>
        <Link
          href="/escola/assinatura"
          className="px-3.5 py-1 bg-red-600/20 hover:bg-red-600 border border-red-500/30 text-red-200 hover:text-white rounded-lg font-bold text-[11px] transition-all flex items-center gap-1.5 shrink-0"
        >
          Assinar Definitivo
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    );
  }

  return null;
}
