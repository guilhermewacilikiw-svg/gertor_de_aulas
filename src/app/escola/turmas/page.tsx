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
      
      {/* HEADER HERO */}
      <div className="relative w-full rounded-[2.5rem] bg-gradient-to-br from-[#12121A] to-[#0A0A0F] border border-white/5 overflow-hidden shadow-2xl p-8 md:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#7D7AE8]/20 rounded-full blur-[100px] animate-pulse mix-blend-screen translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C77AE8]/20 rounded-full blur-[80px] animate-pulse mix-blend-screen -translate-x-1/3 translate-y-1/3" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-[0_0_20px_rgba(125,122,232,0.15)] mb-6">
              <Users className="w-4 h-4 text-[#7D7AE8]" />
              <span className="text-xs font-black uppercase tracking-widest text-white/80">
                Classes
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/60 tracking-tight drop-shadow-xl mb-4">
              Gestão de Turmas
            </h1>
            <p className="text-gray-400 max-w-xl text-lg">
              Organize os grupos, vincule professores e acompanhe o preenchimento de vagas.
            </p>
          </div>
          
          <div className="shrink-0 flex items-center justify-center relative group">
            <div className="absolute inset-0 bg-[#7D7AE8]/20 rounded-full blur-2xl group-hover:bg-[#7D7AE8]/30 transition-all duration-500"></div>
            <div className="relative bg-black/40 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl flex flex-col items-center justify-center min-w-[160px] shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#7D7AE8] to-white drop-shadow-md">
                {classes?.length || 0}
              </span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">Turmas</span>
            </div>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/5 border border-white/5 rounded-3xl p-4 backdrop-blur-sm shadow-lg">
        <div className="relative w-full sm:w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar turma ou curso..."
            className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-[#7D7AE8] focus:ring-1 focus:ring-[#7D7AE8] transition-all text-white font-medium placeholder:text-gray-600"
          />
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
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
