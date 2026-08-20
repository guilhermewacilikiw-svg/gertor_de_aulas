'use client';

import { CheckCircle2, Lock, Play, Compass, ChevronRight } from 'lucide-react';

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
  status: 'completed' | 'current' | 'locked';
}

interface TrilhaAprendizagemProps {
  courseName?: string;
  modules?: LearningModule[];
}

export function TrilhaAprendizagemCard({
  courseName = 'Violão Básico',
  modules = [
    { id: 'm1', title: 'Módulo 1: Conhecendo o Instrumento', description: 'Postura, afinação e primeiros dedos.', orderIndex: 1, status: 'completed' },
    { id: 'm2', title: 'Módulo 2: Acordes Maiores e Menores', description: 'Troca de acordes (C, D, G, F, Bm) e digitação.', orderIndex: 2, status: 'current' },
    { id: 'm3', title: 'Módulo 3: Ritmos e Batidas Pop', description: 'Desenvolvimento de mão direita e metrônomo.', orderIndex: 3, status: 'locked' },
    { id: 'm4', title: 'Módulo 4: Primeiras Músicas do Repertório', description: 'Aplicação prática em músicas completas.', orderIndex: 4, status: 'locked' }
  ]
}: TrilhaAprendizagemProps) {
  return (
    <div className="bg-neutral-900/30 border border-neutral-800 rounded-3xl p-6 border border-white/10 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-lg font-black text-white">Trilha de Aprendizagem</h3>
            <p className="text-xs text-gray-400">{courseName}</p>
          </div>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
          Etapa 2 de {modules.length}
        </span>
      </div>

      {/* Modules List */}
      <div className="space-y-4 relative">
        {/* Connecting line */}
        <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-white/10 z-0"></div>

        {modules.map((mod) => {
          const isCompleted = mod.status === 'completed';
          const isCurrent = mod.status === 'current';
          const isLocked = mod.status === 'locked';

          return (
            <div
              key={mod.id}
              className={`relative z-10 p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                isCurrent
                  ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-500/50 shadow-lg'
                  : isCompleted
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-white/5 border-white/5 opacity-60'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-md shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : isCurrent
                      ? 'bg-gradient-to-tr from-cyan-400 to-indigo-500 text-white animate-pulse'
                      : 'bg-white/10 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : isLocked ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 fill-white" />
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm">{mod.title}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">{mod.description}</p>
                </div>
              </div>

              <div>
                {isCurrent && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs shadow-md">
                    Atual <ChevronRight className="w-3 h-3" />
                  </span>
                )}
                {isCompleted && (
                  <span className="text-xs font-bold text-emerald-400">Concluído</span>
                )}
                {isLocked && (
                  <span className="text-xs font-semibold text-gray-500">Bloqueado</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
