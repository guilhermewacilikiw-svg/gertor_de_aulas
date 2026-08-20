'use client';

import { Star, Award, TrendingUp, Sparkles } from 'lucide-react';

interface StudentAssessmentDisplayProps {
  categoryName?: string;
  evaluatorName?: string;
  evaluatedAt?: string;
  scores?: Record<string, number>;
  notes?: string;
}

export function AvaliacaoProgressCard({
  categoryName = 'Violão Básico',
  evaluatorName = 'Equipe Pedagógica',
  evaluatedAt = '10/08/2026',
  scores = {
    'Técnica & Digitação': 8.5,
    'Ritmo & Andamento': 9.0,
    'Teoria Musical': 7.5,
    'Repertório & Prática': 9.5
  },
  notes = 'Ótima evolução técnica nesta etapa! A transição entre os acordes C e G evoluiu significativamente.'
}: StudentAssessmentDisplayProps) {
  const scoreEntries = Object.entries(scores);
  const averageScore = scoreEntries.length > 0
    ? (scoreEntries.reduce((acc, [_, val]) => acc + val, 0) / scoreEntries.length).toFixed(1)
    : '8.8';

  return (
    <div className="bg-neutral-900/30 border border-neutral-800 rounded-3xl p-6 border border-white/10 shadow-xl space-y-5">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Award className="w-4 h-4" />
            Avaliação Pedagógica
          </div>
          <h3 className="text-lg font-black text-white mt-0.5">{categoryName}</h3>
          <p className="text-xs text-gray-400">Avaliador: Prof. {evaluatorName} • {evaluatedAt}</p>
        </div>

        {/* Media Score Badge */}
        <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300">
          <span className="text-2xl font-black">{averageScore}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Média</span>
        </div>
      </div>

      {/* Criteria Breakdown */}
      <div className="space-y-3">
        {scoreEntries.map(([criterion, score]) => (
          <div key={criterion} className="space-y-1">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-gray-300">{criterion}</span>
              <span className="text-cyan-400 font-extrabold">{score.toFixed(1)} / 10</span>
            </div>
            <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-amber-400 rounded-full transition-all duration-700"
                style={{ width: `${(score / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Teacher Notes */}
      {notes && (
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5" />
            Parecer do Professor:
          </div>
          <p className="text-xs text-gray-300 italic leading-relaxed">
            "{notes}"
          </p>
        </div>
      )}

    </div>
  );
}
