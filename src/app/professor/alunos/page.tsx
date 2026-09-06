'use client';

import { useState, useEffect } from 'react';
import { Users, Search, ChevronRight, BookOpen, UserCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import Link from 'next/link';

export default function ProfessorAlunosPage() {
  const [loading, setLoading] = useState(true);
  const [studentsData, setStudentsData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadStudents() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: publicUser } = await supabase
          .from('users')
          .select('id')
          .eq('auth_user_id', user.id)
          .single();

        if (publicUser) {
          const { data: teacherRecord } = await supabase
            .from('teachers')
            .select('id')
            .eq('user_id', publicUser.id)
            .single();

          if (teacherRecord) {
            // Get enrollments that belong to classes this teacher teaches
            const { data: enrollments } = await supabase
              .from('enrollments')
              .select(`
                students ( id, name, student_code, email, phone ),
                classes!inner ( id, name, courses(name) )
              `)
              .eq('classes.teacher_id', teacherRecord.id)
              .eq('status', 'active');

            if (enrollments) {
              // Group by student
              const studentMap = new Map();
              enrollments.forEach((e: any) => {
                const s = Array.isArray(e.students) ? e.students[0] : e.students;
                const c = Array.isArray(e.classes) ? e.classes[0] : e.classes;
                
                if (s && c) {
                  if (!studentMap.has(s.id)) {
                    studentMap.set(s.id, {
                      ...s,
                      enrolledClasses: []
                    });
                  }
                  const studentInfo = studentMap.get(s.id);
                  if (!studentInfo.enrolledClasses.find((cls: any) => cls.id === c.id)) {
                    studentInfo.enrolledClasses.push(c);
                  }
                }
              });

              setStudentsData(Array.from(studentMap.values()));
            }
          }
        }
      }
      setLoading(false);
    }

    loadStudents();
  }, []);

  const filteredStudents = studentsData.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.student_code && s.student_code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      <PageHeader
        badgeIcon={<Users className="w-4 h-4" />}
        badgeText="Alunos"
        title="Meus Alunos"
        subtitle="Visão geral de todos os alunos matriculados nas suas turmas ativas."
        action={
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Buscar aluno por nome ou ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#0e0e14] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all placeholder:text-gray-600"
            />
          </div>
        }
      />

      {loading ? (
        <div className="p-12 text-center text-gray-400">Carregando lista de alunos...</div>
      ) : filteredStudents.length === 0 ? (
        <EmptyState
          icon={<UserCircle2 className="w-8 h-8" />}
          title="Nenhum aluno encontrado"
          description="Você ainda não possui alunos matriculados nas suas turmas ativas ou a busca não retornou resultados."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <div key={student.id} className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-6 flex flex-col shadow-lg hover:border-red-600/30 transition-colors group">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-600/30 flex items-center justify-center text-red-500 font-black text-xl shrink-0 group-hover:scale-105 transition-transform">
                  {student.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg leading-tight group-hover:text-red-500 transition-colors">{student.name}</h3>
                  <p className="text-xs text-gray-500 font-mono mt-1">ID: {student.student_code || 'N/A'}</p>
                </div>
              </div>

              <div className="space-y-3 mt-auto">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Turmas Matriculadas</div>
                {student.enrolledClasses.map((cls: any) => (
                  <Link href={`/professor/turmas/${cls.id}`} key={cls.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-black/50 flex items-center justify-center text-gray-400">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-bold text-gray-200 truncate">{cls.name}</p>
                      <p className="text-xs text-gray-500 truncate">{cls.courses?.name}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
