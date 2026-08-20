'use client';

import { Activity, BookOpen, CheckCircle, TrendingUp, Target, Zap, PieChart as PieChartIcon } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';

export interface PerformanceData {
  attendanceRate: number;
  totalPresent: number;
  totalAbsent: number;
  completedContents: number;
  totalContents: number;
  completedExercises: number; // Replaces averageGrade
  totalExercises: number;
  recentActivities: {
    id: string;
    date: Date;
    type: 'attendance' | 'content' | 'exercise';
    title: string;
    status: string; 
  }[];
  distributionData: { name: string; value: number; color: string }[];
  evolutionData: { month: string; aulas: number; materiais: number }[];
}

export function PerformanceDashboard({ data }: { data: PerformanceData }) {
  
  const contentProgressPercent = data.totalContents > 0 
    ? Math.round((data.completedContents / data.totalContents) * 100) 
    : 0;

  const exerciseProgressPercent = data.totalExercises > 0 
    ? Math.round((data.completedExercises / data.totalExercises) * 100) 
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. TOP STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Attendance Card */}
        <div className="bg-neutral-900/40 border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-cyan-500/30 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 text-cyan-400 mb-4">
              <div className="p-2 rounded-xl bg-cyan-500/10">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-bold uppercase tracking-wider text-xs">Aulas Presenciais</h3>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-white">{data.attendanceRate}%</span>
              <span className="text-sm font-medium text-gray-400 mb-1">presença geral</span>
            </div>
            <div className="mt-4 flex gap-4 text-xs font-medium">
              <span className="text-emerald-400">{data.totalPresent} presenças</span>
              <span className="text-rose-400">{data.totalAbsent} faltas</span>
            </div>
          </div>
        </div>

        {/* Digital Content Card */}
        <div className="bg-neutral-900/40 border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-indigo-500/30 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 text-indigo-400 mb-4">
              <div className="p-2 rounded-xl bg-indigo-500/10">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold uppercase tracking-wider text-xs">Materiais e Vídeos</h3>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-white">{contentProgressPercent}%</span>
              <span className="text-sm font-medium text-gray-400 mb-1">concluído</span>
            </div>
            <div className="mt-4 w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-400 to-cyan-400 rounded-full transition-all duration-1000"
                style={{ width: `${contentProgressPercent}%` }}
              />
            </div>
            <p className="mt-2 text-xs font-medium text-gray-400">
              {data.completedContents} de {data.totalContents} consumidos
            </p>
          </div>
        </div>

        {/* Exercises Card */}
        <div className="bg-neutral-900/40 border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 text-emerald-400 mb-4">
              <div className="p-2 rounded-xl bg-emerald-500/10">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold uppercase tracking-wider text-xs">Exercícios Complementares</h3>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-white">{data.completedExercises}</span>
              <span className="text-sm font-medium text-gray-400 mb-1">entregues</span>
            </div>
            <div className="mt-4 w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
              <div 
                className="h-full bg-emerald-400 rounded-full transition-all duration-1000"
                style={{ width: `${exerciseProgressPercent}%` }}
              />
            </div>
            <p className="mt-2 text-xs font-medium text-gray-400">
              {data.completedExercises} de {data.totalExercises} exercícios
            </p>
          </div>
        </div>
      </div>

      {/* 2. CHARTS AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pie Chart: Distribution */}
        <div className="bg-neutral-900/40 border border-white/10 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <PieChartIcon className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-lg text-white">Distribuição de Participação</h3>
          </div>
          
          <div className="w-full h-72">
            {data.distributionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                <Activity className="w-12 h-12 opacity-20 mb-2" />
                <p className="text-sm">Sem dados suficientes.</p>
              </div>
            )}
          </div>
        </div>

        {/* Bar Chart: Evolution */}
        <div className="bg-neutral-900/40 border border-white/10 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-lg text-white">Engajamento Mensal</h3>
          </div>
          
          <div className="w-full h-72">
            {data.evolutionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.evolutionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  />
                  <Legend verticalAlign="top" height={36}/>
                  <Bar dataKey="aulas" name="Aulas Assistidas" fill="#818cf8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="materiais" name="Exercícios/Materiais" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
               <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                <TrendingUp className="w-12 h-12 opacity-20 mb-2" />
                <p className="text-sm">Aguardando mais dados.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 3. RECENT ACTIVITY FEED */}
      <div className="bg-neutral-900/40 border border-white/10 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-white/10 bg-black/20 flex items-center justify-between">
          <h3 className="font-bold text-lg text-white">Histórico de Engajamento</h3>
        </div>
        <div className="divide-y divide-white/5">
          {data.recentActivities.length > 0 ? (
            data.recentActivities.map((act) => (
              <div key={act.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl border ${
                    act.type === 'attendance' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' :
                    act.type === 'content' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' :
                    'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  }`}>
                    {act.type === 'attendance' ? <BookOpen className="w-5 h-5" /> :
                     act.type === 'content' ? <Activity className="w-5 h-5" /> :
                     <CheckCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{act.title}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {act.date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex sm:justify-end">
                  {act.type === 'attendance' && (
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      act.status === 'present' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {act.status === 'present' ? 'Presente' : 'Falta'}
                    </span>
                  )}
                  {act.type === 'content' && (
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      Assistido
                    </span>
                  )}
                  {act.type === 'exercise' && (
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Entregue
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p className="text-sm">Nenhuma atividade recente encontrada.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
