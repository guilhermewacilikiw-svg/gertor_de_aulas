'use client';

import { useState, useEffect } from 'react';
import { Users, Clock, ArrowRight, BookOpen, UserCircle2, ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import Link from 'next/link';

export default function ProfessorTurmasPage() {
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    async function loadClasses() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // 1. Get public user ID
        const { data: publicUser } = await supabase
          .from('users')
          .select('id')
          .eq('auth_user_id', user.id)
          .single();

        if (publicUser) {
          // 2. Get teacher ID
          const { data: teacherRecord } = await supabase
            .from('teachers')
            .select('id, school_id')
            .eq('user_id', publicUser.id)
            .single();

          if (teacherRecord) {
            // 3. Get classes for this teacher
            const { data: dbClasses } = await supabase
              .from('classes')
              .select(`
                id, 
                name, 
                level,
                courses ( name ),
                enrollments ( count ),
                class_schedules ( day_of_week, start_time )
              `)
              .eq('teacher_id', teacherRecord.id)
              .eq('school_id', teacherRecord.school_id)
              .eq('status', 'active');

            if (dbClasses) {
              setClasses(dbClasses);
            }
          }
        }
      }
      
      // Fallback/Mock data if none found just to show the layout working
      setLoading(false);
    }

    loadClasses();
  }, []);

  const getDayName = (day: number) => {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[day] || '';
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Carregando turmas...</div>;
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Padronizado */}
      <PageHeader
        badgeIcon={<Users className="w-4 h-4" />}
        badgeText="Pedagógico"
        title="Minhas Turmas"
        subtitle="Acesse suas turmas para fazer o diário de classe e acompanhar a frequência dos alunos."
      />

      {/* Classes Grid */}
      {classes.length === 0 ? (
        <EmptyState
          icon={<Users className="w-8 h-8" />}
          title="Nenhuma turma encontrada"
          description="Você ainda não foi alocado a nenhuma turma ativa. Fale com a coordenação da escola para vincular seus horários."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => {
            const courseName = cls.courses?.name || 'Curso não definido';
            const studentCount = cls.enrollments?.[0]?.count || 0;
            const schedules = cls.class_schedules || [];

            return (
              <Link 
                href={`/professor/turmas/${cls.id}`} 
                key={cls.id} 
                className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-6 flex flex-col shadow-lg hover:border-red-600/30 transition-all duration-300 group block"
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-600/30 flex items-center justify-center text-red-500 font-black text-xl shrink-0 group-hover:scale-105 transition-transform">
                      {cls.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg leading-tight group-hover:text-red-500 transition-colors line-clamp-1">{cls.name}</h3>
                      <p className="text-xs text-gray-500 font-mono mt-1">{courseName}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border bg-red-500/10 text-red-500 border-red-500/20">
                    {cls.level || 'Geral'}
                  </span>
                </div>

                <div className="space-y-3 mt-auto">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Horário & Frequência</div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors border border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-black/50 flex items-center justify-center text-gray-400">
                      <Clock className="w-4 h-4 text-red-500" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-bold text-gray-200 truncate">
                        {schedules.length > 0 ? (
                          schedules.map((s: any) => `${getDayName(s.day_of_week)} ${s.start_time?.substring(0,5)}`).join(', ')
                        ) : 'Sem horário definido'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{studentCount} alunos matriculados</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
