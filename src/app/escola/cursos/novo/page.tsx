'use client';

import { useState } from 'react';
import { BookOpen, AlignLeft, ArrowLeft, Loader2, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { createCourseAction } from '../actions';

export default function NovoCursoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const res = await createCourseAction(formData);
    
    if (res.success) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        router.push('/escola/cursos');
      }, 1500);
    } else {
      setError(res.error || 'Erro desconhecido');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex items-center gap-4">
        <Link 
          href="/escola/cursos"
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white hover:text-white hover:border-white transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            Novo Curso
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Cadastre um novo curso para a grade curricular da escola.
          </p>
        </div>
      </div>

      <div className="relative w-full rounded-2xl bg-[#0a0a0a] border border-white/5 overflow-hidden shadow-2xl p-8 md:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-[100px] animate-pulse mix-blend-screen translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-600/20 rounded-full blur-[80px] animate-pulse mix-blend-screen -translate-x-1/3 translate-y-1/3" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-[0_0_20px_rgba(229,232,122,0.15)] mb-8">
            <Star className="w-4 h-4 text-white" />
            <span className="text-xs font-black uppercase tracking-widest text-white/80">
              Dados do Curso
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Nome do Curso</label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors z-10" />
                <input
                  type="text"
                  name="name"
                  required
                  className="relative w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-white font-medium placeholder:text-gray-600"
                  placeholder="Ex: Inglês Intermediário"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Descrição</label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                <AlignLeft className="absolute left-4 top-4 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors z-10" />
                <textarea
                  name="description"
                  className="relative w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-white font-medium placeholder:text-gray-600 min-h-[120px] resize-none"
                  placeholder="Descrição opcional do curso..."
                />
              </div>
            </div>

            <div className="pt-6 flex gap-4">
              <Link 
                href="/escola/cursos"
                className="flex-1 py-4 rounded-2xl bg-white/5 text-gray-400 font-bold hover:bg-white/10 hover:text-white transition-all text-center border border-white/5 hover:border-white/10"
              >
                Cancelar
              </Link>
              <button 
                type="submit"
                disabled={loading}
                className="flex-[2] py-4 rounded-2xl bg-gradient-to-r from-white to-[#D4D76A] text-white font-black hover:opacity-90 transition-all shadow-[0_0_30px_rgba(229,232,122,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Curso'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
