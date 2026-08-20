import { PlayCircle, BookOpen, Layers, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

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
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Minhas Aulas</h1>
        <p className="text-sm text-gray-400 mt-1">Acesse seus cursos, assista aos vídeos complementares e materiais de apoio.</p>
      </div>

      {enrolledCourses.length === 0 ? (
        <div className="bg-neutral-900/30 border border-neutral-800 rounded-3xl p-12 flex flex-col items-center justify-center text-center shadow-soft">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-white">Nenhum curso encontrado</h3>
          <p className="text-gray-400 max-w-md">
            Você ainda não está matriculado em nenhum curso com material digital. Fale com a secretaria da escola.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => (
            <div
              key={course.id}
              className="bg-neutral-900/30 border border-neutral-800 rounded-3xl overflow-hidden shadow-xl group hover:border-cyan-500/50 transition-all flex flex-col justify-between"
            >
              {/* Header Banner */}
              <div className="h-32 bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500 p-5 relative flex flex-col justify-between overflow-hidden">
                <PlayCircle className="w-24 h-24 text-white/10 absolute -right-4 -bottom-4 rotate-12 group-hover:scale-110 transition-transform duration-500" />
                
                <span className="self-start text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/40 text-cyan-300 backdrop-blur-md border border-white/10">
                  {course.category} • {course.level}
                </span>

                <h3 className="text-xl font-black text-white relative z-10 drop-shadow-md line-clamp-1">
                  {course.name}
                </h3>
              </div>

              <div className="p-6 space-y-6 flex-1 flex flex-col justify-between">
                <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                  {course.description}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs p-3 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-gray-400 flex items-center gap-1.5 font-medium">
                      <Layers className="w-4 h-4 text-cyan-400" /> Conteúdo Digital
                    </span>
                    <span className="font-bold text-white">{course.modulesCount} Módulos</span>
                  </div>
                </div>

                <Link
                  href={`/aluno/aulas/${course.id}`}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 hover:brightness-110 text-white font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95"
                >
                  <PlayCircle className="w-4 h-4 fill-white" />
                  <span>ACESSAR MATERIAL</span>
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
