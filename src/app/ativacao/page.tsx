'use client';

import { useState } from 'react';
import { Loader2, Lock, ShieldCheck } from 'lucide-react';
import { changePasswordAction } from './actions';

export default function AtivacaoPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const res = await changePasswordAction(formData);
    
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
    // if success, it redirects in the action
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse duration-10000" />
      
      <div className="w-full max-w-md bg-[#12121A] border border-white/10 rounded-3xl p-8 relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center border border-red-500/30">
            <ShieldCheck className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-white tracking-tight mb-2">Ative sua Conta</h1>
          <p className="text-sm text-gray-400">
            Por segurança, você precisa criar uma senha definitiva no seu primeiro acesso.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Nova Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
                  placeholder="Mínimo de 6 caracteres"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Confirmar Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  name="confirm_password"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
                  placeholder="Repita a nova senha"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-red-600 hover:bg-red-500 hover:scale-[1.02] active:scale-[0.98] text-white font-black uppercase tracking-widest text-sm rounded-2xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] flex items-center justify-center disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Salvar e Acessar'}
          </button>
        </form>
      </div>
    </div>
  );
}
