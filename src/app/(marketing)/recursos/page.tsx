"use client";

import { useState } from 'react';
import { Users, GraduationCap, Calendar, BarChart3, CheckCircle2 } from 'lucide-react';

export default function RecursosPage() {
  const [activeTab, setActiveTab] = useState('alunos');

  return (
    <div className="py-24 sm:py-32 relative z-10 min-h-[calc(100vh-200px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">Tudo o que você precisa em <span className="text-purple-400">um só lugar</span></h1>
          <p className="text-gray-400 text-lg">Navegue pelas abas abaixo e descubra como o Wakoda se adapta perfeitamente a cada área do seu negócio.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Tabs List */}
          <div className="w-full lg:w-1/3 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
            <button 
              onClick={() => setActiveTab('alunos')}
              className={`flex items-center gap-4 px-6 py-5 rounded-2xl text-left transition-all min-w-[200px] lg:min-w-0 ${activeTab === 'alunos' ? 'bg-purple-500/20 border-purple-500/50 border text-white' : 'hover:bg-white/5 border border-transparent text-gray-400 hover:text-gray-200'}`}
            >
              <div className={`p-2 rounded-xl ${activeTab === 'alunos' ? 'bg-purple-500/30' : 'bg-white/5'}`}>
                <Users className={`w-5 h-5 ${activeTab === 'alunos' ? 'text-purple-400' : 'text-gray-500'}`} />
              </div>
              <div>
                <h4 className="font-semibold text-base">Alunos</h4>
                <p className="text-xs opacity-70 hidden sm:block mt-1">Gestão de matrículas</p>
              </div>
            </button>

            <button 
              onClick={() => setActiveTab('professores')}
              className={`flex items-center gap-4 px-6 py-5 rounded-2xl text-left transition-all min-w-[200px] lg:min-w-0 ${activeTab === 'professores' ? 'bg-indigo-500/20 border-indigo-500/50 border text-white' : 'hover:bg-white/5 border border-transparent text-gray-400 hover:text-gray-200'}`}
            >
              <div className={`p-2 rounded-xl ${activeTab === 'professores' ? 'bg-indigo-500/30' : 'bg-white/5'}`}>
                <GraduationCap className={`w-5 h-5 ${activeTab === 'professores' ? 'text-indigo-400' : 'text-gray-500'}`} />
              </div>
              <div>
                <h4 className="font-semibold text-base">Professores</h4>
                <p className="text-xs opacity-70 hidden sm:block mt-1">Portal e chamadas</p>
              </div>
            </button>

            <button 
              onClick={() => setActiveTab('agenda')}
              className={`flex items-center gap-4 px-6 py-5 rounded-2xl text-left transition-all min-w-[200px] lg:min-w-0 ${activeTab === 'agenda' ? 'bg-cyan-500/20 border-cyan-500/50 border text-white' : 'hover:bg-white/5 border border-transparent text-gray-400 hover:text-gray-200'}`}
            >
              <div className={`p-2 rounded-xl ${activeTab === 'agenda' ? 'bg-cyan-500/30' : 'bg-white/5'}`}>
                <Calendar className={`w-5 h-5 ${activeTab === 'agenda' ? 'text-cyan-400' : 'text-gray-500'}`} />
              </div>
              <div>
                <h4 className="font-semibold text-base">Agenda</h4>
                <p className="text-xs opacity-70 hidden sm:block mt-1">Salas e ensaios</p>
              </div>
            </button>

            <button 
              onClick={() => setActiveTab('financeiro')}
              className={`flex items-center gap-4 px-6 py-5 rounded-2xl text-left transition-all min-w-[200px] lg:min-w-0 ${activeTab === 'financeiro' ? 'bg-emerald-500/20 border-emerald-500/50 border text-white' : 'hover:bg-white/5 border border-transparent text-gray-400 hover:text-gray-200'}`}
            >
              <div className={`p-2 rounded-xl ${activeTab === 'financeiro' ? 'bg-emerald-500/30' : 'bg-white/5'}`}>
                <BarChart3 className={`w-5 h-5 ${activeTab === 'financeiro' ? 'text-emerald-400' : 'text-gray-500'}`} />
              </div>
              <div>
                <h4 className="font-semibold text-base">Financeiro</h4>
                <p className="text-xs opacity-70 hidden sm:block mt-1">Cobranças e relatórios</p>
              </div>
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="w-full lg:w-2/3">
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-8 sm:p-12 rounded-3xl relative overflow-hidden min-h-[400px] flex flex-col justify-center transition-all duration-500">
              
              {/* Content: Alunos */}
              {activeTab === 'alunos' && (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -mr-20 -mt-20" />
                  <h3 className="text-3xl font-bold text-white mb-4">Gestão Completa de Alunos</h3>
                  <p className="text-gray-400 leading-relaxed text-lg mb-8 max-w-xl">
                    Acompanhe o desenvolvimento, presenças, histórico e mensalidades de cada aluno de forma simplificada. Tenha uma visão 360º de cada matrícula em um único painel.
                  </p>
                  <ul className="space-y-4">
                    {['Histórico de aulas e notas musicais', 'Controle de inadimplência automatizado', 'Relatórios de evolução do aluno'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-base text-gray-300">
                        <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Content: Professores */}
              {activeTab === 'professores' && (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -mr-20 -mt-20" />
                  <h3 className="text-3xl font-bold text-white mb-4">Portal do Professor</h3>
                  <p className="text-gray-400 leading-relaxed text-lg mb-8 max-w-xl">
                    Dê autonomia para sua equipe. Professores podem acessar suas turmas, enviar materiais de estudo e realizar chamadas em segundos, direto do celular.
                  </p>
                  <ul className="space-y-4">
                    {['Diário de classe digital', 'Compartilhamento de partituras e áudios', 'Cálculo automático de horas-aula'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-base text-gray-300">
                        <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Content: Agenda */}
              {activeTab === 'agenda' && (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] -mr-20 -mt-20" />
                  <h3 className="text-3xl font-bold text-white mb-4">Agenda Inteligente</h3>
                  <p className="text-gray-400 leading-relaxed text-lg mb-8 max-w-xl">
                    Organize ensaios, evite conflitos de reserva de salas e gerencie as reposições de aulas sem dor de cabeça com nossa agenda interativa.
                  </p>
                  <ul className="space-y-4">
                    {['Calendário visual e interativo', 'Alocação de salas e estúdios', 'Avisos automáticos de reagendamento'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-base text-gray-300">
                        <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Content: Financeiro */}
              {activeTab === 'financeiro' && (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -mr-20 -mt-20" />
                  <h3 className="text-3xl font-bold text-white mb-4">Financeiro Descomplicado</h3>
                  <p className="text-gray-400 leading-relaxed text-lg mb-8 max-w-xl">
                    Métricas em tempo real. Saiba exatamente qual o seu faturamento, custos com professores e projete o crescimento da sua escola de forma visual e intuitiva.
                  </p>
                  <div className="w-full max-w-md bg-[#0a0514] border border-white/10 rounded-2xl p-4 shadow-2xl relative mb-6">
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                        <div className="h-4 w-24 bg-white/10 rounded-full"></div>
                        <div className="h-4 w-12 bg-emerald-500/20 rounded-full"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-8 w-full bg-gradient-to-r from-emerald-500/20 to-transparent rounded-lg"></div>
                      <div className="h-8 w-3/4 bg-gradient-to-r from-purple-500/20 to-transparent rounded-lg"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
