import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, CheckCircle2, Shield, Zap, Globe, HeartHandshake, Music, BookOpen, Layers, Users, Play, Calendar, DollarSign, Video, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 60; // Revalidate every 60 seconds (ISR)

export default async function LandingPage() {
  const supabase = await createClient();
  
  // Fetch real-time counts
  const [{ count: studentsCount }, { count: classesCount }, { count: schoolsCount }] = await Promise.all([
    supabase.from('students').select('*', { count: 'exact', head: true }),
    supabase.from('classes').select('*', { count: 'exact', head: true }),
    supabase.from('organizations').select('*', { count: 'exact', head: true })
  ]);

  // Use exact real-time counts from the database
  const totalStudents = studentsCount || 0;
  const totalClasses = classesCount || 0;
  const totalSchools = schoolsCount || 0;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('pt-BR').format(num);
  };

  return (
    <div className="bg-[#0D0D15] min-h-screen selection:bg-red-500/30 overflow-hidden relative font-sans">
      
      {/* Global CSS for custom animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes cyber-glitch {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .animate-glitch:hover { animation: cyber-glitch 0.2s cubic-bezier(.25, .46, .45, .94) both infinite; }
        .cyber-grid {
          background-size: 50px 50px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
        }
        .cyber-clip { clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%); }
        .cyber-clip-reverse { clip-path: polygon(0 0, 90% 0, 100% 30%, 100% 100%, 10% 100%, 0 70%); }
      `}} />

      {/* Background Cyber Grid & Scanline */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 cyber-grid opacity-50 sm:opacity-100"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D15] via-transparent to-[#0D0D15]"></div>
        <div className="absolute top-0 w-full h-[5px] bg-red-500/30 blur-sm animate-[scanline_8s_linear_infinite]"></div>
        <div className="absolute top-0 right-[15%] w-[1px] h-full bg-gradient-to-b from-transparent via-red-500/40 to-transparent hidden sm:block"></div>
        <div className="absolute top-0 left-[20%] w-[1px] h-full bg-gradient-to-b from-transparent via-red-500/40 to-transparent hidden sm:block"></div>
        {/* Mobile Ambient Glows (Brighter) */}
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[150vw] h-[150vw] bg-red-500/40 rounded-full blur-[120px] sm:hidden"></div>
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[150vw] h-[150vw] bg-red-500/20 rounded-full blur-[120px] sm:hidden"></div>
        <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[150vw] h-[150vw] bg-red-500/35 rounded-full blur-[120px] sm:hidden"></div>
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-40 pb-20 px-4 min-h-[90vh] flex flex-col items-center justify-center text-center">
        
        {/* Floating Cyber Elements Behind Text */}


        <div className="relative z-10 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-black/60 border border-white/10 mx-auto hover:border-red-500/50 transition-colors cursor-pointer group rounded-none skew-x-[-15deg]">
            <Sparkles className="w-4 h-4 text-red-500 skew-x-[15deg]" />
            <span className="text-xs font-black tracking-widest text-white/90 skew-x-[15deg]">A PLATAFORMA DEFINITIVA PARA ESCOLAS DE MÚSICA</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 tracking-tight leading-[1.1]">
            O Sistema Completo para <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-500 drop-shadow-[0_0_15px_rgba(162,122,232,0.5)]">
              Professores e Escolas.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-100 sm:text-gray-300 max-w-3xl mx-auto leading-relaxed px-4 font-medium drop-shadow-lg">
            Centralize suas mensalidades, organize a agenda dos professores e ofereça um portal EAD premium para os seus alunos estudarem em casa. Esqueça as planilhas.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-6 font-bold">
            <Link 
              href="/cadastro" 
              className="group relative w-full sm:w-auto px-10 py-4 bg-red-500 text-black font-black text-sm transition-all flex items-center justify-center gap-3 skew-x-[-10deg] shadow-[0_0_30px_rgba(192,232,122,0.4)] hover:shadow-[0_0_50px_rgba(192,232,122,0.8)] border border-red-500 hover:bg-black hover:text-red-500"
            >
              <span className="skew-x-[10deg] flex items-center gap-2">
                Comece Grátis Agora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            
            <Link 
              href="/cadastro?type=solo" 
              className="w-full sm:w-auto px-10 py-4 bg-black text-white font-bold text-sm border border-white/20 hover:border-red-500 transition-all flex items-center justify-center skew-x-[-10deg] hover:bg-red-500/10"
            >
              <span className="skew-x-[10deg]">Sou Professor Particular</span>
            </Link>
          </div>
        </div>
      </section>

      {/* DORES QUE RESOLVEMOS / BENEFÍCIOS */}
      <section id="beneficios" className="relative z-20 max-w-6xl mx-auto px-4 mt-12 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#1A1A24]/70 border border-white/10 p-8 cyber-clip hover:border-red-500/50 transition-colors">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
              <DollarSign className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-black text-white mb-3">Fim da Inadimplência</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Chega de cobrar alunos pelo WhatsApp. Nosso sistema organiza os vencimentos e te dá previsibilidade financeira real da sua escola.</p>
          </div>
          <div className="bg-[#1A1A24]/70 border border-white/10 p-8 cyber-clip hover:border-red-500/50 transition-colors">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
              <Calendar className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-black text-white mb-3">Adeus aos Conflitos</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Elimine o choque de horários e salas. O calendário centraliza as grades dos professores e notifica os alunos sobre reposições.</p>
          </div>
          <div className="bg-[#1A1A24]/70 border border-white/10 p-8 cyber-clip hover:border-red-500/50 transition-colors">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-black text-white mb-3">Agregue Valor</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Diferencie sua escola da concorrência oferecendo um portal online onde o aluno acessa vídeos, partituras e o próprio diário de classe.</p>
          </div>
        </div>
      </section>

      {/* DETAILED FEATURES */}
      <section id="recursos" className="max-w-6xl mx-auto px-4 mb-32 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            Tudo o que sua escola precisa
          </h2>
          <p className="text-gray-200 sm:text-gray-300 max-w-2xl mx-auto text-lg px-4 font-medium">
            Substitua dezenas de ferramentas paralelas por um ecossistema único e focado no ensino musical.
          </p>
        </div>

        <div className="space-y-6">
          {/* Feature 1: Financeiro */}
          <div className="flex flex-col md:flex-row bg-[#1A1A24]/70 border border-white/10 cyber-clip overflow-hidden group hover:border-red-500/50 transition-colors">
            <div className="p-8 sm:p-10 md:w-1/2 flex flex-col justify-center">
              <DollarSign className="w-10 h-10 text-red-500 mb-6" />
              <h3 className="text-2xl font-black text-white mb-4">Gestão Financeira Descomplicada</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Tenha total controle sobre as mensalidades, reduza a inadimplência com cobranças organizadas e entenda a saúde do seu caixa de forma visual.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-red-500" /> Dashboard de faturamento mensal</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-red-500" /> Histórico de mensalidades por aluno</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-red-500" /> Filtro rápido de pagamentos pendentes</li>
              </ul>
            </div>
            <div className="md:w-1/2 bg-[#232336] relative border-t md:border-t-0 md:border-l border-white/10 min-h-[300px] flex items-center justify-center p-8">
               <div className="absolute inset-0 cyber-grid opacity-30"></div>
               <div className="relative bg-[#12121A] border border-red-500/30 p-6 cyber-clip w-full shadow-[0_0_30px_rgba(162,122,232,0.1)]">
                 <div className="flex justify-between items-center mb-4">
                   <div className="text-white text-sm font-bold">Faturamento (Mês)</div>
                   <div className="text-red-500 font-mono font-black">+ R$ 12.450</div>
                 </div>
                 <div className="space-y-3">
                   <div className="h-2 bg-white/5 w-full"><div className="h-full bg-red-500 w-[80%] shadow-[0_0_10px_rgba(162,122,232,0.5)]"></div></div>
                   <div className="h-2 bg-white/5 w-full"><div className="h-full bg-white/20 w-[40%]"></div></div>
                   <div className="h-2 bg-white/5 w-full"><div className="h-full bg-white/20 w-[60%]"></div></div>
                 </div>
               </div>
            </div>
          </div>

          {/* Feature 2: Calendário */}
          <div className="flex flex-col md:flex-row-reverse bg-[#1A1A24]/70 border border-white/10 cyber-clip-reverse overflow-hidden group hover:border-red-500/50 transition-colors">
            <div className="p-8 sm:p-10 md:w-1/2 flex flex-col justify-center">
              <Calendar className="w-10 h-10 text-red-500 mb-6" />
              <h3 className="text-2xl font-black text-white mb-4">Calendário Inteligente</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Organize as grades de professores e evite conflitos. O aluno acessa a plataforma e sabe exatamente a hora e sala da próxima aula presencial.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-red-500" /> Alocação de salas e professores</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-red-500" /> Agenda individual do aluno e do instrutor</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-red-500" /> Visualização unificada da semana</li>
              </ul>
            </div>
            <div className="md:w-1/2 bg-[#232336] relative border-t md:border-t-0 md:border-r border-white/10 min-h-[300px] flex items-center justify-center p-8">
               <div className="absolute inset-0 cyber-grid opacity-30"></div>
               <div className="relative grid grid-cols-3 gap-2 w-full">
                 {[1,2,3,4,5,6].map(i => (
                   <div key={i} className={`h-16 border border-white/5 flex flex-col justify-end p-2 ${i === 3 ? 'bg-red-500/10 border-red-500/30 shadow-[0_0_15px_rgba(192,232,122,0.2)]' : 'bg-black/50'}`}>
                     {i === 3 && <div className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Aula de Canto</div>}
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {/* Feature 3: EAD / Conteúdos */}
          <div className="flex flex-col md:flex-row bg-[#1A1A24]/70 border border-white/10 cyber-clip overflow-hidden group hover:border-red-500/50 transition-colors">
            <div className="p-8 sm:p-10 md:w-1/2 flex flex-col justify-center">
              <Video className="w-10 h-10 text-red-500 mb-6" />
              <h3 className="text-2xl font-black text-white mb-4">Portal do Aluno EAD</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Forneça uma experiência de estudo em casa. Suba vídeos, partituras e crie uma "Netflix" particular da sua escola de música.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-red-500" /> Hospedagem de vídeos privados</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-red-500" /> Diário de bordo após cada aula</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check className="w-4 h-4 text-red-500" /> Anexos e arquivos em PDF / Áudio</li>
              </ul>
            </div>
            <div className="md:w-1/2 bg-[#232336] relative border-t md:border-t-0 md:border-l border-white/10 min-h-[300px] flex items-center justify-center p-8">
               <div className="absolute inset-0 cyber-grid opacity-30"></div>
               <div className="relative bg-[#12121A] border border-red-500/30 cyber-clip w-full h-40 flex items-center justify-center group-hover:shadow-[0_0_30px_rgba(162,122,232,0.2)] transition-shadow cursor-pointer">
                 <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center pl-1 shadow-[0_0_20px_rgba(162,122,232,0.6)]">
                   <Play className="w-6 h-6 text-black" />
                 </div>
               </div>
            </div>
          </div>

        </div>
      </section>

      {/* CALL TO ACTION FINAL */}
      <section className="max-w-4xl mx-auto px-4 mb-32 relative z-10 text-center">
        <div className="bg-gradient-to-b from-[#1A1A24] to-[#0D0D15] border border-red-500/30 p-12 cyber-clip shadow-[0_0_50px_rgba(229,9,20,0.1)]">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">
            Eleve o nível da sua escola de música hoje.
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Junte-se a dezenas de escolas e professores particulares que estão digitalizando suas metodologias e aumentando suas receitas.
          </p>
          <Link 
            href="/cadastro" 
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-red-500 text-black font-black text-lg transition-all skew-x-[-10deg] shadow-[0_0_30px_rgba(229,9,20,0.4)] hover:shadow-[0_0_50px_rgba(229,9,20,0.8)] border border-red-500 hover:bg-black hover:text-red-500"
          >
            <span className="skew-x-[10deg] flex items-center gap-2">
              Começar Teste Gratuito
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </section>

    </div>
  );
}
