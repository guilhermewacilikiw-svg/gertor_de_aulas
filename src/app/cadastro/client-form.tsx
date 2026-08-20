'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Building2, User, Mail, Lock, Loader2, CreditCard, Phone, ArrowRight } from 'lucide-react';
import { saasRegisterAction } from './actions';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function SaaSOnboardingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accountType, setAccountType] = useState<'school' | 'solo'>('school');
  
  const [document, setDocument] = useState('');
  const [phone, setPhone] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Mascara CNPJ ou CPF dinamicamente
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
      // CPF Mask
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      // CNPJ Mask
      value = value.substring(0, 14); // Limit 14 numbers
      value = value.replace(/^(\d{2})(\d)/, '$1.$2');
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
      value = value.replace(/(\d{4})(\d)/, '$1-$2');
    }
    setDocument(value);
  };

  // Mascara Telefone (WhatsApp)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.substring(0, 11);
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    value = value.replace(/(\d)(\d{4})$/, '$1-$2');
    setPhone(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('adminEmail') as string;
    const confirmEmail = formData.get('confirmAdminEmail') as string;
    const password = formData.get('adminPassword') as string;
    const confirmPassword = formData.get('confirmAdminPassword') as string;

    if (email !== confirmEmail) {
      setError('Os endereços de e-mail não coincidem.');
      return;
    }

    if (!acceptedTerms) {
      setError('Você precisa aceitar os Termos de Uso e Política de Privacidade para continuar.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas digitadas não coincidem.');
      return;
    }

    setLoading(true);
    setError(null);
    
    formData.append('document', document.replace(/\D/g, '')); // Send numbers only
    formData.append('phone', phone.replace(/\D/g, ''));
    
    const res = await saasRegisterAction(formData);
    
    if (res.success && res.redirect) {
      router.push(res.redirect);
    } else {
      setError(res.error || 'Erro desconhecido');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      
      {/* Account Type Selector */}
      <div className="flex bg-black/40 border border-white/10 p-1 mb-8 cyber-clip">
        <button
          type="button"
          onClick={() => setAccountType('school')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 px-3 text-xs font-black uppercase tracking-widest transition-all cyber-clip-btn",
            accountType === 'school' 
              ? "bg-[#C0E87A] text-black shadow-[0_0_15px_rgba(192,232,122,0.3)]" 
              : "text-white/50 hover:text-white hover:bg-white/5"
          )}
        >
          <Building2 className="w-4 h-4" /> Escola
        </button>
        <button
          type="button"
          onClick={() => setAccountType('solo')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 px-3 text-xs font-black uppercase tracking-widest transition-all cyber-clip-btn",
            accountType === 'solo' 
              ? "bg-[#C0E87A] text-black shadow-[0_0_15px_rgba(192,232,122,0.3)]" 
              : "text-white/50 hover:text-white hover:bg-white/5"
          )}
        >
          <User className="w-4 h-4" /> Professor
        </button>
      </div>

      <div className="glass-card rounded-none p-8 sm:p-10 shadow-2xl cyber-clip">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-white mb-2 tracking-tight uppercase">
            {accountType === 'school' ? 'Crie a conta da sua Escola' : 'Sua Conta de Professor'}
          </h2>
          <p className="text-[#C0E87A] text-xs font-mono uppercase tracking-widest">
            INICIALIZAR SISTEMA DE GESTÃO
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-sm font-bold shadow-md">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-white/80 ml-1">
              {accountType === 'school' ? 'Nome da Escola (Ou Razão Social)' : 'Como você chama suas aulas? (Ex: Aulas do João)'}
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                name="schoolName"
                required
                className="w-full bg-black/40 border border-white/10 rounded-none py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#C0E87A] focus:ring-1 focus:ring-[#C0E87A] transition-all placeholder:text-white/30"
                placeholder={accountType === 'school' ? 'Ex: Conservatório Mozart' : 'Ex: Aulas de Violão do João'}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-white/80 ml-1">
              {accountType === 'school' ? 'CNPJ' : 'CPF ou CNPJ'}
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={document}
                onChange={handleDocumentChange}
                required
                className="w-full bg-black/40 border border-white/10 rounded-none py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#C0E87A] focus:ring-1 focus:ring-[#C0E87A] transition-all placeholder:text-white/30"
                placeholder="00.000.000/0001-00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-white/80 ml-1">
                {accountType === 'school' ? 'Seu Nome (Gestor)' : 'Seu Nome'}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  name="adminName"
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-none py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#C0E87A] focus:ring-1 focus:ring-[#C0E87A] transition-all placeholder:text-white/30"
                  placeholder="Carlos Silva"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-white/80 ml-1">Telefone / WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={phone}
                  onChange={handlePhoneChange}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-none py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#C0E87A] focus:ring-1 focus:ring-[#C0E87A] transition-all placeholder:text-white/30"
                  placeholder="(11) 90000-0000"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-white/80 ml-1">E-mail para Acesso</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  name="adminEmail"
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-none py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#C0E87A] focus:ring-1 focus:ring-[#C0E87A] transition-all placeholder:text-white/30"
                  placeholder="contato@empresa.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-white/80 ml-1">Confirme seu E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  name="confirmAdminEmail"
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-none py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#C0E87A] focus:ring-1 focus:ring-[#C0E87A] transition-all placeholder:text-white/30"
                  placeholder="contato@empresa.com"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-white/80 ml-1">Crie uma Senha Forte</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="password"
                  name="adminPassword"
                  required
                  minLength={6}
                  className="w-full bg-black/40 border border-white/10 rounded-none py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#C0E87A] focus:ring-1 focus:ring-[#C0E87A] transition-all placeholder:text-white/30"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-white/80 ml-1">Confirme sua Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="password"
                  name="confirmAdminPassword"
                  required
                  minLength={6}
                  className="w-full bg-black/40 border border-white/10 rounded-none py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#C0E87A] focus:ring-1 focus:ring-[#C0E87A] transition-all placeholder:text-white/30"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 mt-6">
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 w-4 h-4 rounded-none border-white/20 bg-black/50 text-[#C0E87A] focus:ring-[#C0E87A]/50 accent-[#C0E87A]"
            />
            <label htmlFor="terms" className="text-xs font-mono text-white/60 leading-relaxed uppercase tracking-widest mt-1">
              ACEITO OS <Link href="/legal/termos" target="_blank" className="text-[#A27AE8] hover:underline font-bold">TERMOS DE USO</Link> E <Link href="/legal/privacidade" target="_blank" className="text-[#A27AE8] hover:underline font-bold">PRIVACIDADE</Link>.
            </label>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-4 bg-[#C0E87A] text-black font-black text-sm uppercase tracking-widest hover:brightness-110 shadow-[0_0_20px_rgba(192,232,122,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cyber-clip-btn"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                Criar Conta <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs font-mono uppercase tracking-widest text-white/50 mt-8">
          JÁ POSSUI CADASTRO? <Link href="/login" className="text-[#C0E87A] font-bold hover:text-white transition-colors">ACESSAR SISTEMA</Link>
        </p>
      </div>
    </div>
  );
}
