import { Users, GraduationCap, Calendar, UserPlus, BookOpen, ChevronRight, Plus, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { redirect } from 'next/navigation';
import { getAuthenticatedSchool } from '@/lib/auth';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function EscolaDashboard() {
  const authContext = await getAuthenticatedSchool();
  if (!authContext) redirect('/login');

  const { schoolId, schoolName } = authContext;
  const supabase = await createClient();

  // Consultas paralelas otimizadas para alta escala
  const [
    { count: totalStudents },
    { count: totalTeachers },
    { count: totalClasses },
    { count: totalLessonsToday },
    { data: recentStudents },
    { data: topClasses }
  ] = await Promise.all([
    supabase.from('students').select('id', { count: 'exact', head: true }).eq('school_id', schoolId),
    supabase.from('teachers').select('id', { count: 'exact', head: true }).eq('school_id', schoolId),
    supabase.from('classes').select('id', { count: 'exact', head: true }).eq('school_id', schoolId),
    supabase.from('lessons').select('id', { count: 'exact', head: true }).eq('school_id', schoolId),
    supabase
      .from('students')
      .select('id, name, email, status, created_at, enrollments(classes(name), courses(name))')
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false })
      .limit(6),
    supabase
      .from('classes')
      .select('id, name, capacity, courses(name), enrollments(id)')
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false })
      .limit(4)
  ]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Header Padronizado */}
      <PageHeader
        badgeIcon={<Sparkles className="w-4 h-4" />}
        badgeText="Painel Operacional"
        title="Dashboard"
        subtitle={`Visão consolidada da gestão acadêmica, turmas, corpo docente e alunos da ${schoolName}.`}
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
        <StatCard 
          title="Total de Alunos" 
          value={totalStudents || 0} 
          subtitle="Matrículas registradas" 
          icon={<Users className="w-5 h-5" />} 
        />
        <StatCard 
          title="Turmas Formadas" 
          value={totalClasses || 0} 
          subtitle="Classes em andamento" 
          icon={<BookOpen className="w-5 h-5" />} 
        />
        <StatCard 
          title="Professores" 
          value={totalTeachers || 0} 
          subtitle="Corpo docente ativo" 
          icon={<GraduationCap className="w-5 h-5" />} 
        />
        <StatCard 
          title="Aulas do Dia" 
          value={totalLessonsToday || 0} 
          subtitle="Agendadas no calendário" 
          icon={<Calendar className="w-5 h-5" />} 
        />
      </div>

      {/* Atalhos Rápidos de Escalabilidade (Quick Actions) */}
      <div className="bg-[#0f0f15] border border-white/10 p-5 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-red-500" />
            Ações Rápidas de Gestão
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Cadastre novos registros rapidamente com um clique</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap w-full md:w-auto">
          <Link
            href="/escola/alunos/novo"
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-red-600/20 flex items-center justify-center gap-2 hover:scale-105"
          >
            <UserPlus className="w-3.5 h-3.5" />
            + Aluno
          </Link>
          <Link
            href="/escola/turmas/novo"
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <Users className="w-3.5 h-3.5 text-red-500" />
            + Turma
          </Link>
          <Link
            href="/escola/professores/novo"
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <GraduationCap className="w-3.5 h-3.5 text-red-500" />
            + Professor
          </Link>
          <Link
            href="/escola/cursos/novo"
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <BookOpen className="w-3.5 h-3.5 text-red-500" />
            + Curso
          </Link>
        </div>
      </div>

      {/* Grid Principal: Alunos Recentes (Escalável) & Ocupação de Turmas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* TABELA DE ALUNOS MATRICULADOS ESCALÁVEL (8 Colunas) */}
        <div className="lg:col-span-8 bg-[#0a0a0f] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between">
          <div>
            <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-black/40">
              <div>
                <h2 className="text-lg font-black uppercase text-white flex items-center gap-2.5">
                  <Users className="w-5 h-5 text-red-500" />
                  Alunos Matriculados
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Últimos alunos cadastrados na {schoolName}
                </p>
              </div>

              <Link
                href="/escola/alunos"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 transition-all group"
              >
                <span>Ver todos os {totalStudents || 0} alunos</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300 whitespace-nowrap">
                <thead className="bg-black/30 text-[10px] uppercase tracking-wider text-gray-400 border-b border-white/5">
                  <tr>
                    <th className="p-4 px-6 font-black">Aluno</th>
                    <th className="p-4 font-black">Turma / Curso</th>
                    <th className="p-4 font-black">Data de Cadastro</th>
                    <th className="p-4 font-black">Status</th>
                    <th className="p-4 text-right pr-6 font-black">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentStudents && recentStudents.length > 0 ? (
                    recentStudents.map((student: any) => {
                      const studentName = student.name || 'Aluno Sem Nome';
                      const studentInitial = studentName.charAt(0).toUpperCase();
                      const enrollments = Array.isArray(student.enrollments) ? student.enrollments : (student.enrollments ? [student.enrollments] : []);
                      const firstEnrollment: any = enrollments[0];
                      const className = firstEnrollment?.classes?.name || firstEnrollment?.courses?.name || 'Sem turma';
                      const formattedDate = student.created_at 
                        ? new Date(student.created_at).toLocaleDateString('pt-BR') 
                        : '--/--/----';

                      return (
                        <tr key={student.id} className="hover:bg-white/[0.03] transition-colors group">
                          <td className="p-4 px-6">
                            <Link href={`/escola/alunos/${student.id}`} className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-600/30 flex items-center justify-center text-red-500 text-xs font-black shrink-0 group-hover:scale-105 transition-transform uppercase">
                                {studentInitial}
                              </div>
                              <div>
                                <span className="font-bold text-white group-hover:text-red-500 transition-colors block">
                                  {studentName}
                                </span>
                                <span className="text-xs text-gray-500 font-mono block">
                                  {student.email || 'Sem e-mail informado'}
                                </span>
                              </div>
                            </Link>
                          </td>

                          <td className="p-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-gray-300">
                              <BookOpen className="w-3 h-3 text-red-500" />
                              {className}
                            </span>
                          </td>

                          <td className="p-4 text-xs font-mono text-gray-400">
                            {formattedDate}
                          </td>

                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                              student.status === 'active' 
                                ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                                : 'bg-white/5 text-gray-500 border-white/10'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${student.status === 'active' ? 'bg-red-500' : 'bg-gray-500'}`} />
                              {student.status === 'active' ? 'Ativo' : 'Inativo'}
                            </span>
                          </td>

                          <td className="p-4 text-right pr-6">
                            <Link 
                              href={`/escola/alunos/${student.id}`}
                              className="inline-flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-red-400 transition-colors"
                            >
                              <span>Perfil</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-gray-500">
                        <Users className="w-10 h-10 text-gray-600 mx-auto mb-3 opacity-50" />
                        <p className="font-bold text-white text-base mb-1">Nenhum aluno cadastrado ainda</p>
                        <p className="text-xs text-gray-500 mb-4">Comece adicionando seu primeiro aluno para acompanhar no dashboard.</p>
                        <Link
                          href="/escola/alunos/novo"
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          Cadastrar Primeiro Aluno
                        </Link>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 px-6 border-t border-white/5 bg-black/20 flex items-center justify-between text-xs text-gray-500">
            <span>Exibindo os alunos mais recentes</span>
            <Link href="/escola/alunos" className="text-red-500 font-bold hover:underline flex items-center gap-1">
              Ver lista completa com busca e filtros &rarr;
            </Link>
          </div>
        </div>

        {/* PAINEL DE OCUPAÇÃO & VAGAS DE TURMAS (4 Colunas) */}
        <div className="lg:col-span-4 bg-[#0a0a0f] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
              <h3 className="text-base font-black uppercase text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-red-500" />
                Vagas & Turmas
              </h3>
              <Link 
                href="/escola/turmas" 
                className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
              >
                Ver todas &rarr;
              </Link>
            </div>

            <div className="space-y-4">
              {topClasses && topClasses.length > 0 ? (
                topClasses.map((cls: any) => {
                  const enrolledCount = cls.enrollments?.length || 0;
                  const capacity = cls.capacity || 30;
                  const percent = Math.min(100, Math.round((enrolledCount / capacity) * 100));

                  return (
                    <Link
                      href={`/escola/turmas/${cls.id}`}
                      key={cls.id}
                      className="block p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="font-bold text-white text-sm group-hover:text-red-500 transition-colors line-clamp-1">
                          {cls.name}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-wider text-red-400 bg-red-600/10 px-2 py-0.5 rounded-full border border-red-600/20 shrink-0">
                          {percent}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                        <span className="truncate">{cls.courses?.name || 'Curso Livre'}</span>
                        <span className="font-mono text-white font-bold">{enrolledCount} / {capacity}</span>
                      </div>

                      <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/5">
                        <div 
                          className="bg-gradient-to-r from-red-600 to-red-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="p-8 text-center text-gray-500 bg-white/[0.02] rounded-2xl border border-white/5">
                  <p className="text-xs font-medium mb-3">Nenhuma turma cadastrada ainda.</p>
                  <Link
                    href="/escola/turmas/novo"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-400"
                  >
                    + Criar Primeira Turma
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5">
            <Link
              href="/escola/turmas/novo"
              className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:border-red-600/30"
            >
              <Plus className="w-4 h-4 text-red-500" />
              Criar Nova Turma
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
