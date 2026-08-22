import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ArrowLeft, Clock, Calendar as CalendarIcon, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { ClassDiaryForm } from './client-form';

export default async function ProfessorDiarioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Buscar detalhes da aula (garantir que ele é o professor desta aula)
  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select('*, classes(id, name, courses(id, name)), lesson_records(summary)')
    .eq('id', id)
    .single();

  if (lessonError || !lesson) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4 text-white">Aula não encontrada</h2>
        <Link href="/professor/dashboard" className="text-[#7D7AE8] hover:underline">
          &larr; Voltar para o Dashboard
        </Link>
      </div>
    );
  }

  // Buscar alunos matriculados na turma desta aula
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('students(id, name, student_code)')
    .eq('class_id', lesson.class_id)
    .eq('status', 'active');

  const students = (enrollments?.map(e => (Array.isArray(e.students) ? e.students[0] : e.students)).filter(Boolean) || []) as any[];

  // Fetch course modules
  const courseId = Array.isArray(lesson.classes?.courses) ? lesson.classes?.courses[0]?.id : lesson.classes?.courses?.id;
  
  const { data: courseModules } = await supabase
    .from('course_modules')
    .select('id, title')
    .eq('course_id', courseId || '')
    .order('order_index', { ascending: true });

  const isCompleted = lesson.status === 'completed';
  const initialSummary = lesson.lesson_records?.[0]?.summary || '';
  const currentModuleId = lesson.module_id || '';

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link href={`/professor/turmas/${lesson.class_id}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" />
        Voltar para Turma
      </Link>

      <div>
        <div className="flex items-center gap-3 text-sm text-[#7D7AE8] font-semibold mb-2 uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          {lesson.classes?.courses?.name} &bull; {lesson.classes?.name}
        </div>
        <h1 className="text-3xl font-black text-white mb-4">Diário de Classe</h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1.5 bg-[#A27AE8]/10 text-[#A27AE8] px-3 py-1.5 rounded-lg border border-[#A27AE8]/20">
            <CalendarIcon className="w-4 h-4" />
            {new Date(lesson.scheduled_start).toLocaleDateString('pt-BR')}
          </span>
          <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
            <Clock className="w-4 h-4" />
            {new Date(lesson.scheduled_start).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      <ClassDiaryForm 
        lessonId={lesson.id} 
        students={students} 
        isCompleted={isCompleted} 
        initialSummary={initialSummary} 
        modules={courseModules || []}
        currentModuleId={currentModuleId}
      />
    </div>
  );
}
