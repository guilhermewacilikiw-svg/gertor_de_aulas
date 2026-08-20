import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default function PlanosPage() {
  return (
    <div className="py-24 sm:py-32 relative z-10 min-h-[calc(100vh-200px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">Planos que acompanham o <span className="text-purple-400">seu ritmo</span></h1>
          <p className="text-gray-400 text-lg">Sem surpresas e sem taxas ocultas. Escolha o plano ideal para o tamanho da sua escola de música.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Starter Plan */}
          <div className="bg-neutral-900/30 border border-neutral-800 p-8 rounded-3xl border border-white/10 hover:border-purple-500/30 transition-colors flex flex-col">
            <h3 className="text-xl font-semibold text-white mb-2">Professor Autônomo</h3>
            <p className="text-gray-400 text-sm mb-6">Perfeito para quem dá aulas particulares e quer se organizar.</p>
            <div className="mb-8">
              <span className="text-4xl font-black text-white">R$ 49</span>
              <span className="text-gray-500">/mês</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-sm text-gray-300"><CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" /> Até 30 alunos</li>
              <li className="flex items-center gap-3 text-sm text-gray-300"><CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" /> Agenda inteligente</li>
              <li className="flex items-center gap-3 text-sm text-gray-300"><CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" /> Gestão financeira básica</li>
            </ul>
            <Link href="/login" className="w-full py-3 rounded-xl font-semibold text-center border border-white/10 hover:bg-white/5 transition-colors">
              Começar Grátis
            </Link>
          </div>

          {/* Pro Plan (Highlighted) */}
          <div className="bg-gradient-to-b from-purple-600/20 to-indigo-600/10 p-8 rounded-3xl border border-purple-500/30 relative flex flex-col transform md:-translate-y-4 shadow-2xl shadow-purple-500/10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-bold uppercase tracking-widest py-1 px-4 rounded-full">
              Mais Escolhido
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Escola em Crescimento</h3>
            <p className="text-purple-200/70 text-sm mb-6">Para escolas que possuem professores e precisam de controle total.</p>
            <div className="mb-8">
              <span className="text-4xl font-black text-white">R$ 149</span>
              <span className="text-purple-200/50">/mês</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-sm text-white"><CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" /> Até 200 alunos</li>
              <li className="flex items-center gap-3 text-sm text-white"><CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" /> Portal para até 10 professores</li>
              <li className="flex items-center gap-3 text-sm text-white"><CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" /> Relatórios financeiros avançados</li>
              <li className="flex items-center gap-3 text-sm text-white"><CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" /> Emissão de boletos</li>
            </ul>
            <Link href="/login" className="w-full py-3 rounded-xl font-bold text-center bg-purple-500 hover:bg-white text-black font-semibold transition-colors shadow-lg shadow-none">
              Assinar Pro
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-neutral-900/30 border border-neutral-800 p-8 rounded-3xl border border-white/10 hover:border-purple-500/30 transition-colors flex flex-col">
            <h3 className="text-xl font-semibold text-white mb-2">Rede de Escolas</h3>
            <p className="text-gray-400 text-sm mb-6">Para instituições com múltiplas unidades ou grande volume.</p>
            <div className="mb-8">
              <span className="text-4xl font-black text-white">Sob medida</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-sm text-gray-300"><CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" /> Alunos ilimitados</li>
              <li className="flex items-center gap-3 text-sm text-gray-300"><CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" /> Múltiplas unidades</li>
              <li className="flex items-center gap-3 text-sm text-gray-300"><CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" /> API e Integrações</li>
              <li className="flex items-center gap-3 text-sm text-gray-300"><CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" /> Gerente de conta dedicado</li>
            </ul>
            <Link href="mailto:contato@wakoda.com.br" className="w-full py-3 rounded-xl font-semibold text-center border border-white/10 hover:bg-white/5 transition-colors">
              Falar com Vendas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
