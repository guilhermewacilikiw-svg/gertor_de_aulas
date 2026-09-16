'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, User, Mail, Lock, Loader2, Phone, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { saasRegisterAction } from './actions';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function SaaSOnboardingForm() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationSentEmail, setConfirmationSentEmail] = useState<string | null>(null);
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
      value = value.substring(0, 14);
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
    
    formData.append('document', document.replace(/\D/g, ''));
    formData.append('phone', phone.replace(/\D/g, ''));
    formData.append('planCode', 'stage');
    
    const res = await saasRegisterAction(formData);
    
    if (res.success) {
      if ((res as any).needsConfirmation) {
        setConfirmationSentEmail((res as any).email || email);
        setLoading(false);
      } else if (res.redirect) {
        router.push(res.redirect);
      }
    } else {
      setError(res.error || 'Erro desconhecido');
      setLoading(false);
    }
  };

  if (confirmationSentEmail) {
    return (
      <div className="w-full max-w-xl mx-auto">
        <div className="glass-card rounded-none p-8 sm:p-10 shadow-2xl cyber-clip text-center border border-red-500/30">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-red-500 animate-pulse" />
          </div>

          <div className="inline-block px-4 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-[11px] font-bold uppercase tracking-widest mb-4">
            🎸 Quase lá! Backstage liberando...
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-4">
            Confirme seu E-mail
          </h2>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
            Enviamos um e-mail de confirmação com visual exclusivo para:
            <br />
            <strong className="text-white font-mono bg-white/5 px-2 py-1 rounded mt-2 inline-block border border-white/10">
              {confirmationSentEmail}
            </strong>
          </p>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-left mb-8 text-xs text-gray-400 space-y-2">
            <p className="flex items-center gap-2 text-white font-bold">
              <span className="w-2 h-2 rounded-full bg-red-500"></span> Próximos passos:
            </p>
            <p>1. Abra sua caixa de entrada (verifique também a pasta de <em>Spam</em> ou <em>Promoções</em>).</p>
            <p>2. Clique no botão vermelho <strong>Confirmar Meu Acesso</strong>.</p>
            <p>3. Seu painel será liberado automaticamente!</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-red-500 hover:bg-red-600 text-black font-black uppercase text-xs tracking-wider cyber-clip-btn transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)]"
            >
              Ir para o Login
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      
      {/* Account Type Selector */}
      <div className="flex bg-black/40 border border-white/10 p-1 mb-6 cyber-clip">
        <button
          type="button"
          onClick={() => setAccountType('school')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 px-3 text-xs font-black uppercase tracking-widest transition-all cyber-clip-btn",
            accountType === 'school' 
              ? "bg-red-500 text-black shadow-[0_0_15px_rgba(239,68,68,0.3)]" 
              : "text-white/50 hover:text-white hover:bg-white/5"
          )}
        >
          <Building2 className="w-4 h-4" /> Escola de Música
        </button>
        <button
          type="button"
          onClick={() => setAccountType('solo')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 px-3 text-xs font-black uppercase tracking-widest transition-all cyber-clip-btn",
            accountType === 'solo' 
              ? "bg-red-500 text-black shadow-[0_0_15px_rgba(239,68,68,0.3)]" 
              : "text-white/50 hover:text-white hover:bg-white/5"
          )}
        >
          <User className="w-4 h-4" /> Professor Autônomo
        </button>
      </div>

      <div className="glass-card rounded-none p-8 sm:p-10 shadow-2xl cyber-clip">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-white mb-2 tracking-tight uppercase">
            {accountType === 'school' ? 'Crie a conta da sua Escola' : 'Sua Conta de Professor'}
          </h2>
          <p className="text-red-500 text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> ACESSO TOTAL LIBERADO
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/40 border border-red-500/50 rounded-none cyber-clip-btn text-red-300 text-xs font-bold leading-relaxed animate-in fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-white/80 ml-1">
              {accountType === 'school' ? 'Nome da Escola / Instituição' : 'Nome do Estúdio / Aulas'}
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                name="schoolName"
                required
                className="w-full bg-black/40 border border-white/10 rounded-none py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-white/30"
                placeholder={accountType === 'school' ? 'Ex: Conservatório Mozart' : 'Ex: Aulas de Violão do João'}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-white/80 ml-1">
              {accountType === 'school' ? 'CNPJ (opcional)' : 'CPF ou CNPJ (opcional)'}
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={document}
                onChange={handleDocumentChange}
                className="w-full bg-black/40 border border-white/10 rounded-none py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-white/30"
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
                  className="w-full bg-black/40 border border-white/10 rounded-none py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-white/30"
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
                  className="w-full bg-black/40 border border-white/10 rounded-none py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-white/30"
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
                  className="w-full bg-black/40 border border-white/10 rounded-none py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-white/30"
                  placeholder="gestor@escola.com"
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
                  className="w-full bg-black/40 border border-white/10 rounded-none py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-white/30"
                  placeholder="gestor@escola.com"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-white/80 ml-1">Senha Segura</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="password"
                  name="adminPassword"
                  required
                  minLength={6}
                  className="w-full bg-black/40 border border-white/10 rounded-none py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-white/30"
                  placeholder="Ex: Senha@123 (maiúscula, número, símbolo)"
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
                  className="w-full bg-black/40 border border-white/10 rounded-none py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-white/30"
                  placeholder="Repita sua senha"
                />
              </div>
            </div>
          </div>

          {/* Termos de Uso */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 rounded bg-black/40 border-white/20 text-red-600 focus:ring-red-500"
              />
              <span className="text-xs text-gray-400 leading-relaxed">
                Li e concordo com os{' '}
                <Link href="/legal/termos" target="_blank" className="text-white hover:text-red-400 underline font-bold">
                  Termos de Uso
                </Link>{' '}
                e a{' '}
                <Link href="/legal/privacidade" target="_blank" className="text-white hover:text-red-400 underline font-bold">
                  Política de Privacidade
                </Link>.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-red-600 hover:bg-red-500 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-red-600/30 hover:shadow-red-600/50 transition-all flex items-center justify-center gap-2 cyber-clip-btn disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Criando Conta...</span>
              </>
            ) : (
              <>
                <span>CRIAR CONTA & ACESSAR</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-6">
          <p className="text-xs text-gray-400">
            Já possui uma conta ativa?{' '}
            <Link href="/login" className="text-white hover:text-red-400 font-bold ml-1 transition-colors">
              Fazer Login
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
