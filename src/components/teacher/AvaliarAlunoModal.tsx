'use client';

import { useState } from 'react';
import { Award, Check, Loader2, Star, Sparkles, Plus, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export interface AssessmentCriterion {
  id: string;
  name: string;
  score: number;
  isHighlighted?: boolean;
}

interface AvaliarAlunoModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentName: string;
  schoolId: string;
  evaluatorId: string;
  categoryName?: string;
  initialCriteria?: AssessmentCriterion[];
  onSuccess?: () => void;
}

export function AvaliarAlunoModal({
  isOpen,
  onClose,
  studentId,
  studentName,
  schoolId,
  evaluatorId,
  categoryName = 'Música / Prática',
  initialCriteria = [
    { id: 'c1', name: 'Técnica & Digitação', score: 8.5, isHighlighted: false },
    { id: 'c2', name: 'Ritmo & Andamento', score: 9.0, isHighlighted: false },
    { id: 'c3', name: 'Teoria Musical', score: 7.5, isHighlighted: false },
    { id: 'c4', name: 'Repertório Musical', score: 9.5, isHighlighted: true }
  ],
  onSuccess
}: AvaliarAlunoModalProps) {
  const [loading, setLoading] = useState(false);
  const [criteria, setCriteria] = useState<AssessmentCriterion[]>(initialCriteria);
  const [newActivityName, setNewActivityName] = useState('');
  const [notes, setNotes] = useState('Ótima evolução técnica nesta etapa!');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleScoreChange = (id: string, newScore: number) => {
    let score = Math.max(0, Math.min(10, newScore));
    score = Math.round(score * 10) / 10;
    setCriteria(prev => prev.map(c => c.id === id ? { ...c, score } : c));
  };

  const handleToggleHighlight = (id: string) => {
    setCriteria(prev => prev.map(c => c.id === id ? { ...c, isHighlighted: !c.isHighlighted } : c));
  };

  const handleAddActivity = () => {
    if (!newActivityName.trim()) return;
    const newId = `c-${Date.now()}`;
    setCriteria(prev => [
      ...prev,
      { id: newId, name: newActivityName.trim(), score: 8.0, isHighlighted: false }
    ]);
    setNewActivityName('');
  };

  const handleRemoveActivity = (id: string) => {
    if (criteria.length <= 1) {
      alert('É necessário manter ao menos uma atividade avaliada.');
      return;
    }
    setCriteria(prev => prev.filter(c => c.id !== id));
  };

  const averageScore = criteria.length > 0
    ? Math.round((criteria.reduce((acc, c) => acc + c.score, 0) / criteria.length) * 10) / 10
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();

      // 1. Create or ensure parent assessment
      const { data: assessment } = await supabase
        .from('assessments')
        .insert({
          school_id: schoolId,
          title: `Avaliação Individual: ${studentName}`,
          description: `Avaliação didática em ${categoryName}`,
          category: 'individual'
        })
        .select()
        .single();

      const assessmentId = assessment?.id;

      if (assessmentId) {
        // 2. Insert items
        const items = criteria.map(c => ({
          school_id: schoolId,
          assessment_id: assessmentId,
          name: c.name,
          max_score: 10.00,
          weight: c.isHighlighted ? 1.5 : 1.0,
          is_highlighted: !!c.isHighlighted
        }));
        await supabase.from('assessment_items').insert(items);
      }

      // 3. Prepare scores_json
      const scoresJson: Record<string, any> = {
        activities: criteria.map(c => ({
          name: c.name,
          score: c.score,
          is_highlighted: !!c.isHighlighted
        })),
        final_grade: averageScore,
        progress: Math.round(averageScore * 10),
        highlighted_activity: criteria.find(c => c.isHighlighted)?.name || null
      };

      criteria.forEach(c => {
        scoresJson[c.name] = c.score;
      });

      // 4. Save to student_assessments
      await supabase.from('student_assessments').insert({
        school_id: schoolId,
        assessment_id: assessmentId || null,
        student_id: studentId,
        evaluator_id: evaluatorId,
        scores_json: scoresJson,
        notes: notes,
        evaluated_at: new Date().toISOString()
      });

      // 5. Send notification to student
      const { data: stdRecord } = await supabase
        .from('students')
        .select('user_id')
        .eq('id', studentId)
        .single();

      if (stdRecord?.user_id) {
        const highlightedName = criteria.find(c => c.isHighlighted)?.name;
        const hlText = highlightedName ? ` Destaque na atividade: ${highlightedName}.` : '';
        await supabase.from('notifications').insert({
          school_id: schoolId,
          user_id: stdRecord.user_id,
          type: 'assessment_published',
          title: 'Nova Avaliação Didática! ⭐',
          message: `Sua nota geral foi ${averageScore.toFixed(1)}/10 em "${categoryName}".${hlText}`,
          data: { scores: scoresJson }
        });
      }

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
      <div className="relative w-full max-w-lg bg-[#0e0e14] border border-white/10 rounded-3xl p-6 shadow-2xl text-white space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 uppercase tracking-wider">
              <Award className="w-4 h-4" />
              Avaliação Pedagógica (Notas 0 a 10)
            </div>
            <h2 className="text-xl font-black text-white mt-0.5">{studentName}</h2>
            <p className="text-xs text-gray-400">{categoryName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {success && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-white text-sm font-bold flex items-center justify-center gap-2">
            <Check className="w-5 h-5 text-red-500" />
            <span>Avaliação salva e notificação enviada com sucesso!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Criteria & Activities list */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Atividades & Notas (0 a 10)
              </label>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                Média: {averageScore.toFixed(1)} / 10
              </span>
            </div>

            <div className="space-y-2.5">
              {criteria.map((c) => (
                <div 
                  key={c.id} 
                  className={`p-3.5 rounded-2xl border transition-all space-y-2 ${
                    c.isHighlighted
                      ? 'bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-500/20'
                      : 'bg-white/5 border-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-2 truncate">
                      <button
                        type="button"
                        onClick={() => handleToggleHighlight(c.id)}
                        title={c.isHighlighted ? 'Remover destaque' : 'Destacar atividade'}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                          c.isHighlighted
                            ? 'bg-amber-500 text-black shadow-md'
                            : 'bg-white/10 text-gray-400 hover:text-amber-400'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${c.isHighlighted ? 'fill-black' : ''}`} />
                      </button>
                      <span className={`truncate ${c.isHighlighted ? 'text-amber-300 font-black' : 'text-gray-200'}`}>
                        {c.name}
                      </span>
                      {c.isHighlighted && (
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-black">
                          Destaque
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-black ${c.isHighlighted ? 'text-amber-300' : 'text-white'}`}>
                        {c.score.toFixed(1)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveActivity(c.id)}
                        className="w-6 h-6 rounded-lg text-gray-500 hover:text-red-400 flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={c.score}
                    onChange={(e) => handleScoreChange(c.id, parseFloat(e.target.value))}
                    className="w-full accent-red-500 bg-white/10 rounded-lg h-2 cursor-pointer"
                  />
                </div>
              ))}
            </div>

            {/* Add new activity inline */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newActivityName}
                onChange={(e) => setNewActivityName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddActivity(); }}}
                placeholder="Adicionar nova atividade..."
                className="flex-1 px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-red-500"
              />
              <button
                type="button"
                onClick={handleAddActivity}
                disabled={!newActivityName.trim()}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-40 text-xs font-bold text-white flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                Adicionar
              </button>
            </div>
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
              className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-red-500/50"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-black text-sm shadow-xl shadow-red-600/20 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Star className="w-5 h-5 fill-white" />
                <span>SALVAR AVALIAÇÃO DO ALUNO (MÉDIA {averageScore.toFixed(1)})</span>
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
}
