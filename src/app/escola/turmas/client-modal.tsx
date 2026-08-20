'use client';

import { useState } from 'react';
import { Plus, X, Loader2, Users, BookOpen, Sparkles } from 'lucide-react';
import { createClassAction } from './actions';
import confetti from 'canvas-confetti';

export function CreateClassModal({ courses, teachers }: { courses: any[], teachers: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const res = await createClassAction(formData);
    
    if (res.success) {
      setIsOpen(false);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      setError(res.error || 'Erro desconhecido');
    }
    
    setLoading(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#A27AE8] to-[#C77AE8] hover:scale-105 text-white font-black text-xs shadow-[0_0_20px_rgba(162,122,232,0.4)] transition-all flex items-center gap-2 group"
      >
        <Plus className="w-4 h-4 stroke-[3] group-hover:rotate-90 transition-transform" />
        Nova Turma
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#0a0a0f] border border-white/10 rounded-3xl p-6 shadow-2xl text-white">
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#A27AE8]/10 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
              <div>
                <span className="text-xs font-bold text-[#A27AE8] uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Cadastro
                </span>
                <h2 className="text-xl font-black text-white">Nova Turma</h2>
                <p className="text-xs text-gray-400 mt-0.5">Cadastre uma nova turma vinculada a um curso.</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="pt-6 space-y-4 relative z-10">
              {error && (
                <div className="p-3 bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl text-xs font-bold">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Nome da Turma</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#A27AE8] focus:ring-1 focus:ring-[#A27AE8] transition-all placeholder-gray-600"
                    placeholder="Ex: Turma A - Manhã"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Curso Vinculado</label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <select
                    name="course_id"
                    required
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#A27AE8] focus:ring-1 focus:ring-[#A27AE8] transition-all appearance-none"
                  >
                    <option value="" className="bg-[#0a0a0f]">Selecione um curso...</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#0a0a0f]">{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Professor (Opcional)</label>
                <select
                  name="teacher_id"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-[#A27AE8] focus:ring-1 focus:ring-[#A27AE8] transition-all"
                >
                  <option value="" className="bg-[#0a0a0f]">Nenhum professor definido</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id} className="bg-[#0a0a0f]">{t.users?.name} ({t.specialty})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Capacidade (Vagas)</label>
                <input
                  type="number"
                  name="capacity"
                  required
                  defaultValue={30}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-[#A27AE8] focus:ring-1 focus:ring-[#A27AE8] transition-all"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3.5 rounded-xl bg-[#A27AE8] text-white font-black text-sm hover:brightness-110 shadow-[0_0_15px_rgba(162,122,232,0.4)] transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Criar Turma'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
