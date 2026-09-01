import Link from 'next/link';
import { ArrowLeft, Sparkles, CheckCircle2, ShieldCheck, Zap, CreditCard, Clock } from 'lucide-react';
import Image from 'next/image';
import { SaaSOnboardingForm } from './client-form';
import { Suspense } from 'react';

export default function CadastroPage() {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col bg-[#0a0a0f] text-gray-200">
      
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-40 pointer-events-none" />
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-600/10 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Top Bar for Navigation */}
      <header className="w-full border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto p-4 px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-4 group hover:opacity-80 transition-opacity">
            <div className="w-[60px] h-[60px] overflow-hidden p-[1px] border border-white/10 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all cyber-clip">
              <Image src="/logo-rock.jpg" alt="Wakoda Logo" width={60} height={60} priority className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-bebas text-2xl text-white tracking-tight drop-shadow-md uppercase">Wakoda</span>
              <span className="block text-[10px] font-mono text-red-500 uppercase tracking-widest font-bold">SaaS Gestor de Aulas</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/planos" className="hidden sm:inline-flex text-xs font-bold text-gray-400 hover:text-white transition-colors">
              Ver Todos os Planos
            </Link>
            <Link href="/" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-400 hover:text-white transition-colors cyber-clip-btn border border-red-500/20 bg-red-500/5 px-4 py-2">
              <ArrowLeft className="w-4 h-4" /> Voltar
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content: 2-Column Responsive Layout */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 relative z-10 flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          
          {/* LEFT COLUMN: Custos, Transparência & Benefícios */}
          <div className="lg:col-span-5 space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-widest rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                14 Dias de Teste Grátis
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Comece agora sem custos e sem cartão de crédito.
              </h1>
              
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                Você terá acesso imediato e irrestrito ao <strong className="text-white">Plano Stage (Pro)</strong> durante 14 dias para cadastrar seus alunos, organizar horários e testar a plataforma.
              </p>
            </div>

            {/* Painel com Informações Claras de Custos */}
            <div className="bg-[#12121A] border border-white/10 rounded-3xl p-6 space-y-4 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-[40px] pointer-events-none" />
              
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span className="text-xs font-black uppercase tracking-wider text-gray-300 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-red-400" />
                  Transparência de Custos
                </span>
                <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Hoje: R$ 0,00
                </span>
              </div>

              {/* Tabela Resumo dos Planos */}
              <div className="space-y-3 pt-1">
                {/* Solo */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">Plano Solo (Garage)</span>
                    <span className="text-gray-400 text-[11px]">Até 30 alunos • 1 Professor</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-white text-sm">R$ 59</span>
                    <span className="text-gray-500 text-[10px]">/mês</span>
                  </div>
                </div>

                {/* Stage (Destacado) */}
                <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center justify-between text-xs shadow-md">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-white block">Plano Stage (Pro)</span>
                      <span className="text-[9px] font-black uppercase tracking-widest bg-red-600 text-white px-1.5 py-0.2 rounded">Incluso no Teste</span>
                    </div>
                    <span className="text-red-200 text-[11px]">Até 150 alunos • 8 Professores • Gamificação</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-red-400 text-sm">R$ 169</span>
                    <span className="text-red-300/70 text-[10px]">/mês</span>
                  </div>
                </div>

                {/* Festival */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">Plano Festival (Arena)</span>
                    <span className="text-gray-400 text-[11px]">Alunos e Professores Ilimitados</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-white text-sm">R$ 349</span>
                    <span className="text-gray-500 text-[10px]">/mês</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2 text-[11px] text-gray-400">
                <Clock className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                <span>Após os 14 dias, você escolhe se deseja continuar no plano que melhor se adapta à sua escola.</span>
              </div>
            </div>

            {/* Checklist de Garantias */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
                <span><strong>Sem fidelidade:</strong> Cancele ou altere de plano a qualquer momento.</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
                <span><strong>Sem surpresas:</strong> Notificação clara antes do encerramento do trial.</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Segurança de Dados:</strong> Backups diários e isolamento completo no banco.</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Formulário de Cadastro Onboarding */}
          <div className="lg:col-span-7 animate-in fade-in slide-in-from-right-4 duration-700">
            <Suspense fallback={<div className="animate-pulse w-full h-[600px] bg-[#12121A] rounded-3xl border border-white/10" />}>
              <SaaSOnboardingForm />
            </Suspense>
          </div>

        </div>
      </main>

    </div>
  );
}
