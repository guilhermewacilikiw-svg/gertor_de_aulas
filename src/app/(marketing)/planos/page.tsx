import Link from 'next/link';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

export default function PlanosPage() {
  return (
    <div className="py-24 sm:py-32 relative z-10 min-h-[calc(100vh-200px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Transparência Total de Custos
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            Planos que acompanham o <span className="text-red-500">seu ritmo</span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg">
            Todos os planos contam com <strong>14 dias de teste grátis</strong>. Sem taxas ocultas, sem cartão de crédito antecipado e sem fidelidade.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          
          {/* Plano Solo */}
          <div className="bg-[#12121A]/90 border border-white/10 p-8 rounded-3xl flex flex-col justify-between hover:border-red-500/30 transition-all hover:-translate-y-1 shadow-xl relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white/10 border border-white/20 text-gray-300 text-[10px] font-black uppercase tracking-widest py-1 px-4 rounded-full shadow-lg">
              14 Dias Grátis
            </div>

            <div>
              <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">Professores Autônomos</span>
              <h3 className="text-2xl font-black text-white mt-1 mb-2">Solo (Garage)</h3>
              <p className="text-xs text-gray-400 mb-6">Perfeito para quem dá aulas particulares e estúdios individuais.</p>
              
              <div className="mb-6 pb-6 border-b border-white/10">
                <span className="text-4xl font-black text-white">R$ 59</span>
                <span className="text-gray-400 text-sm font-bold"> /mês</span>
                <p className="text-[11px] text-gray-500 mt-1">ou R$ 49/mês no plano anual</p>
              </div>

              <ul className="space-y-3.5 mb-8">
                <li className="flex items-center gap-2.5 text-xs text-gray-300"><CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" /> Até 30 alunos ativos</li>
                <li className="flex items-center gap-2.5 text-xs text-gray-300"><CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" /> 1 Professor / Administrador</li>
                <li className="flex items-center gap-2.5 text-xs text-gray-300"><CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" /> Agenda inteligente e grade</li>
                <li className="flex items-center gap-2.5 text-xs text-gray-300"><CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" /> Diário de classe e presenças</li>
                <li className="flex items-center gap-2.5 text-xs text-gray-300"><CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" /> Gestão financeira básica</li>
              </ul>
            </div>

            <Link href="/cadastro?plan=solo" className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-center bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-500/40 text-white transition-all">
              Começar 14 Dias Grátis
            </Link>
          </div>

          {/* Plano Stage (Destaque) */}
          <div className="bg-gradient-to-b from-red-600/30 via-[#12121A] to-[#12121A] border-2 border-red-500 p-8 rounded-3xl flex flex-col justify-between relative transform md:-translate-y-4 shadow-[0_0_40px_rgba(239,68,68,0.2)]">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-red-500 text-black text-[10px] font-black uppercase tracking-widest py-1 px-4 rounded-full shadow-lg">
              Mais Escolhido • 14 Dias Grátis
            </div>
            
            <div>
              <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest">Escolas em Crescimento</span>
              <h3 className="text-2xl font-black text-white mt-1 mb-2">Stage (Pro)</h3>
              <p className="text-xs text-gray-300 mb-6">Para escolas que possuem professores e precisam de controle total.</p>
              
              <div className="mb-6 pb-6 border-b border-white/10">
                <span className="text-4xl font-black text-white">R$ 169</span>
                <span className="text-red-400 text-sm font-bold"> /mês</span>
                <p className="text-[11px] text-gray-400 mt-1">ou R$ 139/mês no plano anual</p>
              </div>

              <ul className="space-y-3.5 mb-8">
                <li className="flex items-center gap-2.5 text-xs text-white"><CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" /> <strong>Até 150 alunos ativos</strong></li>
                <li className="flex items-center gap-2.5 text-xs text-white"><CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" /> <strong>Até 8 professores</strong></li>
                <li className="flex items-center gap-2.5 text-xs text-white"><CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" /> Múltiplos alunos por horário</li>
                <li className="flex items-center gap-2.5 text-xs text-white"><CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" /> Gamificação (Níveis e XP)</li>
                <li className="flex items-center gap-2.5 text-xs text-white"><CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" /> Gestão de faturas e mensalidades</li>
                <li className="flex items-center gap-2.5 text-xs text-white"><CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" /> Upload de partituras e vídeos</li>
              </ul>
            </div>

            <Link href="/cadastro?plan=stage" className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-center bg-red-600 hover:bg-red-500 text-white transition-all shadow-lg shadow-red-600/30">
              Começar 14 Dias Grátis
            </Link>
          </div>

          {/* Plano Festival */}
          <div className="bg-[#12121A]/90 border border-white/10 p-8 rounded-3xl flex flex-col justify-between hover:border-red-500/30 transition-all hover:-translate-y-1 shadow-xl relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white/10 border border-white/20 text-gray-300 text-[10px] font-black uppercase tracking-widest py-1 px-4 rounded-full shadow-lg">
              14 Dias Grátis
            </div>

            <div>
              <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">Grandes Conservatórios</span>
              <h3 className="text-2xl font-black text-white mt-1 mb-2">Festival (Arena)</h3>
              <p className="text-xs text-gray-400 mb-6">Para redes de ensino e conservatórios com múltiplas unidades.</p>
              
              <div className="mb-6 pb-6 border-b border-white/10">
                <span className="text-4xl font-black text-white">R$ 349</span>
                <span className="text-gray-400 text-sm font-bold"> /mês</span>
                <p className="text-[11px] text-gray-500 mt-1">ou R$ 289/mês no plano anual</p>
              </div>

              <ul className="space-y-3.5 mb-8">
                <li className="flex items-center gap-2.5 text-xs text-gray-300"><CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" /> <strong>Alunos ilimitados</strong></li>
                <li className="flex items-center gap-2.5 text-xs text-gray-300"><CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" /> <strong>Professores ilimitados</strong></li>
                <li className="flex items-center gap-2.5 text-xs text-gray-300"><CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" /> Múltiplas filiais e salas</li>
                <li className="flex items-center gap-2.5 text-xs text-gray-300"><CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" /> Branding customizado (sua marca)</li>
                <li className="flex items-center gap-2.5 text-xs text-gray-300"><CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" /> Suporte prioritário via WhatsApp</li>
              </ul>
            </div>

            <Link href="/cadastro?plan=festival" className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-center bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-500/40 text-white transition-all">
              Começar 14 Dias Grátis
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
