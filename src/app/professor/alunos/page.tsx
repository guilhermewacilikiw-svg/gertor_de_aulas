'use client';

import { useState, useEffect } from 'react';
import { Users, Search, ChevronRight, BookOpen, UserCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
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
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Meus Alunos</h1>
          <p className="text-sm text-gray-400 mt-1">
            Visão geral de todos os alunos matriculados nas suas turmas.
          </p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Buscar aluno por nome ou ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0f0f0f] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7D7AE8] focus:ring-1 focus:ring-[#7D7AE8] transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-400">Carregando lista de alunos...</div>
      ) : filteredStudents.length === 0 ? (
        <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-12 flex flex-col items-center justify-center text-center shadow-lg">
          <div className="w-16 h-16 bg-[#A27AE8]/10 rounded-full flex items-center justify-center mb-4">
            <UserCircle2 className="w-8 h-8 text-[#A27AE8]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Nenhum aluno encontrado</h3>
          <p className="text-gray-400 max-w-md">
            Você ainda não possui alunos matriculados nas suas turmas ativas ou a busca não retornou resultados.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <div key={student.id} className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-6 flex flex-col shadow-lg hover:border-[#7D7AE8]/30 transition-colors group">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#7D7AE8]/20 border border-[#7D7AE8]/30 flex items-center justify-center text-[#7D7AE8] font-black text-xl shrink-0 group-hover:scale-105 transition-transform">
                  {student.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg leading-tight group-hover:text-[#7D7AE8] transition-colors">{student.name}</h3>
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
