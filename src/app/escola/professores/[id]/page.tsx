import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ArrowLeft, Mail, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const DAYS_OF_WEEK = [
  'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
];

export default async function ProfessorProfilePage({ params }: { params: Promise<{ id: string }> }) {
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

  // Fetch Teacher data along with their user info
  const { data: teacher, error } = await supabase
    .from('teachers')
    .select('*, users(name, email)')
    .eq('id', id)
    .eq('school_id', SCHOOL_ID)
    .single();

  if (!teacher || error) {
    redirect('/escola/professores');
  }

  // Fetch Classes assigned to this teacher
  const { data: classes } = await supabase
    .from('classes')
    .select('*, courses(name), class_schedules(*), enrollments(id)')
    .eq('teacher_id', teacher.id)
    .eq('school_id', SCHOOL_ID)
    .order('name');

  const userName = teacher.users?.name || 'Professor';

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20 animate-in fade-in duration-500">
      <Link href="/escola/professores" className="inline-flex items-center gap-2 min-h-11 text-sm text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Voltar para professores
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center text-2xl font-medium shrink-0">
          {userName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold text-white truncate">{userName}</h1>
          <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
            <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{teacher.users?.email || 'E-mail não informado'}</span>
          </p>
        </div>
        <div className="rounded-xl bg-white/[0.04] px-4 py-3">
          <p className="text-sm text-gray-400">Especialidade</p>
          <p className="text-white">{teacher.specialty || 'Geral'}</p>
        </div>
      </div>

      <section>
        <h2 className="text-base font-medium text-white border-b border-white/10 pb-3">Turmas deste professor</h2>

        {!classes || classes.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-white font-medium">Nenhuma turma atribuída</p>
            <p className="text-sm text-gray-400 mt-1">Vincule o professor a uma turma na tela de turmas.</p>
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {classes.map((turma: any) => {
              const enrolledCount = Array.isArray(turma.enrollments) ? turma.enrollments.length : (turma.enrollments?.count || 0);
              const schedules = Array.isArray(turma.class_schedules) ? turma.class_schedules : [];
              const ativa = turma.status === 'active';

              return (
                <li key={turma.id} className="py-4 flex flex-col md:flex-row gap-4 md:gap-8">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/escola/turmas/${turma.id}`} className="text-white hover:underline">{turma.name}</Link>
                      <span className={`text-xs px-2 py-0.5 rounded-md ${ativa ? 'bg-green-500/15 text-green-300' : 'bg-white/5 text-gray-400'}`}>
                        {ativa ? 'Ativa' : 'Inativa'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      {turma.courses?.name} · {enrolledCount} / {turma.capacity || 0} vagas ocupadas
                    </p>
                  </div>

                  <div className="md:w-72 shrink-0">
                    {schedules.length > 0 ? (
                      <ul className="space-y-2">
                        {schedules.map((schedule: any) => (
                          <li key={schedule.id} className="text-sm text-gray-300">
                            <span className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400 shrink-0" aria-hidden="true" />
                              {DAYS_OF_WEEK[schedule.day_of_week]}, {schedule.start_time.slice(0, 5)} às {schedule.end_time.slice(0, 5)}
                            </span>
                            {schedule.room && (
                              <span className="flex items-center gap-2 text-gray-400 mt-0.5">
                                <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
                                {schedule.room}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400">Nenhum horário definido.</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
