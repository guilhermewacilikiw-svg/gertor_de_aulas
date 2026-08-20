'use client';

import { useState, useEffect } from 'react';
import { Users, Clock, ArrowRight, BookOpen, UserCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
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
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Minhas Turmas</h1>
        <p className="text-sm text-gray-400 mt-1">
          Acesse suas turmas para fazer o diário de classe e acompanhar os alunos.
        </p>
      </div>

      {/* Classes Grid */}
      {classes.length === 0 ? (
        <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-[#A27AE8]/10 rounded-full flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-[#A27AE8]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Nenhuma turma encontrada</h3>
          <p className="text-gray-400 max-w-md">
            Você ainda não foi alocado a nenhuma turma ativa. Fale com a secretaria da escola.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => {
            const courseName = cls.courses?.name || 'Curso não definido';
            const studentCount = cls.enrollments?.[0]?.count || 0;
            const schedules = cls.class_schedules || [];

            return (
              <Link href={`/professor/turmas/${cls.id}`} key={cls.id} className="group relative block">
                <div className="h-full bg-[#0f0f0f] border border-white/5 group-hover:border-[#7D7AE8]/50 rounded-3xl p-6 transition-all duration-300 flex flex-col shadow-lg">
                  
                  {/* Badge & Course */}
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#A27AE8]/20 text-[#A27AE8] border border-[#A27AE8]/30">
                      {cls.level || 'Todos os Níveis'}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#7D7AE8]/20 transition-colors">
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#7D7AE8] transition-colors" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-black text-white mb-1 group-hover:text-[#7D7AE8] transition-colors">
                    {cls.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-6 font-medium">
                    <BookOpen className="w-4 h-4" />
                    <span>{courseName}</span>
                  </div>

                  {/* Info Cards */}
                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <div className="bg-black/50 border border-white/5 rounded-xl p-3 flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                        <UserCircle2 className="w-3.5 h-3.5" />
                        Alunos
                      </div>
                      <span className="text-white font-bold">{studentCount} matrículas</span>
                    </div>

                    <div className="bg-black/50 border border-white/5 rounded-xl p-3 flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                        <Clock className="w-3.5 h-3.5" />
                        Aulas
                      </div>
                      <div className="text-white font-bold text-sm truncate">
                        {schedules.length > 0 ? (
                          schedules.map((s: any) => `${getDayName(s.day_of_week)} ${s.start_time?.substring(0,5)}`).join(', ')
                        ) : 'Sem horário'}
                      </div>
                    </div>
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
