'use client';

import { useState } from 'react';
import { Users, BookOpen, GraduationCap, ArrowLeft, Loader2, Hash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { createClassAction } from '../actions';

interface NovoTurmaFormProps {
  courses: { id: string; name: string }[];
  teachers: { id: string; users?: { name: string } | null }[];
}

export function NovoTurmaForm({ courses, teachers }: NovoTurmaFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await createClassAction(formData);

    if (res.success) {
      confetti({
        particleCount: 120,
        spread: 75,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        router.push('/escola/turmas');
      }, 1200);
    } else {
      setError(res.error || 'Erro ao cadastrar turma. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header com Botão Voltar */}
      <div className="flex items-center gap-4">
        <Link 
          href="/escola/turmas" 
          className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors text-white border border-white/10 hover:border-white/20"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Nova Turma</h1>
          <p className="text-sm text-red-500 font-mono uppercase tracking-widest mt-1">VINCULAR CURSO, PROFESSOR E VAGAS</p>
        </div>
      </div>

      {/* Card do Formulário */}
      <div className="bg-[#12121A] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-[80px] pointer-events-none"></div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {error && (
            <div className="p-4 bg-red-500/20 text-red-300 border border-red-500/30 rounded-2xl text-sm font-bold animate-in fade-in">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Nome da Turma */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/80 ml-1 uppercase tracking-wider">
                Nome da Turma <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all placeholder:text-white/30"
                  placeholder="Ex: Guitarra Iniciante - Turma Terça 19h"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Curso Vinculado */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/80 ml-1 uppercase tracking-wider">
                  Curso Vinculado <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
                  <select
                    name="course_id"
                    required
                    defaultValue=""
                    className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-[#12121A] text-gray-500">
                      Selecione um curso...
                    </option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#12121A] text-white">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Professor Responsável */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/80 ml-1 uppercase tracking-wider">
                  Professor Responsável
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
                  <select
                    name="teacher_id"
                    defaultValue=""
                    className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#12121A] text-gray-400">
                      Nenhum professor (Definir depois)
                    </option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id} className="bg-[#12121A] text-white">
                        {t.users?.name || 'Professor'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Capacidade de Vagas */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/80 ml-1 uppercase tracking-wider">
                Capacidade Máxima de Vagas
              </label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="number"
                  name="capacity"
                  min="1"
                  max="100"
                  defaultValue={30}
                  className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all placeholder:text-white/30"
                  placeholder="30"
                />
              </div>
              <p className="text-[11px] text-gray-500 ml-1">
                Limite máximo de alunos que podem ser matriculados simultaneamente nesta turma.
              </p>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/5">
            <Link
              href="/escola/turmas"
              className="px-6 py-4 rounded-2xl text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-red-600/30 hover:shadow-red-600/50 hover:scale-105 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Salvando Turma...' : 'Salvar Turma'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
