import { Search, Plus, ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/shared/PageHeader';
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
      
      <PageHeader
        title="Cursos e grade curricular"
        subtitle="Gerencie a estrutura pedagógica e monte os planos de aula por módulo."
        action={
          <Link
            href="/escola/cursos/novo"
            className="inline-flex items-center justify-center gap-2 px-4 min-h-11 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo curso
          </Link>
        }
      />

      <div className="relative w-full sm:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" aria-hidden="true" />
        <input
          type="text"
          aria-label="Buscar curso por nome ou categoria"
          placeholder="Buscar curso por nome ou categoria"
          className="w-full min-h-11 bg-white/[0.04] border border-white/10 rounded-lg pl-10 pr-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-red-500 transition-colors"
        />
      </div>

      <ul className="divide-y divide-white/5 border-t border-white/10">
        {courseList.map((course) => (
          <li key={course.id}>
            <Link
              href={`/escola/cursos/${course.id}`}
              className="flex items-center gap-4 py-4 px-2 -mx-2 rounded-lg hover:bg-white/[0.03] transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{course.name}</p>
                <p className="text-sm text-gray-400 truncate">
                  {course.category} · {course.level}
                  {course.description ? ` · ${course.description}` : ''}
                </p>
              </div>
              <span className="hidden sm:block text-sm text-gray-400 shrink-0">
                {course.modulesCount} {course.modulesCount === 1 ? 'módulo' : 'módulos'}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-500 shrink-0" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
