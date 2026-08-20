'use client';

import { useState, useEffect } from 'react';
import { Star, Plus, Users, Search, TrendingUp, ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function ProfessorAvaliacoesPage() {
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    async function loadClassesAndStats() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: publicUser } = await supabase.from('users').select('id').eq('auth_user_id', user.id).single();
        if (publicUser) {
          const { data: teacherRecord } = await supabase.from('teachers').select('id').eq('user_id', publicUser.id).single();
          if (teacherRecord) {
            // Get classes with count of students
            const { data: dbClasses } = await supabase
              .from('classes')
              .select('id, name, courses(name), enrollments(count)')
              .eq('teacher_id', teacherRecord.id)
              .eq('status', 'active');
              
            if (dbClasses) {
              setClasses(dbClasses);
            }
          }
        }
      }
      setLoading(false);
    }
    loadClassesAndStats();
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Avaliações</h1>
          <p className="text-sm text-gray-400 mt-1">
            Lance as avaliações mensais para os alunos das suas turmas.
          </p>
        </div>
      </div>

      <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-8 shadow-lg">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-white">Selecione uma Turma</h2>
            <p className="text-sm text-gray-400">Para lançar as notas ou porcentagens de evolução.</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-12">Carregando turmas...</div>
        ) : classes.length === 0 ? (
          <div className="text-center text-gray-400 py-12">Nenhuma turma encontrada.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map(cls => {
              const studentsCount = cls.enrollments?.[0]?.count || 0;
              return (
                <Link href={`/professor/avaliacoes/lancar?classId=${cls.id}`} key={cls.id} className="group relative block">
                  <div className="bg-black/50 border border-white/5 rounded-2xl p-6 hover:border-[#E5E87A]/50 transition-all shadow-lg flex flex-col h-full">
                    
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[#E5E87A]/10 flex items-center justify-center group-hover:bg-[#E5E87A]/20 transition-colors">
                        <Star className="w-5 h-5 text-[#E5E87A]" />
                      </div>
                      <span className="text-xs font-bold bg-white/5 px-3 py-1 rounded-full text-gray-400 border border-white/10 group-hover:text-white transition-colors">
                        {studentsCount} Alunos
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-lg leading-tight mb-1 group-hover:text-[#E5E87A] transition-colors">{cls.name}</h3>
                    <p className="text-sm text-gray-500 font-medium mb-6">{cls.courses?.name}</p>

                    <div className="mt-auto flex items-center justify-between text-[#E5E87A] font-bold text-sm">
                      <span>Lançar Notas</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
