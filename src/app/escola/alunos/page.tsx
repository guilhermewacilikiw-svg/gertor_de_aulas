import { Search, Plus, ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/shared/PageHeader';
import { redirect } from 'next/navigation';
import { ImportStudentsModal } from './client-modal';
import Link from 'next/link';
import { getAuthenticatedSchool } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AlunosPage() {
  const authContext = await getAuthenticatedSchool();
  if (!authContext) redirect('/login');

  const { schoolId: SCHOOL_ID } = authContext;
  const supabase = await createClient();

  // Fetch real students from the database
  const { data: students, error: studentsError } = await supabase
    .from('students')
    .select('id, name, email, status, created_at')
    .eq('school_id', SCHOOL_ID)
    .order('created_at', { ascending: false });

  if (studentsError) {
    console.error('Error fetching students:', studentsError);
  }

  const total = students?.length || 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">
      <PageHeader
        title="Alunos"
        subtitle={`${total} ${total === 1 ? 'aluno cadastrado' : 'alunos cadastrados'} na sua escola.`}
        action={
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <ImportStudentsModal />
            <Link
              href="/escola/alunos/novo"
              className="inline-flex items-center justify-center gap-2 px-4 min-h-11 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Novo aluno
            </Link>
          </div>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" aria-hidden="true" />
          <input
            type="text"
            aria-label="Buscar aluno por nome"
            placeholder="Buscar aluno por nome"
            className="w-full min-h-11 bg-white/[0.04] border border-white/10 rounded-lg pl-10 pr-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>
        <div className="inline-flex p-1 rounded-lg bg-white/[0.04] text-sm">
          <button className="px-4 min-h-9 rounded-md bg-white/10 text-white">Todos</button>
          <button className="px-4 min-h-9 rounded-md text-gray-400 hover:text-white">Inativos</button>
        </div>
      </div>

      {students && students.length > 0 ? (
        <ul className="divide-y divide-white/5 border-t border-white/10">
          {(students as any[]).map((student) => (
            <li key={student.id}>
              <Link
                href={`/escola/alunos/${student.id}`}
                className="flex items-center gap-4 py-3 px-2 -mx-2 rounded-lg hover:bg-white/[0.03] transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center font-medium shrink-0">
                  {student.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{student.name}</p>
                  <p className="text-sm text-gray-400 truncate">{student.email || 'Sem e-mail'}</p>
                </div>
                <span className="hidden sm:block text-sm text-gray-400 shrink-0">
                  Nível {student.level || 1} · {student.xp_points || 0} XP
                </span>
                <span className={`text-xs px-2 py-1 rounded-md shrink-0 ${
                  student.status === 'active' ? 'bg-green-500/15 text-green-300' : 'bg-white/5 text-gray-400'
                }`}>
                  {student.status === 'active' ? 'Ativo' : 'Pendente'}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-500 shrink-0" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="py-20 text-center border-t border-white/10">
          <p className="text-white font-medium">Cadastre seu primeiro aluno</p>
          <p className="text-sm text-gray-400 mt-1 mb-4">Sua escola ainda não tem alunos matriculados.</p>
          <Link
            href="/escola/alunos/novo"
            className="inline-flex items-center gap-2 px-4 min-h-11 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Novo aluno
          </Link>
        </div>
      )}
    </div>
  );
}
