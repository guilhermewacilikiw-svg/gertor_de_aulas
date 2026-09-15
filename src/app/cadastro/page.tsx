import Link from 'next/link';
import { ArrowLeft, Sparkles, CheckCircle2, ShieldCheck, Zap, Users, BookOpen, Award } from 'lucide-react';
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
              <span className="block text-[10px] font-mono text-red-500 uppercase tracking-widest font-bold">Gestor de Aulas de Música</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-400 hover:text-white transition-colors cyber-clip-btn border border-red-500/20 bg-red-500/5 px-4 py-2">
              <ArrowLeft className="w-4 h-4" /> Voltar ao Início
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content: 2-Column Responsive Layout */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 relative z-10 flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          
          {/* LEFT COLUMN: Recursos & Apresentação */}
          <div className="lg:col-span-5 space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-widest rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                Acesso Imediato
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Modernize a gestão da sua escola de música.
              </h1>
              
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                Crie sua conta para gerenciar alunos, turmas, diários de classe e lançar avaliações pedagógicas completas.
              </p>
            </div>

            {/* Painel com Recursos Inclusos */}
            <div className="bg-[#12121A] border border-white/10 rounded-3xl p-6 space-y-4 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-[40px] pointer-events-none" />
              
              <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2 pb-2 border-b border-white/5">
                <Zap className="w-4 h-4 text-red-500" />
                Recursos Prontos para Uso
              </h3>

              <div className="space-y-3 pt-1">
                <div className="flex items-start gap-3 text-xs text-gray-300">
                  <Users className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Gestão de Alunos & Professores</strong>
                    <span className="text-gray-400">Cadastros organizados com identificação e histórico.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs text-gray-300">
                  <BookOpen className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Turmas & Diário de Aula</strong>
                    <span className="text-gray-400">Registro de presenças, resumos e materiais complementares.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs text-gray-300">
                  <Award className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Avaliações Didáticas (0 a 10)</strong>
                    <span className="text-gray-400">Critérios personalizados e destaque de atividades principais.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Checklist de Segurança */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Acesso Completo:</strong> Todos os módulos liberados para teste.</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Segurança & Privacidade:</strong> Dados protegidos com isolamento multi-tenant.</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Formulário de Cadastro */}
          <div className="lg:col-span-7 animate-in fade-in slide-in-from-right-4 duration-700">
            <Suspense fallback={<div className="animate-pulse w-full h-[500px] bg-[#12121A] rounded-3xl border border-white/10" />}>
              <SaaSOnboardingForm />
            </Suspense>
          </div>

        </div>
      </main>

    </div>
  );
}
