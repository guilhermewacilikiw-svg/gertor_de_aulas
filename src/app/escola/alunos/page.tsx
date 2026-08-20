import { Users, Search, Plus, Mail, Shield, UserSquare2, ChevronRight, Activity } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { InviteStudentModal } from './client-modal';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AlunosPage() {
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

  // Fetch real students from the database
  const { data: students, error: studentsError } = await supabase
    .from('students')
    .select('id, name, email, status, created_at')
    .eq('school_id', SCHOOL_ID)
    .order('created_at', { ascending: false });

  if (studentsError) {
    console.error('Error fetching students:', studentsError);
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER HERO */}
      <div className="relative w-full rounded-[2.5rem] bg-gradient-to-br from-[#12121A] to-[#0A0A0F] border border-white/5 overflow-hidden shadow-2xl p-8 md:p-12">
        {/* Animated Background Spheres */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#7D7AE8]/20 rounded-full blur-[100px] animate-pulse mix-blend-screen translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C0E87A]/10 rounded-full blur-[80px] animate-pulse mix-blend-screen -translate-x-1/3 translate-y-1/3" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-[0_0_20px_rgba(125,122,232,0.15)] mb-6">
              <Users className="w-4 h-4 text-[#C0E87A]" />
              <span className="text-xs font-black uppercase tracking-widest text-white/80">
                Comunidade
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/60 tracking-tight drop-shadow-xl mb-4">
              Gestão de Alunos
            </h1>
            <p className="text-gray-400 max-w-xl text-lg">
              Gerencie matrículas, acompanhe o progresso e o engajamento de todos os seus alunos em um só lugar.
            </p>
          </div>
          
          <div className="shrink-0 flex items-center justify-center relative group">
            <div className="absolute inset-0 bg-[#C0E87A]/20 rounded-full blur-2xl group-hover:bg-[#C0E87A]/30 transition-all duration-500"></div>
            <div className="relative bg-black/40 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl flex flex-col items-center justify-center min-w-[160px] shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#C0E87A] to-white drop-shadow-md">
                {students?.length || 0}
              </span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">Alunos Ativos</span>
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
            placeholder="Buscar aluno por nome..."
            className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-[#7D7AE8] focus:ring-1 focus:ring-[#7D7AE8] transition-all text-white font-medium placeholder:text-gray-600"
          />
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center bg-black/40 p-1.5 rounded-2xl border border-white/5">
            <button className="px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl bg-white/10 text-white shadow-sm transition-all">
              Todos
            </button>
            <button className="px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all">
              Inativos
            </button>
          </div>
          <InviteStudentModal />
        </div>
      </div>

      {/* STUDENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students && students.length > 0 ? (
          students.map((student) => (
            <Link href={`/escola/alunos/${student.id}`} key={student.id} className="group relative bg-[#0a0a0f] rounded-[2rem] border border-white/5 p-6 overflow-hidden hover:border-[#7D7AE8]/40 hover:shadow-[0_10px_40px_rgba(125,122,232,0.15)] transition-all duration-500 hover:-translate-y-1 block">
              
              <div className="absolute inset-0 bg-gradient-to-br from-[#7D7AE8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                {/* Header Card */}
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7D7AE8] to-[#C77AE8] p-[2px] shadow-[0_0_20px_rgba(125,122,232,0.3)] group-hover:scale-110 transition-transform duration-500">
                    <div className="w-full h-full bg-[#12121A] rounded-full flex items-center justify-center">
                      <span className="font-black text-2xl text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">
                        {student.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    student.status === 'active' 
                    ? 'bg-[#C0E87A]/10 text-[#C0E87A] border-[#C0E87A]/20' 
                    : 'bg-white/5 text-gray-500 border-white/10'
                  }`}>
                    {student.status === 'active' ? 'Ativo' : 'Pendente'}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-black text-white text-xl mb-1 group-hover:text-[#7D7AE8] transition-colors line-clamp-1">{student.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-2 mb-6">
                    <Mail className="w-3.5 h-3.5" />
                    <span className="truncate">{student.email || 'Não informado'}</span>
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="w-4 h-4 text-[#A27AE8]" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Nível</span>
                      </div>
                      <p className="font-black text-white">{student.level || 1}</p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="w-4 h-4 text-[#C0E87A]" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">XP Global</span>
                      </div>
                      <p className="font-black text-white">{student.xp_points || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                    Desde {new Date(student.created_at).toLocaleDateString('pt-BR')}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:bg-[#7D7AE8] group-hover:text-white group-hover:border-[#7D7AE8] transition-all duration-300">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full w-full flex flex-col items-center justify-center py-24 bg-gradient-to-b from-white/5 to-transparent rounded-[2.5rem] border border-white/5 border-dashed">
            <div className="w-24 h-24 bg-[#7D7AE8]/20 rounded-full flex items-center justify-center mb-6 animate-float shadow-[0_0_30px_rgba(125,122,232,0.3)]">
              <UserSquare2 className="w-10 h-10 text-[#A27AE8]" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Nenhum Aluno</h3>
            <p className="text-gray-400 max-w-md text-center text-sm mb-8">Sua escola ainda não possui alunos matriculados. Comece a criar sua comunidade!</p>
            <InviteStudentModal />
          </div>
        )}
      </div>
    </div>
  );
}
