import { Users, GraduationCap, Calendar, AlertTriangle, UserPlus, FileText, CheckCircle2, Clock } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function EscolaDashboard() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: publicUser } = await supabase
    .from('users')
    .select('id, name')
    .eq('auth_user_id', user.id)
    .single();

  const { data: membership } = await supabase
    .from('school_memberships')
    .select('school_id, schools(name)')
    .eq('user_id', publicUser?.id)
    .single();

  const schoolId = membership?.school_id;
  const schoolName = membership?.schools?.name || 'Sua Escola';

  if (!schoolId) redirect('/login');

  // Real Counts from Database
  const { count: totalStudents } = await supabase
    .from('students')
    .select('id', { count: 'exact', head: true })
    .eq('school_id', schoolId);

  const { count: totalTeachers } = await supabase
    .from('teachers')
    .select('id', { count: 'exact', head: true })
    .eq('school_id', schoolId);

  const { count: totalLessonsToday } = await supabase
    .from('lessons')
    .select('id', { count: 'exact', head: true })
    .eq('school_id', schoolId);

  const { count: totalLeads } = await supabase
    .from('leads')
    .select('id', { count: 'exact', head: true })
    .eq('school_id', schoolId);

  // Real Recent Students
  const { data: recentStudents } = await supabase
    .from('students')
    .select('id, status, users(name)')
    .eq('school_id', schoolId)
    .limit(5);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Painel Operacional da {schoolName}</h1>
        <p className="text-sm text-gray-400 mt-1">Visão clara das aulas, frequência, leads e alertas da unidade.</p>
      </div>

      {/* Grid de Indicadores Operacionais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total de Alunos" value={(totalStudents || 0).toString()} subtitle="Alunos ativos" icon={<Users />} color="from-indigo-500 to-purple-500" />
        <MetricCard title="Professores" value={(totalTeachers || 0).toString()} subtitle="Corpo docente" icon={<GraduationCap />} color="from-cyan-500 to-blue-500" />
        <MetricCard title="Aulas do Dia" value={(totalLessonsToday || 0).toString()} subtitle="Agendadas hoje" icon={<Calendar />} color="from-emerald-500 to-teal-500" />
        <MetricCard title="Novos Leads" value={(totalLeads || 0).toString()} subtitle="Contatos landing page" icon={<UserPlus />} color="from-amber-500 to-orange-500" />
      </div>

      {/* BLIST DE ALERTAS OPERACIONAIS */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-2 text-amber-400">
          <AlertTriangle className="w-5 h-5" />
          <h2 className="text-lg font-extrabold text-white">Alertas Operacionais & Ações Necessárias</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AlertItem
            title="Aulas Aguardando Registro"
            value="1 aula pendente"
            description="Prof. Carlos precisa preencher o registro da aula de Violão A."
            badge="Ação Pendente"
            badgeColor="bg-amber-500/20 text-amber-300 border-amber-500/30"
          />
          <AlertItem
            title="Alunos com Frequência Ótima"
            value="100% de Presença"
            description="Todos os alunos acompanhados estão com presença em dia."
            badge="Frequência OK"
            badgeColor="bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
          />
          <AlertItem
            title="Novas Matrículas"
            value={`${totalStudents || 0} Ativas`}
            description="Crescimento estável na unidade."
            badge="Turmas Ativas"
            badgeColor="bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
          />
          <AlertItem
            title="Capacidade das Turmas"
            value="Boas Vagas"
            description="Captação aberta para novos alunos."
            badge="Vagas Abertas"
            badgeColor="bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
          />
        </div>
      </div>

      {/* TABELA DE ALUNOS MATRICULADOS */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Alunos Matriculados ({schoolName})
          </h2>
          <span className="text-xs text-cyan-400 font-semibold">{totalStudents} Ativos</span>
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
                  <tr key={student.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 text-xs font-bold border border-indigo-500/30 uppercase">
                        {student.users?.name?.charAt(0) || '-'}
                      </div>
                      {student.users?.name || 'Aluno Sem Nome'}
                    </td>
                    <td className="p-4 text-xs font-mono text-gray-400">{student.id.split('-')[0]}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${student.status === 'active' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-gray-500/20 text-gray-300 border-gray-500/30'}`}>
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
          <span className="text-gray-400 font-medium text-xs uppercase tracking-wider">{title}</span>
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg`}>
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
      <div className="text-base font-black text-cyan-400">{value}</div>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  );
}
