'use client';

import { useState } from 'react';
import { Plus, X, Loader2, CreditCard, Calendar, User, Sparkles, FileText, Settings, Link as LinkIcon, Edit2 } from 'lucide-react';
import { createInvoiceAction, upsertFinanceAction, updateInvoiceAction } from './actions';
import confetti from 'canvas-confetti';

export function CreateInvoiceModal({ students }: { students: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'contract' | 'invoice'>('invoice');

  const handleContractSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const res = await upsertFinanceAction(formData);
    
    if (res.success) {
      setIsOpen(false);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } else {
      setError(res.error || 'Erro desconhecido');
    }
    setLoading(false);
  };

  const handleInvoiceSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const res = await createInvoiceAction(formData);
    
    if (res.success) {
      setIsOpen(false);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
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
                <h2 className="text-xl font-black text-white">Gerenciar Finanças</h2>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-2 mt-4 relative z-10">
              <button 
                onClick={() => { setMode('invoice'); setError(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${mode === 'invoice' ? 'bg-[#E5E87A] text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
              >
                Gerar Fatura
              </button>
              <button 
                onClick={() => { setMode('contract'); setError(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${mode === 'contract' ? 'bg-[#E5E87A] text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
              >
                Configurar Contrato
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl text-xs font-bold relative z-10">
                {error}
              </div>
            )}

            {mode === 'contract' ? (
              <form onSubmit={handleContractSubmit} className="pt-4 space-y-4 relative z-10">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Aluno</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <select name="student_id" required className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#E5E87A] focus:ring-1 focus:ring-[#E5E87A] transition-all appearance-none">
                      <option value="" className="bg-[#0a0a0f]">Selecione um aluno...</option>
                      {students.map((s) => <option key={s.id} value={s.id} className="bg-[#0a0a0f]">{s.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Nome do Plano/Contrato</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="text" name="plan_name" required className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#E5E87A] focus:ring-1 focus:ring-[#E5E87A] transition-all placeholder-gray-600" placeholder="Ex: Mensalidade Violão Iniciante" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Valor Mensal (R$)</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="number" step="0.01" min="0" name="amount" required className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#E5E87A] focus:ring-1 focus:ring-[#E5E87A] transition-all placeholder-gray-600" placeholder="Ex: 150.00" />
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="space-y-1 flex-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Dia Vencimento</label>
                    <input type="number" min="1" max="31" name="due_day" required className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-[#E5E87A] focus:ring-1 focus:ring-[#E5E87A] transition-all placeholder-gray-600" placeholder="Ex: 10" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Forma</label>
                    <select name="payment_method" required className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-[#E5E87A] focus:ring-1 focus:ring-[#E5E87A] transition-all appearance-none">
                      <option value="boleto">Boleto</option>
                      <option value="pix">Pix</option>
                      <option value="credit_card">Cartão</option>
                      <option value="cash">Dinheiro</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl bg-[#E5E87A] text-black font-black text-sm hover:brightness-110 shadow-[0_0_15px_rgba(229,232,122,0.4)] transition-all flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Salvar Contrato'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleInvoiceSubmit} className="pt-4 space-y-4 relative z-10">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Aluno (Com Contrato Ativo)</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <select name="student_id" required className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#E5E87A] focus:ring-1 focus:ring-[#E5E87A] transition-all appearance-none">
                      <option value="" className="bg-[#0a0a0f]">Selecione um aluno...</option>
                      {students.map((s) => <option key={s.id} value={s.id} className="bg-[#0a0a0f]">{s.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Data Exata de Vencimento</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="date" name="due_date" required className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#E5E87A] focus:ring-1 focus:ring-[#E5E87A] transition-all" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Link do Boleto (Opcional)</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="url" name="boleto_url" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#E5E87A] focus:ring-1 focus:ring-[#E5E87A] transition-all placeholder-gray-600" placeholder="https://banco.com.br/boleto..." />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl bg-[#E5E87A] text-black font-black text-sm hover:brightness-110 shadow-[0_0_15px_rgba(229,232,122,0.4)] transition-all flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Gerar Fatura'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export function UpdateInvoiceModal({ invoice }: { invoice: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    formData.append('invoice_id', invoice.id);
    
    const res = await updateInvoiceAction(formData);
    
    if (res.success) {
      setIsOpen(false);
      if (formData.get('status') === 'paid' && invoice.status !== 'paid') {
         confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    } else {
      setError(res.error || 'Erro desconhecido');
    }
    setLoading(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors group-hover:bg-white/10 border border-white/5"
        title="Editar Fatura"
      >
        <Edit2 className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm max-h-[90vh] overflow-y-auto bg-[#0a0a0f] border border-white/10 rounded-3xl p-6 shadow-2xl text-white">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div>
                <h2 className="text-xl font-black text-white">Atualizar Fatura</h2>
                <p className="text-xs text-gray-400 mt-0.5">{invoice.students?.name}</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl text-xs font-bold">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Status do Pagamento</label>
                <select name="status" defaultValue={invoice.status} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-[#E5E87A] focus:ring-1 focus:ring-[#E5E87A] transition-all appearance-none">
                  <option value="pending" className="bg-[#0a0a0f]">Pendente</option>
                  <option value="paid" className="bg-[#0a0a0f]">Pago</option>
                  <option value="overdue" className="bg-[#0a0a0f]">Em Atraso</option>
                  <option value="cancelled" className="bg-[#0a0a0f]">Cancelado</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Link do Boleto</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type="url" name="boleto_url" defaultValue={invoice.boleto_url || ''} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#E5E87A] focus:ring-1 focus:ring-[#E5E87A] transition-all placeholder-gray-600" placeholder="https://..." />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-[#E5E87A] text-black font-black text-sm hover:brightness-110 shadow-[0_0_15px_rgba(229,232,122,0.4)] transition-all flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Salvar Alterações'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
}
