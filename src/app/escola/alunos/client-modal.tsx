'use client';

import { useState } from 'react';
import { Plus, X, Loader2, Mail, Lock, User, Sparkles, Upload } from 'lucide-react';
import { createStudentAction, importStudentsAction } from './actions';
import confetti from 'canvas-confetti';

export function InviteStudentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const res = await createStudentAction(formData);
    
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
        Novo Aluno
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#0a0a0f] border border-white/10 rounded-3xl p-6 shadow-2xl text-white">
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C0E87A]/10 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
              <div>
                <span className="text-xs font-bold text-[#C0E87A] uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Cadastro
                </span>
                <h2 className="text-xl font-black text-white">Novo Aluno</h2>
                <p className="text-xs text-gray-400 mt-0.5">Crie o acesso para o Portal do Aluno.</p>
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
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#C0E87A] focus:ring-1 focus:ring-[#C0E87A] transition-all placeholder-gray-600"
                    placeholder="Ex: Maria Clara"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">E-mail de Acesso</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#C0E87A] focus:ring-1 focus:ring-[#C0E87A] transition-all placeholder-gray-600"
                    placeholder="maria@gmail.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Senha Inicial</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    name="password"
                    required
                    defaultValue="123456"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#C0E87A] focus:ring-1 focus:ring-[#C0E87A] transition-all placeholder-gray-600"
                  />
                </div>
                <p className="text-[10px] text-gray-500 ml-1">O aluno poderá alterar a senha depois.</p>
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
                  className="flex-1 py-3.5 rounded-xl bg-[#C0E87A] text-black font-black text-sm hover:brightness-110 shadow-[0_0_15px_rgba(192,232,122,0.4)] transition-all flex items-center justify-center gap-2"
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

export function ImportStudentsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{ successCount: number, errors: string[] } | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setResults(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim() !== '');
        
        // Assume first line is header: nome, email, senha (optional)
        const students = lines.slice(1).map(line => {
          const [name, email, password] = line.split(',').map(s => s.trim());
          return { name, email, password };
        }).filter(s => s.name && s.email);

        if (students.length === 0) {
          setError('Nenhum aluno válido encontrado no arquivo.');
          setLoading(false);
          return;
        }

        const res = await importStudentsAction(students);
        
        if (res.success) {
          setResults({ successCount: res.successCount || 0, errors: res.errors || [] });
          if (res.successCount && res.successCount > 0) {
             confetti({ particleCount: 150, spread: 80 });
          }
        } else {
          setError(res.error || 'Erro ao importar alunos');
        }
      } catch (err: any) {
        setError('Erro ao processar arquivo CSV.');
      }
      setLoading(false);
    };
    reader.onerror = () => {
      setError('Falha ao ler o arquivo.');
      setLoading(false);
    };
    reader.readAsText(file);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/10 transition-all flex items-center gap-2"
      >
        <Upload className="w-4 h-4" />
        Importar CSV
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#0a0a0f] border border-white/10 rounded-3xl p-6 shadow-2xl text-white">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div>
                <h2 className="text-xl font-black text-white">Importar Alunos</h2>
                <p className="text-xs text-gray-400 mt-0.5">Faça upload de um arquivo CSV (Nome, Email, Senha Opcional).</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl text-xs font-bold mb-4">
                {error}
              </div>
            )}

            {results ? (
              <div className="space-y-4">
                <div className="p-4 bg-[#C0E87A]/20 border border-[#C0E87A]/30 rounded-xl text-center">
                   <h3 className="text-[#C0E87A] font-black text-lg">{results.successCount} Alunos Importados!</h3>
                </div>
                {results.errors.length > 0 && (
                   <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                      <p className="text-yellow-500 text-xs font-bold mb-2">Avisos / Erros ({results.errors.length}):</p>
                      <ul className="text-xs text-gray-400 space-y-1 max-h-32 overflow-y-auto">
                        {results.errors.map((e, i) => <li key={i}>- {e}</li>)}
                      </ul>
                   </div>
                )}
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-colors"
                >
                  Fechar
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:bg-white/5 transition-colors relative">
                  <input 
                    type="file" 
                    accept=".csv" 
                    onChange={handleFileUpload} 
                    disabled={loading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  {loading ? (
                     <div className="flex flex-col items-center justify-center">
                        <Loader2 className="w-8 h-8 text-[#C0E87A] animate-spin mb-2" />
                        <span className="text-sm font-bold text-gray-300">Processando arquivo...</span>
                     </div>
                  ) : (
                     <div className="flex flex-col items-center justify-center">
                        <Upload className="w-8 h-8 text-gray-500 mb-2" />
                        <span className="text-sm font-bold text-gray-300">Clique ou arraste o CSV aqui</span>
                        <span className="text-xs text-gray-500 mt-1">Primeira linha deve ser o cabeçalho</span>
                     </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}
