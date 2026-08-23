'use client';

import { useState } from 'react';
import { Plus, X, Loader2, Mail, Lock, User, BookOpen } from 'lucide-react';
import { createTeacherAction } from './actions';
import confetti from 'canvas-confetti';

export function InviteTeacherModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const res = await createTeacherAction(formData);
    
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
        className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
      >
        <Plus className="w-4 h-4" />
        Novo Professor
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95">
          <div className="bg-[#050505] w-full max-w-md rounded-none shadow-[0_0_50px_rgba(0,0,0,1)] border border-white/10 relative overflow-hidden cyber-clip animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/40">
              <div>
                <h3 className="font-black text-xl text-white uppercase tracking-tight">Novo Professor</h3>
                <p className="text-xs text-[#A27AE8] font-mono uppercase tracking-widest mt-1">INICIALIZAR ACESSO DOCENTE</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 border border-white/10 hover:bg-white/5 text-white/50 hover:text-white transition-colors cyber-clip-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/80 ml-1 uppercase tracking-wider">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-none py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#C0E87A] focus:ring-1 focus:ring-[#C0E87A] transition-all placeholder:text-white/30"
                    placeholder="Ex: Carlos Eduardo"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/80 ml-1 uppercase tracking-wider">Especialidade (Matéria)</label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    name="specialty"
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-none py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#C0E87A] focus:ring-1 focus:ring-[#C0E87A] transition-all placeholder:text-white/30"
                    placeholder="Ex: Matemática"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/80 ml-1 uppercase tracking-wider">E-mail de Acesso</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-none py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#C0E87A] focus:ring-1 focus:ring-[#C0E87A] transition-all placeholder:text-white/30"
                    placeholder="carlos@escola.com.br"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/80 ml-1 uppercase tracking-wider">Senha Inicial</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    name="password"
                    required
                    defaultValue="senha123"
                    className="w-full bg-black/50 border border-white/10 rounded-none py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#C0E87A] focus:ring-1 focus:ring-[#C0E87A] transition-all placeholder:text-white/30"
                  />
                </div>
                <p className="text-[10px] text-white/50 ml-1 font-mono uppercase">O professor poderá alterar a senha depois.</p>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-3 bg-black/40 border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-colors cyber-clip-btn"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-[#C0E87A] text-black font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_15px_rgba(192,232,122,0.3)] flex items-center justify-center gap-2 cyber-clip-btn"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Criar Acesso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
