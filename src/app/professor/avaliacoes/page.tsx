'use client';

import { useState, useEffect } from 'react';
import { Star, Plus, Users, Search, TrendingUp, ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

import { PageHeader } from '@/components/shared/PageHeader';
import { Award, BookOpen } from 'lucide-react';

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
      
      <PageHeader
        badgeIcon={<Award className="w-4 h-4" />}
        badgeText="Painel Pedagógico"
        title="Avaliações & Critérios"
        subtitle="Lance notas de 0 a 10, gerencie atividades didáticas e destaque critérios principais para suas turmas."
      />

      <div className="bg-[#0e0e14] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl font-bold text-white">Selecione uma Turma</h2>
            <p className="text-sm text-gray-400">Escolha a turma para configurar atividades e lançar as notas de 0 a 10.</p>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 self-start sm:self-auto">
            Critérios & Destaques Ativos
          </span>
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
                  <div className="bg-black/40 border border-white/5 rounded-2xl p-6 hover:border-red-500/40 hover:shadow-[0_0_25px_rgba(239,68,68,0.15)] transition-all shadow-lg flex flex-col h-full">
                    
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-red-500 flex items-center justify-center text-white shadow-md shadow-red-600/20 group-hover:scale-105 transition-transform">
                        <Star className="w-6 h-6 fill-white/20" />
                      </div>
                      <span className="text-xs font-bold bg-white/5 px-3 py-1 rounded-full text-gray-400 border border-white/10 group-hover:text-white transition-colors">
                        {studentsCount} Alunos
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-lg leading-tight mb-1 group-hover:text-red-400 transition-colors">
                      {cls.name}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium mb-6 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-gray-600" />
                      <span>{cls.courses?.name || 'Curso'}</span>
                    </p>

                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-white font-bold text-sm">
                      <span className="text-red-400 group-hover:translate-x-0.5 transition-transform">Lançar Notas (0 a 10)</span>
                      <ChevronRight className="w-4 h-4 text-red-500 group-hover:translate-x-1 transition-transform" />
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
