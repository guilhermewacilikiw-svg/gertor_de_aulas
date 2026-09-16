import { createClient } from '@/lib/supabase/server';
import { Search, Plus, BookOpen, Star, Mail, ChevronRight, GraduationCap } from 'lucide-react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAuthenticatedSchool } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function ProfessoresPage() {
  const authContext = await getAuthenticatedSchool();
  if (!authContext) redirect('/login');

  const { schoolId: SCHOOL_ID } = authContext;
  const supabase = await createClient();

  const { data: teachers, error } = await supabase
    .from('teachers')
    .select('*, users (name, email)')
    .eq('school_id', SCHOOL_ID)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER HERO */}
      <div className="relative w-full rounded-2xl bg-[#0a0a0a] border border-white/5 overflow-hidden shadow-2xl p-8 md:p-12">
        {/* Animated Background Spheres */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-[100px] animate-pulse mix-blend-screen translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-600/20 rounded-full blur-[80px] animate-pulse mix-blend-screen -translate-x-1/3 translate-y-1/3" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-[0_0_20px_rgba(229,232,122,0.15)] mb-6">
              <Star className="w-4 h-4 text-white" />
              <span className="text-xs font-black uppercase tracking-widest text-white/80">
                Corpo Docente
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-xl mb-4">
              Professores
            </h1>
            <p className="text-gray-400 max-w-xl text-lg">
              Gerencie a equipe de professores, suas especialidades e turmas vinculadas.
            </p>
          </div>
          
          <div className="shrink-0 flex items-center justify-center relative group">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl group-hover:bg-white/30 transition-all duration-500"></div>
            <div className="relative bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-xl flex flex-col items-center justify-center min-w-[160px] shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white drop-shadow-md">
                {teachers?.length || 0}
              </span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">Ativos</span>
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
            placeholder="Buscar professor por nome..."
            className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-white font-medium placeholder:text-gray-600"
          />
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Link 
            href="/escola/professores/novo"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Novo Professor
          </Link>
        </div>
      </div>

      {/* TEACHERS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers && teachers.length > 0 ? (
          teachers.map((teacher) => {
            const userName = teacher.users?.name || 'Professor Sem Nome';
            const userEmail = teacher.users?.email || 'Sem email';
            return (
              <Link 
                href={`/escola/professores/${teacher.id}`} 
                key={teacher.id} 
                className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-6 flex flex-col shadow-lg hover:border-red-600/30 transition-all duration-300 group block"
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-600/30 flex items-center justify-center text-red-500 font-black text-xl shrink-0 group-hover:scale-105 transition-transform">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg leading-tight group-hover:text-red-500 transition-colors line-clamp-1">{userName}</h3>
                      <p className="text-xs text-gray-500 font-mono mt-1">Especialidade: {teacher.specialty || 'Geral'}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                    Docente
                  </span>
                </div>

                <div className="space-y-3 mt-auto">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Contato & Disciplina</div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors border border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-black/50 flex items-center justify-center text-gray-400">
                      <BookOpen className="w-4 h-4 text-red-500" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-bold text-gray-200 truncate">{teacher.specialty || 'Música Geral'}</p>
                      <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="col-span-full w-full flex flex-col items-center justify-center py-24 bg-gradient-to-b from-white/5 to-transparent rounded-2xl border border-white/5 border-dashed">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6 animate-float shadow-[0_0_30px_rgba(229,232,122,0.3)]">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Nenhum Professor</h3>
            <p className="text-gray-400 max-w-md text-center text-sm mb-8">Sua escola ainda não possui professores cadastrados. Adicione o primeiro membro da sua equipe docente!</p>
            <Link 
              href="/escola/professores/novo"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Novo Professor
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
