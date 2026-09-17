import { createClient } from '@/lib/supabase/server';
import { Users } from 'lucide-react';
import { redirect } from 'next/navigation';
import { getAuthenticatedSchool } from '@/lib/auth';
import { TurmasGrid } from './turmas-grid';

export const dynamic = 'force-dynamic';

export default async function TurmasPage() {
  const authContext = await getAuthenticatedSchool();
  if (!authContext) redirect('/login');

  const { schoolId: SCHOOL_ID } = authContext;
  const supabase = await createClient();

  // Buscar turmas com cursos, professores e contagem de matrículas
  const { data: classes } = await supabase
    .from('classes')
    .select('*, courses(name), teachers(users(name)), enrollments(id)')
    .eq('school_id', SCHOOL_ID)
    .order('name', { ascending: true });

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* HEADER HERO PADRONIZADO */}
      <div className="relative w-full rounded-2xl bg-[#0a0a0a] border border-white/5 overflow-hidden shadow-2xl p-8 md:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/20 rounded-full blur-[100px] animate-pulse mix-blend-screen translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-700/20 rounded-full blur-[80px] animate-pulse mix-blend-screen -translate-x-1/3 translate-y-1/3" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-[0_0_20px_rgba(220,38,38,0.15)] mb-6">
              <Users className="w-4 h-4 text-red-500" />
              <span className="text-xs font-black uppercase tracking-widest text-white/80">
                Turmas & Classes
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-xl mb-4">
              Gestão de Turmas
            </h1>
            <p className="text-gray-400 max-w-xl text-lg">
              Organize os grupos, vincule professores e acompanhe o preenchimento de vagas.
            </p>
          </div>
          
          <div className="shrink-0 flex items-center justify-center relative group">
            <div className="absolute inset-0 bg-red-600/20 rounded-full blur-2xl group-hover:bg-red-600/30 transition-all duration-500"></div>
            <div className="relative bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-xl flex flex-col items-center justify-center min-w-[160px] shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <span className="text-5xl font-black text-white drop-shadow-md">
                {classes?.length || 0}
              </span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">Turmas</span>
            </div>
          </div>
        </div>
      </div>

      {/* GRID DE CARDS COM BARRA DE BUSCA EM TEMPO REAL */}
      <TurmasGrid initialClasses={classes || []} />

    </div>
  );
}
