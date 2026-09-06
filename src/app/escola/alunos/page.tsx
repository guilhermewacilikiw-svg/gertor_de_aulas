import { Users, Search, Plus, Mail, Shield, UserSquare2, ChevronRight, Activity } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ImportStudentsModal } from './client-modal';
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
      <div className="relative w-full rounded-2xl bg-[#0a0a0a] border border-white/5 overflow-hidden shadow-2xl p-8 md:p-12">
        {/* Animated Background Spheres */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/20 rounded-full blur-[100px] animate-pulse mix-blend-screen translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-500/10 rounded-full blur-[80px] animate-pulse mix-blend-screen -translate-x-1/3 translate-y-1/3" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-[0_0_20px_rgba(125,122,232,0.15)] mb-6">
              <Users className="w-4 h-4 text-red-500" />
              <span className="text-xs font-black uppercase tracking-widest text-white/80">
                Comunidade
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-xl mb-4">
              Gestão de Alunos
            </h1>
            <p className="text-gray-400 max-w-xl text-lg">
              Gerencie matrículas, acompanhe o progresso e o engajamento de todos os seus alunos em um só lugar.
            </p>
          </div>
          
          <div className="shrink-0 flex items-center justify-center relative group">
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl group-hover:bg-red-500/30 transition-all duration-500"></div>
            <div className="relative bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-xl flex flex-col items-center justify-center min-w-[160px] shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <span className="text-5xl font-black text-white drop-shadow-md">
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
            className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all text-white font-medium placeholder:text-gray-600"
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
          <ImportStudentsModal />
          <Link 
            href="/escola/alunos/novo"
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 hover:scale-105 text-white font-black text-xs shadow-lg shadow-red-600/20 transition-all flex items-center gap-2 group"
          >
            <Plus className="w-4 h-4 stroke-[3] group-hover:rotate-90 transition-transform" />
            Novo Aluno
          </Link>
        </div>
      </div>

      {/* STUDENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students && students.length > 0 ? (
          (students as any[]).map((student) => (
            <Link 
              href={`/escola/alunos/${student.id}`} 
              key={student.id} 
              className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-6 flex flex-col shadow-lg hover:border-red-600/30 transition-all duration-300 group block"
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-600/30 flex items-center justify-center text-red-500 font-black text-xl shrink-0 group-hover:scale-105 transition-transform">
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg leading-tight group-hover:text-red-500 transition-colors line-clamp-1">{student.name}</h3>
                    <p className="text-xs text-gray-500 font-mono mt-1">ID: {student.student_code || student.id.substring(0, 8)}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                  student.status === 'active' 
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                  : 'bg-white/5 text-gray-400 border-white/10'
                }`}>
                  {student.status === 'active' ? 'Ativo' : 'Pendente'}
                </span>
              </div>

              <div className="space-y-3 mt-auto">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Dados de Aprendizado</div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-black/50 flex items-center justify-center text-gray-400">
                    <Shield className="w-4 h-4 text-red-500" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold text-gray-200 truncate">Nível {student.level || 1} • {student.xp_points || 0} XP</p>
                    <p className="text-xs text-gray-500 truncate">{student.email || 'Sem e-mail'}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full w-full flex flex-col items-center justify-center py-24 bg-gradient-to-b from-white/5 to-transparent rounded-2xl border border-white/5 border-dashed">
            <div className="w-24 h-24 bg-red-600/20 rounded-full flex items-center justify-center mb-6 animate-float shadow-[0_0_30px_rgba(125,122,232,0.3)]">
              <UserSquare2 className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Nenhum Aluno</h3>
            <p className="text-gray-400 max-w-md text-center text-sm mb-8">Sua escola ainda não possui alunos matriculados. Comece a criar sua comunidade!</p>
            <Link 
              href="/escola/alunos/novo"
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 hover:scale-105 text-white font-black text-xs shadow-lg shadow-red-600/20 transition-all flex items-center gap-2 group"
            >
              <Plus className="w-4 h-4 stroke-[3] group-hover:rotate-90 transition-transform" />
              Novo Aluno
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
