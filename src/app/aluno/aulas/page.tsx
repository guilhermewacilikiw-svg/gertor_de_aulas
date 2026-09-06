import { PlayCircle, BookOpen, Layers, ArrowRight, ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function MinhasAulasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: publicUser } = await supabase
    .from('users')
    .select('id')
    .eq('auth_user_id', user.id)
    .single();

  if (!publicUser) redirect('/login');

  const { data: studentRecord } = await supabase
    .from('students')
    .select('id, school_id')
    .eq('user_id', publicUser.id)
    .single();

  if (!studentRecord) redirect('/login');

  const studentId = studentRecord.id;
  const schoolId = studentRecord.school_id;

  // Fetch enrollments for the student
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select(`
      id,
      courses (
        id, name, description, category, level, cover_image,
        course_modules (id)
      )
    `)
    .eq('student_id', studentId)
    .eq('status', 'active');

  const enrolledCourses = enrollments?.map((e: any) => ({
    enrollmentId: e.id,
    id: e.courses.id,
    name: e.courses.name,
    description: e.courses.description || 'Sem descrição',
    category: e.courses.category || 'Geral',
    level: e.courses.level || 'Básico',
    modulesCount: e.courses.course_modules?.length || 0
  })) || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Padronizado */}
      <PageHeader
        badgeIcon={<BookOpen className="w-4 h-4" />}
        badgeText="Conteúdo Digital"
        title="Minhas Aulas"
        subtitle="Acesse seus cursos, assista aos vídeos complementares e baixe materiais de apoio."
      />

      {enrolledCourses.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="w-8 h-8" />}
          title="Nenhum curso encontrado"
          description="Você ainda não está matriculado em nenhum curso com material digital. Fale com a secretaria da escola."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => (
            <Link 
              href={`/aluno/aulas/${course.id}`} 
              key={course.id} 
              className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-6 flex flex-col shadow-lg hover:border-red-600/30 transition-all duration-300 group block"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-600/30 flex items-center justify-center text-red-500 shrink-0 group-hover:scale-105 transition-transform">
                    <PlayCircle className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg leading-tight group-hover:text-red-500 transition-colors line-clamp-1">{course.name}</h3>
                    <p className="text-xs text-gray-500 font-mono mt-1">{course.category} • {course.level}</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border bg-red-500/10 text-red-500 border-red-500/20">
                  {course.level}
                </span>
              </div>

              <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-6">
                {course.description}
              </p>

              <div className="space-y-3 mt-auto">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Acesso ao Material</div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-black/50 flex items-center justify-center text-gray-400">
                    <Layers className="w-4 h-4 text-red-500" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold text-gray-200 truncate">{course.modulesCount} Módulos Disponíveis</p>
                    <p className="text-xs text-gray-500 truncate">Vídeos, partituras e tarefas</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
}
