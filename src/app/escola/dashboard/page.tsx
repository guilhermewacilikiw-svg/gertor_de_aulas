import { Users, GraduationCap, Calendar, AlertTriangle, UserPlus, FileText, CheckCircle2, Clock, LayoutDashboard } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { redirect } from 'next/navigation';
import { getAuthenticatedSchool } from '@/lib/auth';

export default async function EscolaDashboard() {
  const authContext = await getAuthenticatedSchool();
  if (!authContext) redirect('/login');

  const { schoolId, schoolName } = authContext;
  const supabase = await createClient();

  // Real Counts and Data from Database using Promise.all for performance
  const [
    { count: totalStudents },
    { count: totalTeachers },
    { count: totalLessonsToday },
    { count: totalLeads },
    { data: recentStudents }
  ] = await Promise.all([
    supabase.from('students').select('id', { count: 'exact', head: true }).eq('school_id', schoolId),
    supabase.from('teachers').select('id', { count: 'exact', head: true }).eq('school_id', schoolId),
    supabase.from('lessons').select('id', { count: 'exact', head: true }).eq('school_id', schoolId),
    supabase.from('leads').select('id', { count: 'exact', head: true }).eq('school_id', schoolId),
    supabase.from('students').select('id, status, users(name)').eq('school_id', schoolId).limit(5)
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Header Padronizado */}
      <PageHeader
        badgeIcon={<LayoutDashboard className="w-4 h-4" />}
        badgeText="Painel Operacional"
        title="Dashboard"
        subtitle={`Visão clara das aulas, frequência, corpo docente e alertas operacionais da ${schoolName}.`}
        action={
          <div className="relative bg-[#0e0e14] border border-white/10 p-4 px-6 rounded-2xl flex flex-col items-center justify-center min-w-[140px] shadow-xl">
            <span className="text-4xl font-black text-white drop-shadow-md">
              {totalStudents || 0}
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Alunos Ativos</span>
          </div>
        }
      />

      {/* Grid de Indicadores Operacionais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total de Alunos" value={totalStudents || 0} subtitle="Alunos matriculados" icon={<Users className="w-5 h-5" />} />
        <StatCard title="Professores" value={totalTeachers || 0} subtitle="Corpo docente ativo" icon={<GraduationCap className="w-5 h-5" />} />
        <StatCard title="Aulas do Dia" value={totalLessonsToday || 0} subtitle="Agendadas para hoje" icon={<Calendar className="w-5 h-5" />} />
        <StatCard title="Novos Leads" value={totalLeads || 0} subtitle="Interessados na landing page" icon={<UserPlus className="w-5 h-5" />} />
      </div>


      {/* TABELA DE ALUNOS MATRICULADOS */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black">
          <h2 className="text-lg font-black uppercase text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-red-500" />
            Alunos Matriculados ({schoolName})
          </h2>
          <span className="text-xs text-red-400 font-bold tracking-widest uppercase">{totalStudents} Ativos</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-black/30 text-xs uppercase text-gray-400 border-b border-white/5">
              <tr>
                <th className="p-4">Aluno</th>
                <th className="p-4">Código</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentStudents && recentStudents.length > 0 ? (
                recentStudents.map((student: any) => (
                  <tr key={student.id} className="hover:bg-white/5 transition-colors border-b border-white/5">
                    <td className="p-4 font-bold text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 text-xs font-bold border border-red-500/20 uppercase">
                        {student.users?.name?.charAt(0) || '-'}
                      </div>
                      {student.users?.name || 'Aluno Sem Nome'}
                    </td>
                    <td className="p-4 text-xs font-mono text-gray-400">{student.id.split('-')[0]}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded text-xs font-bold border ${student.status === 'active' ? 'bg-white/10 text-white border-white/20' : 'bg-transparent text-gray-500 border-gray-800'}`}>
                        {student.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">
                    Nenhum aluno cadastrado ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

function MetricCard({ title, value, subtitle, icon, color }: { title: string; value: string; subtitle: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="glass-card p-6 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500`}>
        <div className={`w-24 h-24 bg-gradient-to-br ${color} rounded-full blur-2xl`}></div>
      </div>
      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">{title}</span>
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white border border-white/10`}>
            {icon}
          </div>
        </div>
        <div>
          <div className="text-3xl font-black tracking-tight text-white">{value}</div>
          <div className="text-xs text-gray-400 mt-1">{subtitle}</div>
        </div>
      </div>
    </div>
  );
}

function AlertItem({ title, value, description, badge, badgeColor }: { title: string; value: string; description: string; badge: string; badgeColor: string }) {
  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white text-sm">{title}</h3>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
          {badge}
        </span>
      </div>
      <div className="text-base font-black text-white">{value}</div>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  );
}
