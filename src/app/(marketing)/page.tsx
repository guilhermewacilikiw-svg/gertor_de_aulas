import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, CheckCircle2, Shield, Zap, Globe, HeartHandshake, Music, BookOpen, Layers, Users, Play, Calendar, DollarSign, Video } from 'lucide-react';
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
    <div className="bg-[#0D0D15] min-h-screen selection:bg-[#A27AE8]/30 overflow-hidden relative font-sans">
      
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
        <div className="absolute top-0 w-full h-[5px] bg-[#A27AE8]/30 blur-sm animate-[scanline_8s_linear_infinite]"></div>
        <div className="absolute top-0 right-[15%] w-[1px] h-full bg-gradient-to-b from-transparent via-[#C0E87A]/40 to-transparent hidden sm:block"></div>
        <div className="absolute top-0 left-[20%] w-[1px] h-full bg-gradient-to-b from-transparent via-[#A27AE8]/40 to-transparent hidden sm:block"></div>
        {/* Mobile Ambient Glows (Brighter) */}
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[150vw] h-[150vw] bg-[#A27AE8]/40 rounded-full blur-[120px] sm:hidden"></div>
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[150vw] h-[150vw] bg-[#C0E87A]/20 rounded-full blur-[120px] sm:hidden"></div>
        <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[150vw] h-[150vw] bg-[#A27AE8]/35 rounded-full blur-[120px] sm:hidden"></div>
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-40 pb-20 px-4 min-h-[90vh] flex flex-col items-center justify-center text-center">
        
        {/* Floating Cyber Elements Behind Text */}
        <div className="absolute top-[20%] left-[10%] hidden lg:flex items-center gap-4 bg-black/80 backdrop-blur-md border-l-4 border-[#A27AE8] p-4 cyber-clip shadow-[0_0_20px_rgba(162,122,232,0.2)] animate-glitch transition-all">
           <div className="w-10 h-10 bg-[#A27AE8]/10 flex items-center justify-center rotate-45 border border-[#A27AE8]/50">
             <BookOpen className="w-5 h-5 text-[#A27AE8] -rotate-45" />
           </div>
           <div className="text-left">
             <p className="text-[10px] font-black uppercase tracking-widest text-[#A27AE8]">Metodologia</p>
             <p className="text-sm font-bold text-white">Nova Aula Liberada</p>
           </div>
        </div>

        <div className="absolute top-[40%] right-[10%] hidden lg:flex items-center gap-4 bg-black/80 backdrop-blur-md border-r-4 border-[#C0E87A] p-4 cyber-clip-reverse shadow-[0_0_20px_rgba(192,232,122,0.2)] animate-glitch transition-all z-20">
           <div className="w-10 h-10 bg-[#C0E87A]/10 flex items-center justify-center rotate-45 border border-[#C0E87A]/50">
             <Users className="w-5 h-5 text-[#C0E87A] -rotate-45" />
           </div>
           <div className="text-left text-right">
             <p className="text-[10px] font-black uppercase tracking-widest text-[#C0E87A]">Sincronia</p>
             <p className="text-sm font-bold text-white">Turma Lotada</p>
           </div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-black/60 border border-white/10 mx-auto hover:border-[#C0E87A]/50 transition-colors cursor-pointer group rounded-none skew-x-[-15deg]">
            <Sparkles className="w-4 h-4 text-[#C0E87A] skew-x-[15deg]" />
            <span className="text-xs font-black tracking-widest text-white/90 skew-x-[15deg]">A PLATAFORMA DEFINITIVA PARA ESCOLAS DE MÚSICA</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 tracking-tight leading-[1.1]">
            Gestão moderna na <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A27AE8] to-[#C0E87A] drop-shadow-[0_0_15px_rgba(162,122,232,0.5)]">
              frequência certa.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-100 sm:text-gray-300 max-w-2xl mx-auto leading-relaxed px-4 font-medium drop-shadow-lg">
            Elimine a bagunça de planilhas. Conecte as aulas presenciais da sua escola com um ambiente EAD imersivo onde o aluno continua praticando em casa.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-6 font-bold">
            <Link 
              href="/cadastro" 
              className="group relative w-full sm:w-auto px-10 py-4 bg-[#C0E87A] text-black font-black text-sm transition-all flex items-center justify-center gap-3 skew-x-[-10deg] shadow-[0_0_30px_rgba(192,232,122,0.4)] hover:shadow-[0_0_50px_rgba(192,232,122,0.8)] border border-[#C0E87A] hover:bg-black hover:text-[#C0E87A]"
            >
              <span className="skew-x-[10deg] flex items-center gap-2">
                Experimente Grátis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            
            <Link 
              href="/cadastro?type=solo" 
              className="w-full sm:w-auto px-10 py-4 bg-black text-white font-bold text-sm border border-white/20 hover:border-[#A27AE8] transition-all flex items-center justify-center skew-x-[-10deg] hover:bg-[#A27AE8]/10"
            >
              <span className="skew-x-[10deg]">Sou Professor Particular</span>
            </Link>
          </div>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="relative z-20 max-w-5xl mx-auto px-4 mt-12 mb-32">
        <div className="absolute inset-0 bg-[#A27AE8]/5 blur-[100px] pointer-events-none"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Alunos', value: formatNumber(totalStudents), color: '#A27AE8' },
            { label: 'Aulas', value: formatNumber(totalClasses), color: '#C0E87A' },
            { label: 'Escolas', value: formatNumber(totalSchools), color: '#A27AE8' },
            { label: 'Estabilidade', value: '99.9%', color: '#C0E87A' }
          ].map((stat, idx) => (
            <div key={idx} className="group bg-[#232336]/90 sm:bg-[#1A1A24]/90 backdrop-blur-md border border-white/20 sm:border-white/10 border-l-4 p-5 sm:p-6 text-center hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] cursor-default cyber-clip shadow-xl" style={{ borderLeftColor: stat.color }}>
              <h3 className="text-3xl sm:text-4xl font-black mb-1 font-mono tracking-tighter drop-shadow-lg" style={{ color: stat.color, textShadow: `0 0 10px ${stat.color}80` }}>{stat.value}</h3>
              <p className="text-[11px] sm:text-[10px] font-bold text-gray-200 sm:text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DETAILED FEATURES */}
      <section id="recursos" className="max-w-6xl mx-auto px-4 mb-32 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            Tudo o que sua escola precisa
          </h2>
          <p className="text-gray-200 sm:text-gray-300 max-w-2xl mx-auto text-lg px-4 font-medium">
            Substitua dezenas de ferramentas paralelas por um ecossistema único focado no ensino musical.
          </p>
        </div>

        <div className="space-y-6">
          {/* Feature 1: Financeiro */}
          <div className="flex flex-col md:flex-row bg-[#1A1A24]/70 border border-white/10 cyber-clip overflow-hidden group hover:border-[#A27AE8]/50 transition-colors">
            <div className="p-8 sm:p-10 md:w-1/2 flex flex-col justify-center">
              <DollarSign className="w-10 h-10 text-[#A27AE8] mb-6" />
              <h3 className="text-2xl font-black text-white mb-4">Gestão Financeira Descomplicada</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Tenha total controle sobre as mensalidades, reduza a inadimplência com cobranças automatizadas e entenda a saúde do seu caixa. Visualize matrículas ativas e pagamentos pendentes de forma clara e visual.
              </p>
            </div>
            <div className="md:w-1/2 bg-[#232336] relative border-t md:border-t-0 md:border-l border-white/10 min-h-[300px] flex items-center justify-center p-8">
               <div className="absolute inset-0 cyber-grid opacity-30"></div>
               <div className="relative bg-[#12121A] border border-[#A27AE8]/30 p-6 cyber-clip w-full shadow-[0_0_30px_rgba(162,122,232,0.1)]">
                 <div className="flex justify-between items-center mb-4">
                   <div className="text-white text-sm font-bold">Faturamento (Mês)</div>
                   <div className="text-[#A27AE8] font-mono font-black">+ R$ 12.450</div>
                 </div>
                 <div className="space-y-3">
                   <div className="h-2 bg-white/5 w-full"><div className="h-full bg-[#A27AE8] w-[80%] shadow-[0_0_10px_rgba(162,122,232,0.5)]"></div></div>
                   <div className="h-2 bg-white/5 w-full"><div className="h-full bg-white/20 w-[40%]"></div></div>
                   <div className="h-2 bg-white/5 w-full"><div className="h-full bg-white/20 w-[60%]"></div></div>
                 </div>
               </div>
            </div>
          </div>

          {/* Feature 2: Calendário */}
          <div className="flex flex-col md:flex-row-reverse bg-[#1A1A24]/70 border border-white/10 cyber-clip-reverse overflow-hidden group hover:border-[#C0E87A]/50 transition-colors">
            <div className="p-8 sm:p-10 md:w-1/2 flex flex-col justify-center">
              <Calendar className="w-10 h-10 text-[#C0E87A] mb-6" />
              <h3 className="text-2xl font-black text-white mb-4">Calendário Inteligente</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Organize as grades de professores, evite conflitos de sala e marque reposições facilmente. O aluno sempre sabe a hora e a sala da próxima aula presencial, evitando atrasos e faltas não justificadas.
              </p>
            </div>
            <div className="md:w-1/2 bg-[#232336] relative border-t md:border-t-0 md:border-r border-white/10 min-h-[300px] flex items-center justify-center p-8">
               <div className="absolute inset-0 cyber-grid opacity-30"></div>
               <div className="relative grid grid-cols-3 gap-2 w-full">
                 {[1,2,3,4,5,6].map(i => (
                   <div key={i} className={`h-16 border border-white/5 flex flex-col justify-end p-2 ${i === 3 ? 'bg-[#C0E87A]/10 border-[#C0E87A]/30 shadow-[0_0_15px_rgba(192,232,122,0.2)]' : 'bg-black/50'}`}>
                     {i === 3 && <div className="text-[10px] text-[#C0E87A] font-bold uppercase tracking-wider">Aula de Canto</div>}
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {/* Feature 3: EAD / Conteúdos */}
          <div className="flex flex-col md:flex-row bg-[#1A1A24]/70 border border-white/10 cyber-clip overflow-hidden group hover:border-[#A27AE8]/50 transition-colors">
            <div className="p-8 sm:p-10 md:w-1/2 flex flex-col justify-center">
              <Video className="w-10 h-10 text-[#A27AE8] mb-6" />
              <h3 className="text-2xl font-black text-white mb-4">Acervo e Aulas em Vídeo</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Forneça uma experiência premium de EAD. Suba vídeos privados, anexos, partituras e PDFs. Permita que seu aluno continue estudando durante a semana e dobre o engajamento dele com a música.
              </p>
            </div>
            <div className="md:w-1/2 bg-[#232336] relative border-t md:border-t-0 md:border-l border-white/10 min-h-[300px] flex items-center justify-center p-8">
               <div className="absolute inset-0 cyber-grid opacity-30"></div>
               <div className="relative bg-[#12121A] border border-[#A27AE8]/30 cyber-clip w-full h-40 flex items-center justify-center group-hover:shadow-[0_0_30px_rgba(162,122,232,0.2)] transition-shadow cursor-pointer">
                 <div className="w-14 h-14 bg-[#A27AE8] rounded-full flex items-center justify-center pl-1 shadow-[0_0_20px_rgba(162,122,232,0.6)]">
                   <Play className="w-6 h-6 text-black" />
                 </div>
               </div>
            </div>
          </div>

        </div>
      </section>

      {/* CORE VALUE CYCLE */}
      <section id="metodologia" className="max-w-6xl mx-auto px-4 mb-32 relative z-10">
        <div className="text-center mb-20 space-y-4">
          <div className="inline-block px-4 py-1 border border-[#A27AE8]/30 bg-[#A27AE8]/10 text-[#A27AE8] text-[10px] uppercase font-black tracking-widest mb-4">Metodologia</div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Jornada Didática <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A27AE8] to-[#C0E87A]">Contínua</span>
          </h2>
          <p className="text-gray-100 sm:text-gray-300 max-w-2xl mx-auto text-xs sm:text-sm uppercase tracking-wide font-bold px-4">
            Mantemos o foco e a motivação do aluno do momento em que ele entra na escola até a prática em casa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Users, step: '01', title: 'A Presença', desc: 'A escola registra o comparecimento e a aula presencial flui normalmente.', color: 'text-[#A27AE8]', border: 'border-[#A27AE8]' },
            { icon: Zap, step: '02', title: 'O Registro', desc: 'Em um clique, o professor envia uma anotação sobre o progresso do aluno no dia.', color: 'text-[#C0E87A]', border: 'border-[#C0E87A]' },
            { icon: Play, step: '03', title: 'A Prática', desc: 'O aluno entra no portal, visualiza o conteúdo rico em vídeo e treina.', color: 'text-[#A27AE8]', border: 'border-[#A27AE8]' },
            { icon: ArrowRight, step: '04', title: 'O Avanço', desc: 'A evolução fica evidente nos gráficos de acompanhamento de estudo mensal.', color: 'text-[#C0E87A]', border: 'border-[#C0E87A]' }
          ].map((item, idx) => (
            <div key={idx} className="relative group cursor-pointer">
              <div className={`bg-[#232336]/95 sm:bg-[#1A1A24]/90 p-8 border-t-2 border-white/20 sm:border-white/10 ${item.border} transition-all duration-300 h-full relative z-10 hover:-translate-y-2 hover:bg-[#2A2A40] sm:hover:bg-[#232336] shadow-2xl group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] rounded-2xl sm:rounded-none`}>
                
                {/* Tech Step Marker */}
                <div className="absolute top-0 right-0 p-2 border-b border-l border-white/30 sm:border-white/20 bg-white/20 sm:bg-white/10 text-[11px] font-black tracking-widest text-gray-100 sm:text-gray-300 rounded-tr-2xl sm:rounded-none">
                  PASSO {item.step}
                </div>

                <div className={`w-12 h-12 border ${item.border} bg-white/20 sm:bg-white/10 flex items-center justify-center mb-6 sm:mb-8 rotate-45 group-hover:rotate-90 transition-transform duration-500 shadow-[0_0_20px_rgba(255,255,255,0.1)]`}>
                  <item.icon className={`w-5 h-5 -rotate-45 group-hover:-rotate-90 transition-transform duration-500 ${item.color}`} />
                </div>
                
                <h3 className="text-xl font-black text-white mb-2 sm:mb-3 tracking-tight drop-shadow-md">{item.title}</h3>
                <p className="text-sm sm:text-xs text-gray-200 sm:text-gray-300 leading-relaxed font-medium">{item.desc}</p>
                
                {/* Decorative Bottom Bar */}
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/40 sm:via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
