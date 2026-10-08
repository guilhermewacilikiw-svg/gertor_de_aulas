import { Users, GraduationCap, Calendar, BookOpen, ChevronRight, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
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

  const hora = Number(new Intl.DateTimeFormat('pt-BR', { hour: 'numeric', hour12: false, timeZone: 'America/Sao_Paulo' }).format(new Date()));
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';

  const indicadores = [
    { titulo: 'Alunos ativos', valor: totalStudents || 0, icone: Users },
    { titulo: 'Turmas', valor: totalClasses || 0, icone: BookOpen },
    { titulo: 'Professores', valor: totalTeachers || 0, icone: GraduationCap },
    { titulo: 'Aulas hoje', valor: totalLessonsToday || 0, icone: Calendar },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">{saudacao}, {schoolName}</h1>
          <p className="text-sm text-gray-400 mt-1">
            {totalLessonsToday
              ? `Você tem ${totalLessonsToday} ${totalLessonsToday === 1 ? 'aula agendada' : 'aulas agendadas'}.`
              : 'Hoje não há aulas agendadas.'}
          </p>
        </div>
        <Link
          href="/escola/alunos/novo"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-11 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo aluno
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {indicadores.map(({ titulo, valor, icone: Icone }) => (
          <div key={titulo} className="rounded-xl bg-white/[0.04] p-4">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-sm">{titulo}</span>
              <Icone className="w-4 h-4" aria-hidden="true" />
            </div>
            <p className="text-3xl font-semibold text-white mt-2">{valor}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        <span className="text-gray-400 self-center mr-1">Criar:</span>
        {[
          { href: '/escola/turmas/novo', rotulo: 'Turma' },
          { href: '/escola/professores/novo', rotulo: 'Professor' },
          { href: '/escola/cursos/novo', rotulo: 'Curso' },
        ].map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="inline-flex items-center gap-1.5 px-3 min-h-11 rounded-lg border border-white/10 text-gray-200 hover:bg-white/5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-red-500" aria-hidden="true" />
            {a.rotulo}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <section className="lg:col-span-3 min-w-0">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-base font-medium text-white">Alunos recentes</h2>
            <Link href="/escola/alunos" className="text-sm text-gray-400 hover:text-white inline-flex items-center gap-1 min-h-11">
              Ver todos ({totalStudents || 0})
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          {recentStudents && recentStudents.length > 0 ? (
            <ul className="divide-y divide-white/5">
              {recentStudents.map((student: any) => {
                const nome = student.name || 'Aluno sem nome';
                const matriculas = Array.isArray(student.enrollments) ? student.enrollments : (student.enrollments ? [student.enrollments] : []);
                const primeira: any = matriculas[0];
                const turma = primeira?.classes?.name || primeira?.courses?.name || 'Sem turma';
                const ativo = student.status === 'active';
                return (
                  <li key={student.id}>
                    <Link href={`/escola/alunos/${student.id}`} className="flex items-center gap-3 py-3 hover:bg-white/[0.03] -mx-2 px-2 rounded-lg transition-colors">
                      <div className="w-9 h-9 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center text-sm font-medium shrink-0">
                        {nome.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{nome}</p>
                        <p className="text-sm text-gray-400 truncate">{turma}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-md ${ativo ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/5 text-gray-400'}`}>
                        {ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="py-12 text-center">
              <p className="text-white font-medium">Cadastre seu primeiro aluno</p>
              <p className="text-sm text-gray-400 mt-1 mb-4">Os alunos mais recentes aparecem aqui.</p>
              <Link href="/escola/alunos/novo" className="inline-flex items-center gap-2 px-4 min-h-11 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium">
                <Plus className="w-4 h-4" />
                Novo aluno
              </Link>
            </div>
          )}
        </section>

        <section className="lg:col-span-2 min-w-0">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-base font-medium text-white">Turmas e vagas</h2>
            <Link href="/escola/turmas" className="text-sm text-gray-400 hover:text-white inline-flex items-center gap-1 min-h-11">
              Ver todas
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          {topClasses && topClasses.length > 0 ? (
            <ul className="divide-y divide-white/5">
              {topClasses.map((cls: any) => {
                const matriculados = cls.enrollments?.length || 0;
                const capacidade = cls.capacity || 30;
                const percentual = Math.min(100, Math.round((matriculados / capacidade) * 100));
                return (
                  <li key={cls.id}>
                    <Link href={`/escola/turmas/${cls.id}`} className="block py-3 hover:bg-white/[0.03] -mx-2 px-2 rounded-lg transition-colors">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-sm text-white truncate">{cls.name}</span>
                        <span className="text-sm text-gray-400 shrink-0">{matriculados} / {capacidade}</span>
                      </div>
                      <div
                        className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden"
                        role="progressbar"
                        aria-valuenow={percentual}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Ocupação da turma ${cls.name}`}
                      >
                        <div className="h-full rounded-full bg-red-500" style={{ width: `${percentual}%` }} />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="py-12 text-center">
              <p className="text-white font-medium">Crie sua primeira turma</p>
              <p className="text-sm text-gray-400 mt-1 mb-4">Acompanhe as vagas de cada turma aqui.</p>
              <Link href="/escola/turmas/novo" className="inline-flex items-center gap-2 px-4 min-h-11 rounded-lg border border-white/10 text-white text-sm hover:bg-white/5">
                <Plus className="w-4 h-4 text-red-500" />
                Nova turma
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
