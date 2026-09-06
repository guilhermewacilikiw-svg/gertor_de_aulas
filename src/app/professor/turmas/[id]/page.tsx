import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ArrowLeft, Clock, Calendar as CalendarIcon, FileText, CheckCircle2, Star } from 'lucide-react';
import Link from 'next/link';
import { CreateLessonButton } from './client-button';

export default async function TurmaPage({ params }: { params: Promise<{ id: string }> }) {
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

  const { data: teacherRecord } = await supabase
    .from('teachers')
    .select('id')
    .eq('user_id', publicUser.id)
    .single();

  if (!teacherRecord) redirect('/login');

  // Buscar detalhes da turma
  const { data: classData, error: classError } = await supabase
    .from('classes')
    .select('*, courses(name)')
    .eq('id', id)
    .eq('teacher_id', teacherRecord.id)
    .single();

  if (classError || !classData) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4 text-white">Turma não encontrada</h2>
        <Link href="/professor/turmas" className="text-red-500 hover:underline">
          &larr; Voltar para Minhas Turmas
        </Link>
      </div>
    );
  }

  // Buscar histórico de aulas
  const { data: lessons } = await supabase
    .from('lessons')
    .select('*, lesson_records(summary)')
    .eq('class_id', id)
    .order('scheduled_start', { ascending: false });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link href="/professor/turmas" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" />
        Voltar para Turmas
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 text-sm text-red-500 font-semibold mb-2 uppercase tracking-wider">
            {classData.courses?.name}
          </div>
          <h1 className="text-3xl font-black text-white mb-2">{classData.name}</h1>
          <p className="text-gray-400">Histórico de aulas e registros desta turma.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href={`/professor/avaliacoes/lancar?classId=${classData.id}`}
            className="px-5 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-amber-500/10 active:scale-95"
          >
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            Lançar Avaliações
          </Link>
          <CreateLessonButton classId={classData.id} />
        </div>
      </div>

      <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-8 mt-8 shadow-lg">
        <h2 className="text-xl font-bold text-white mb-6">Aulas Registradas</h2>
        
        <div className="space-y-4">
          {(!lessons || lessons.length === 0) && (
            <p className="text-gray-400 text-center py-8">Nenhuma aula registrada ainda.</p>
          )}
          
          {lessons?.map(lesson => (
            <div key={lesson.id} className="bg-black/50 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex items-center gap-1.5 bg-red-500/10 text-red-500 px-3 py-1 rounded-lg text-xs font-semibold border border-red-500/20">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    {new Date(lesson.scheduled_start).toLocaleDateString('pt-BR')}
                  </span>
                  {lesson.status === 'completed' ? (
                    <span className="flex items-center gap-1.5 bg-red-500/10 text-red-500 px-3 py-1 rounded-lg text-xs font-semibold border border-red-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Finalizada
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 bg-white/10 text-white px-3 py-1 rounded-lg text-xs font-semibold border border-white/20">
                      <Clock className="w-3.5 h-3.5" />
                      Pendente
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-white text-lg group-hover:text-red-500 transition-colors">
                  {lesson.topic || 'Aula sem título'}
                </h3>
                {lesson.lesson_records?.[0]?.summary && (
                  <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                    {lesson.lesson_records[0].summary}
                  </p>
                )}
              </div>
              <div className="shrink-0">
                <Link href={`/professor/diario/${lesson.id}`} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl text-sm flex items-center gap-2 transition-colors border border-white/10">
                  <FileText className="w-4 h-4" />
                  Abrir Diário
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
