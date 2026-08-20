import { createClient } from '@/lib/supabase/server';
import { Search, MoreVertical, Users } from 'lucide-react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CreateClassModal } from './client-modal';

export default async function TurmasPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: publicUser } = await supabase
    .from('users')
    .select('id')
    .eq('auth_user_id', user.id)
    .single();

  if (!publicUser) redirect('/login');

  const { data: membership } = await supabase
    .from('school_memberships')
    .select('school_id')
    .eq('user_id', publicUser.id)
    .single();

  const SCHOOL_ID = membership?.school_id;
  if (!SCHOOL_ID) redirect('/login');

  // Buscando turmas
  const { data: classes, error } = await supabase
    .from('classes')
    .select('*, courses(name), teachers(users(name)), enrollments(id)')
    .eq('school_id', SCHOOL_ID)
    .order('name', { ascending: true });

  // Buscando cursos e professores para o formulário
  const { data: courses } = await supabase
    .from('courses')
    .select('id, name')
    .eq('school_id', SCHOOL_ID)
    .order('name', { ascending: true });

  const { data: teachers } = await supabase
    .from('teachers')
    .select('id, specialty, users(name)')
    .eq('school_id', SCHOOL_ID);

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Gestão de Turmas</h1>
          <p className="text-sm text-gray-400 mt-1">
            Organize os grupos, vincule professores e acompanhe o preenchimento de vagas.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Buscar turma ou curso..." 
              className="w-full pl-10 pr-4 py-2.5 bg-[#0f0f0f] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7D7AE8] focus:ring-1 focus:ring-[#7D7AE8] transition-all"
            />
          </div>
          <CreateClassModal courses={courses || []} teachers={teachers || []} />
        </div>
      </div>

      <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-[10px] text-gray-500 uppercase tracking-wider bg-white/5 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-black">Turma / Curso</th>
                <th className="px-6 py-4 font-black">Professor Responsável</th>
                <th className="px-6 py-4 font-black">Vagas</th>
                <th className="px-6 py-4 font-black">Status</th>
                <th className="px-6 py-4 text-right font-black">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {error && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-red-400 font-bold bg-red-500/10">
                    Erro ao carregar turmas. {error.message}
                  </td>
                </tr>
              )}
              {classes?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">
                    <div className="flex flex-col items-center gap-3">
                      <Users className="w-8 h-8 text-white/10" />
                      Nenhuma turma encontrada.
                    </div>
                  </td>
                </tr>
              )}
              {classes?.map((turma: any) => {
                const teacherObj = Array.isArray(turma.teachers) ? turma.teachers[0] : turma.teachers;
                const teacherName = teacherObj?.users?.name;
                const enrolledCount = turma.enrollments ? (Array.isArray(turma.enrollments) ? turma.enrollments.length : turma.enrollments.count || 0) : 0;
                
                return (
                <tr key={turma.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-5">
                    <p className="font-bold text-white text-base leading-tight group-hover:text-[#7D7AE8] transition-colors">{turma.name}</p>
                    <p className="text-xs text-gray-500 mt-1 font-medium">{turma.courses?.name || 'Curso não vinculado'}</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#7D7AE8]/20 border border-[#7D7AE8]/30 text-[#7D7AE8] flex items-center justify-center font-black text-xs">
                        {teacherName?.charAt(0) || '-'}
                      </div>
                      <span className="text-gray-300 font-medium">{teacherName || 'Não atribuído'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-gray-400 bg-black/50 w-fit px-3 py-1.5 rounded-lg border border-white/5">
                      <Users className="w-4 h-4 text-[#C77AE8]" />
                      <span className="font-bold text-gray-300">{enrolledCount} / {turma.capacity || 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider border ${
                      turma.status === 'active' 
                        ? 'bg-[#C0E87A]/10 text-[#C0E87A] border-[#C0E87A]/20' 
                        : 'bg-white/5 text-gray-500 border-white/10'
                    }`}>
                      {turma.status === 'active' ? 'Ativa' : 'Inativa'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Link href={`/escola/turmas/${turma.id}`} className="p-2 text-[#7D7AE8] font-bold text-xs hover:bg-[#7D7AE8]/10 hover:text-white rounded-xl transition-all inline-block border border-[#7D7AE8]/30">
                      Gerenciar
                    </Link>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
