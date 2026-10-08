import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AlunoProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: publicUser } = await supabase
    .from('users')
    .select('id')
    .eq('auth_user_id', user.id)
    .single();

  if (!publicUser) redirect('/login');

  const { data: membership } = await supabase
    .from('school_memberships')
    .select('school_id')
    .eq('user_id', publicUser.id)
    .single();

  const SCHOOL_ID = membership?.school_id;
  if (!SCHOOL_ID) redirect('/login');

  const { data: student, error } = await supabase
    .from('students')
    .select('*, enrollments(*, courses(name), classes(name))')
    .eq('id', id)
    .eq('school_id', SCHOOL_ID)
    .single();

  if (!student || error) {
    redirect('/escola/alunos');
  }

  const enrollments = Array.isArray(student.enrollments) ? student.enrollments : (student.enrollments ? [student.enrollments] : []);

  const ativo = student.status === 'active';

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20 animate-in fade-in duration-500">
      <Link href="/escola/alunos" className="inline-flex items-center gap-2 min-h-11 text-sm text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Voltar para alunos
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center text-2xl font-medium shrink-0">
          {student.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold text-white truncate">{student.name}</h1>
            <span className={`text-xs px-2 py-1 rounded-md ${ativo ? 'bg-green-500/15 text-green-300' : 'bg-white/5 text-gray-400'}`}>
              {ativo ? 'Ativo' : 'Pendente'}
            </span>
          </div>
          <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
            <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{student.email || 'E-mail não informado'}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-sm">
        <div className="rounded-xl bg-white/[0.04] p-4">
          <p className="text-sm text-gray-400">Nível</p>
          <p className="text-3xl font-semibold text-white mt-1">{student.level || 1}</p>
        </div>
        <div className="rounded-xl bg-white/[0.04] p-4">
          <p className="text-sm text-gray-400">Pontos (XP)</p>
          <p className="text-3xl font-semibold text-white mt-1">{student.xp_points || 0}</p>
        </div>
      </div>

      <section>
        <h2 className="text-base font-medium text-white border-b border-white/10 pb-3">Matrículas</h2>

        {enrollments.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-white font-medium">Nenhuma matrícula ainda</p>
            <p className="text-sm text-gray-400 mt-1">Este aluno não está em nenhum curso ou turma.</p>
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {enrollments.map((enr: any) => (
              <li key={enr.id} className="py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">{enr.courses?.name || 'Curso não identificado'}</p>
                  <p className="text-sm text-gray-400">
                    Turma: {enr.classes?.name || 'Somente online (sem turma)'}
                  </p>
                </div>
                <p className="text-sm text-gray-400">
                  Início: {enr.start_date ? new Date(enr.start_date).toLocaleDateString('pt-BR') : 'não informado'}
                </p>
                <span className={`text-xs px-2 py-1 rounded-md self-start sm:self-auto ${enr.status === 'active' ? 'bg-green-500/15 text-green-300' : 'bg-white/5 text-gray-400'}`}>
                  {enr.status === 'active' ? 'Cursando' : 'Inativa'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
