'use client';

import { useState, ChangeEvent } from 'react';
import { Loader2, Mail, Lock, User, Phone, Calendar, FileText, ArrowLeft } from 'lucide-react';
import { createStudentAction } from '../actions';
import confetti from 'canvas-confetti';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NovoAlunoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');

  const handleCpfChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setCpf(value);
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    value = value.replace(/(\d)(\d{4})$/, '$1-$2');
    setPhone(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const res = await createStudentAction(formData);
    
    if (res.success) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        router.push('/escola/alunos');
      }, 1500);
    } else {
      setError(res.error || 'Erro desconhecido');
    }
    
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-center gap-4">
        <Link href="/escola/alunos" className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Novo Aluno</h1>
          <p className="text-sm text-red-500 font-mono uppercase tracking-widest mt-1">INICIALIZAR ACESSO DISCENTE</p>
        </div>
      </div>

      <div className="bg-[#12121A] border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] pointer-events-none"></div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {error && (
            <div className="p-4 bg-red-500/20 text-red-300 border border-red-500/30 rounded-2xl text-sm font-bold">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-white/80 ml-1 uppercase tracking-wider">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-white/30"
                  placeholder="Ex: João Silva"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/80 ml-1 uppercase tracking-wider">CPF</label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  name="cpf"
                  value={cpf}
                  onChange={handleCpfChange}
                  className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-white/30"
                  placeholder="000.000.000-00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/80 ml-1 uppercase tracking-wider">Data de Nasc.</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="date"
                  name="birth_date"
                  className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-white/30 [color-scheme:dark]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/80 ml-1 uppercase tracking-wider">Telefone (WhatsApp)</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  name="phone"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-white/30"
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/80 ml-1 uppercase tracking-wider">E-mail de Acesso</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-white/30"
                  placeholder="joao@email.com"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-sm font-bold text-white mb-1">Senha de Acesso</p>
                <p className="text-xs text-gray-400">
                  O aluno receberá a senha temporária <span className="text-red-400 font-mono font-black">senha123</span> e será obrigado a trocá-la no primeiro acesso.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-red-500 text-white font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_20px_rgba(192,232,122,0.3)] flex items-center justify-center gap-2 rounded-2xl disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Cadastrar Aluno'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
