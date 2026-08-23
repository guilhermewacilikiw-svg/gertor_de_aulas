import { BookOpen, Search, Plus, MoreVertical, Users, Layers, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CreateCourseModal } from './client-modal';
import Link from 'next/link';

export default async function CursosPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();

  let SCHOOL_ID = '11111111-1111-1111-1111-111111111111';

  if (user) {
    const { data: publicUser } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    if (publicUser) {
      const { data: membership } = await supabase
        .from('school_memberships')
        .select('school_id')
        .eq('user_id', publicUser.id)
        .maybeSingle();

      if (membership) {
        SCHOOL_ID = membership.school_id;
      }
    }
  }

  // Fetch real courses from the database
  const { data: dbCourses } = await supabase
    .from('courses')
    .select('id, name, description, created_at, category, level, course_modules(id)')
    .eq('school_id', SCHOOL_ID)
    .order('created_at', { ascending: false });

  const fallbackCourses = [
    {
      id: '10000000-0000-0000-0000-300000000001',
      name: 'Violão Básico',
      description: 'Curso prático para iniciantes aprenderem postura, acordes, ritmos e primeiras músicas.',
      category: 'Música',
      level: 'Iniciante',
      modulesCount: 3
    }
  ];

  const courseList = (dbCourses && dbCourses.length > 0)
    ? dbCourses.map(c => ({
        id: c.id,
        name: c.name,
        description: c.description || 'Nenhuma descrição fornecida para este curso.',
        category: c.category || 'Música',
        level: c.level || 'Iniciante',
        modulesCount: c.course_modules?.length || 0
      }))
    : fallbackCourses;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER HERO */}
      <div className="relative w-full rounded-[2.5rem] bg-gradient-to-br from-[#12121A] to-[#0A0A0F] border border-white/5 overflow-hidden shadow-2xl p-8 md:p-12 mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#8B5CF6]/20 rounded-full blur-[100px] animate-pulse mix-blend-screen translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#7C3AED]/20 rounded-full blur-[80px] animate-pulse mix-blend-screen -translate-x-1/3 translate-y-1/3" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-[0_0_20px_rgba(139,92,246,0.15)] mb-6">
              <BookOpen className="w-4 h-4 text-[#8B5CF6]" />
              <span className="text-xs font-black uppercase tracking-widest text-white/80">
                Trilhas de Aprendizado
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/60 tracking-tight drop-shadow-xl mb-4">
              Cursos & Grade Curricular
            </h1>
            <p className="text-gray-400 max-w-xl text-lg">
              Gerencie a estrutura pedagógica e monte os planos de aula por módulo.
            </p>
          </div>
          
          <div className="flex gap-4 flex-col sm:flex-row">
            <CreateCourseModal />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-neutral-900/30 border border-neutral-800 p-4 rounded-3xl border border-white/10 flex items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar curso por nome ou categoria..."
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courseList.map((course) => (
          <div
            key={course.id}
            className="bg-neutral-900/30 border border-neutral-800 rounded-3xl overflow-hidden border border-white/10 shadow-xl group hover:border-cyan-500/50 transition-all flex flex-col justify-between"
          >
            {/* Header Banner */}
            <div className="h-32 bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500 p-5 relative flex flex-col justify-between overflow-hidden">
              <BookOpen className="w-24 h-24 text-white/10 absolute -right-4 -bottom-4 rotate-12" />
              
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
                    <Layers className="w-4 h-4 text-cyan-400" /> Planos / Módulos
                  </span>
                  <span className="font-bold text-white">{course.modulesCount} Módulos</span>
                </div>
              </div>

              <Link
                href={`/escola/cursos/${course.id}`}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 hover:brightness-110 text-white font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95"
              >
                <span>GERENCIAR CURSO & PLANOS DE AULA</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
