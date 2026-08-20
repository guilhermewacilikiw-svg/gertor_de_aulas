'use client';

import { useState } from 'react';
import { Plus, X, Loader2, CreditCard, Calendar, User, Sparkles } from 'lucide-react';
import { createInvoiceAction } from './actions';
import confetti from 'canvas-confetti';

export function CreateInvoiceModal({ students }: { students: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const res = await createInvoiceAction(formData);
    
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
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C0E87A] to-[#E5E87A] hover:scale-105 text-black font-black text-xs shadow-[0_0_20px_rgba(192,232,122,0.4)] transition-all flex items-center gap-2 group"
      >
        <Plus className="w-4 h-4 stroke-[3] group-hover:rotate-90 transition-transform" />
        Nova Cobrança
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#0a0a0f] border border-white/10 rounded-3xl p-6 shadow-2xl text-white">
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#E5E87A]/10 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
              <div>
                <span className="text-xs font-bold text-[#E5E87A] uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Faturamento
                </span>
                <h2 className="text-xl font-black text-white">Nova Cobrança</h2>
                <p className="text-xs text-gray-400 mt-0.5">Gere uma fatura ou cobrança para um aluno.</p>
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
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Aluno (Cliente)</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <select
                    name="student_id"
                    required
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#E5E87A] focus:ring-1 focus:ring-[#E5E87A] transition-all appearance-none"
                  >
                    <option value="" className="bg-[#0a0a0f]">Selecione um aluno...</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id} className="bg-[#0a0a0f]">{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Valor (R$)</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="amount"
                    required
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#E5E87A] focus:ring-1 focus:ring-[#E5E87A] transition-all placeholder-gray-600"
                    placeholder="Ex: 150.00"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Data de Vencimento</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="date"
                    name="due_date"
                    required
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#E5E87A] focus:ring-1 focus:ring-[#E5E87A] transition-all"
                  />
                </div>
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
                  className="flex-1 py-3.5 rounded-xl bg-[#E5E87A] text-black font-black text-sm hover:brightness-110 shadow-[0_0_15px_rgba(229,232,122,0.4)] transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Gerar Cobrança'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
