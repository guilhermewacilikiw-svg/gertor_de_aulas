'use client';

import { useState } from 'react';
import { Award, Check, Loader2, Star, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface AssessmentCriterion {
  id: string;
  name: string;
  score: number;
}

interface AvaliarAlunoModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentName: string;
  schoolId: string;
  evaluatorId: string;
  categoryName?: string;
  initialCriteria?: { id: string; name: string; score: number }[];
  onSuccess?: () => void;
}

export function AvaliarAlunoModal({
  isOpen,
  onClose,
  studentId,
  studentName,
  schoolId,
  evaluatorId,
  categoryName = 'Música / Violão',
  initialCriteria = [
    { id: 'c1', name: 'Técnica & Digitação', score: 8.5 },
    { id: 'c2', name: 'Ritmo & Andamento', score: 9.0 },
    { id: 'c3', name: 'Teoria Musical', score: 7.5 },
    { id: 'c4', name: 'Repertório & Prática', score: 9.5 }
  ],
  onSuccess
}: AvaliarAlunoModalProps) {
  const [loading, setLoading] = useState(false);
  const [criteria, setCriteria] = useState<AssessmentCriterion[]>(initialCriteria);
  const [notes, setNotes] = useState('Ótima evolução técnica nesta etapa!');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleScoreChange = (id: string, newScore: number) => {
    setCriteria(prev => prev.map(c => c.id === id ? { ...c, score: newScore } : c));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();

      const scoresJson: Record<string, number> = {};
      criteria.forEach(c => {
        scoresJson[c.name] = c.score;
      });

      // Save to student_assessments
      await supabase.from('student_assessments').insert({
        school_id: schoolId,
        assessment_id: '10000000-0000-0000-0000-700000000001', // Generic assessment ID
        student_id: studentId,
        evaluator_id: evaluatorId,
        scores_json: scoresJson,
        notes: notes,
        evaluated_at: new Date().toISOString()
      });

      // Send notification to student
      await supabase.from('notifications').insert({
        school_id: schoolId,
        user_id: (
          await supabase.from('students').select('user_id').eq('id', studentId).single()
        ).data?.user_id,
        type: 'assessment_published',
        title: 'Nova Avaliação Didática! ⭐',
        message: `Sua avaliação em "${categoryName}" foi publicada pelo professor. Confira suas notas e orientações!`,
        data: { scores: scoresJson }
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Award className="w-4 h-4" />
              Avaliação Pedagógica
            </div>
            <h2 className="text-xl font-black text-white">{studentName}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{categoryName}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {success && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm font-bold flex items-center justify-center gap-2">
            <Check className="w-5 h-5" />
            <span>Avaliação salva e notificação enviada com sucesso!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Criteria Sliders */}
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Critérios de Desempenho (0 a 10)
            </label>

            {criteria.map((c) => (
              <div key={c.id} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-200">{c.name}</span>
                  <span className="text-cyan-400 text-sm">{c.score.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={c.score}
                  onChange={(e) => handleScoreChange(c.id, parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 bg-white/10 rounded-lg h-2 cursor-pointer"
                />
              </div>
            ))}
          </div>

          {/* Feedback Notes */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
              Observações & Recomendações
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Descreva pontos fortes e o que o aluno precisa aprimorar..."
              className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:brightness-110 text-white font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Star className="w-5 h-5 fill-white" />
                <span>SALVAR AVALIAÇÃO DO ALUNO</span>
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
}
