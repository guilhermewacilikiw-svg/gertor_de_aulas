import { BookOpen, Search, Plus, MoreVertical, Users, Layers, ArrowRight, ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

import Link from 'next/link';
import { getAuthenticatedSchool } from '@/lib/auth';

export default async function CursosPage() {
  const authContext = await getAuthenticatedSchool();
  if (!authContext) redirect('/login');

  const { schoolId: SCHOOL_ID } = authContext;
  const supabase = await createClient();

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
      <div className="relative w-full rounded-2xl bg-[#0a0a0a] border border-white/5 overflow-hidden shadow-2xl p-8 md:p-12 mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-[100px] animate-pulse mix-blend-screen translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-500/10 rounded-full blur-[80px] animate-pulse mix-blend-screen -translate-x-1/3 translate-y-1/3" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-[0_0_20px_rgba(229,9,20,0.15)] mb-6">
              <BookOpen className="w-4 h-4 text-red-500" />
              <span className="text-xs font-black uppercase tracking-widest text-white/80">
                Trilhas de Aprendizado
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-xl mb-4">
              Cursos & Grade Curricular
            </h1>
            <p className="text-gray-400 max-w-xl text-lg">
              Gerencie a estrutura pedagógica e monte os planos de aula por módulo.
            </p>
          </div>
          
          <div className="flex gap-4 flex-col sm:flex-row">
            <Link 
              href="/escola/cursos/novo"
              className="bg-red-500 text-black px-5 py-2.5 rounded-xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/25 flex items-center gap-2 group"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              Novo Curso
            </Link>
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
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/20"
          />
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courseList.map((course) => (
          <Link 
            href={`/escola/cursos/${course.id}`} 
            key={course.id} 
            className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-6 flex flex-col shadow-lg hover:border-red-600/30 transition-all duration-300 group block"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-600/30 flex items-center justify-center text-red-500 shrink-0 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-6 h-6 text-red-500" />
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
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Estrutura Curricular</div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-black/50 flex items-center justify-center text-gray-400">
                  <Layers className="w-4 h-4 text-red-500" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold text-gray-200 truncate">{course.modulesCount} Módulos Pedagógicos</p>
                  <p className="text-xs text-gray-500 truncate">Gerenciar aulas e materiais</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
