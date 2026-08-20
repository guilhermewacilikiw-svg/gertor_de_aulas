'use client';

import { useState } from 'react';
import { Check, Video, FileText, UserCheck, AlertCircle, Sparkles, Loader2 } from 'lucide-react';
import { completeLessonFlow } from '@/lib/db/actions';

interface StudentParticipant {
  id: string;
  name: string;
  attendance: 'present' | 'absent' | 'justified' | 'late';
}

interface FinalizarAulaModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonId: string;
  schoolId: string;
  teacherId: string;
  lessonTopic: string;
  className: string;
  initialStudents?: StudentParticipant[];
  onSuccess?: () => void;
}

export function FinalizarAulaModal({
  isOpen,
  onClose,
  lessonId,
  schoolId,
  teacherId,
  lessonTopic,
  className,
  initialStudents = [],
  onSuccess
}: FinalizarAulaModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);

  const [students, setStudents] = useState<StudentParticipant[]>(initialStudents);
  const [summary, setSummary] = useState(lessonTopic || '');
  const [topicsText, setTopicsText] = useState('');
  const [practiceInstructions, setPracticeInstructions] = useState('');
  const [teacherNotes, setTeacherNotes] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoPath, setVideoPath] = useState('');

  if (!isOpen) return null;

  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent' | 'justified' | 'late') => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, attendance: status } : s));
  };

  const handleFinalize = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await completeLessonFlow({
        lessonId,
        schoolId,
        teacherId,
        summary,
        topics: topicsText.split(',').map(t => t.trim()),
        teacherNotes,
        practiceInstructions,
        attendances: students.map(s => ({ studentId: s.id, status: s.attendance })),
        video: videoPath ? { title: videoTitle, storagePath: videoPath, duration: 180 } : undefined
      });

      setSuccessMsg(true);
      setTimeout(() => {
        setSuccessMsg(false);
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao finalizar aula. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Finalização Rápida</span>
            <h2 className="text-xl font-black text-white">{className}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{lessonTopic}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm flex items-center justify-center gap-2 font-bold animate-in zoom-in-95">
            <Check className="w-5 h-5" />
            <span>Aula finalizada com sucesso! Notificação enviada.</span>
          </div>
        )}

        <form onSubmit={handleFinalize} className="space-y-5">
          
          {/* STEP 1: Presença */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              1. Confirmar Presença
            </label>
            <div className="space-y-2">
              {students.map((st) => (
                <div key={st.id} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-sm font-semibold">{st.name}</span>
                  <div className="flex gap-1.5">
                    {(['present', 'absent', 'justified'] as const).map((stt) => (
                      <button
                        key={stt}
                        type="button"
                        onClick={() => handleAttendanceChange(st.id, stt)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all ${
                          st.attendance === stt
                            ? stt === 'present' ? 'bg-emerald-500 text-white shadow-md' : 'bg-red-500 text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        {stt === 'present' ? 'Presente' : stt === 'absent' ? 'Falta' : 'Justificado'}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 2: Conteúdo e Resumo */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              2. Resumo do Conteúdo Trabalhado
            </label>
            <input
              type="text"
              required
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Ex: Acordes C, D e G e Batida Pop"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* STEP 3: Orientação para Prática */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              3. Orientação de Prática para o Aluno
            </label>
            <textarea
              rows={2}
              value={practiceInstructions}
              onChange={(e) => setPracticeInstructions(e.target.value)}
              placeholder="O que o aluno deve treinar até a próxima aula?"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* STEP 4: Vídeo da Aula */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
              <Video className="w-4 h-4 text-pink-400" />
              4. Vídeo da Aula (Gravada)
            </label>
            <div className="space-y-2">
              <input
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="Título do vídeo (Ex: Aula Prática 1)"
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-pink-500"
              />
              <input
                type="url"
                value={videoPath}
                onChange={(e) => setVideoPath(e.target.value)}
                placeholder="Link do Vídeo (Zoom, Drive, YouTube, etc)"
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          {/* SUBMIT ACTION BUTTON */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-2xl bg-white text-black font-medium hover:brightness-110 text-white font-extrabold text-base shadow-xl transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Finalizando Aula...</span>
                </>
              ) : (
                <>
                  <Check className="w-5 h-5 stroke-[3]" />
                  <span>FINALIZAR AULA</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
