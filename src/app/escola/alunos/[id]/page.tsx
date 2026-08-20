import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ArrowLeft, Mail, Shield, Activity, Calendar, Book, GraduationCap, Users } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AlunoProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

  const { data: student, error } = await supabase
    .from('students')
    .select('*, enrollments(*, courses(name), classes(name))')
    .eq('id', id)
    .eq('school_id', SCHOOL_ID)
    .single();

  if (!student || error) {
    redirect('/escola/alunos');
  }

  const enrollments = Array.isArray(student.enrollments) ? student.enrollments : (student.enrollments ? [student.enrollments] : []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <Link href="/escola/alunos" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-bold uppercase tracking-wider">Voltar para Alunos</span>
      </Link>

      {/* Profile Header */}
      <div className="relative w-full rounded-[2.5rem] bg-gradient-to-br from-[#12121A] to-[#0A0A0F] border border-white/5 overflow-hidden shadow-2xl p-8 md:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#7D7AE8]/20 rounded-full blur-[100px] animate-pulse mix-blend-screen translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C0E87A]/10 rounded-full blur-[80px] animate-pulse mix-blend-screen -translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#7D7AE8] to-[#C77AE8] p-1 shadow-[0_0_30px_rgba(125,122,232,0.3)] shrink-0">
            <div className="w-full h-full bg-[#12121A] rounded-full flex items-center justify-center">
              <span className="font-black text-5xl text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">
                {student.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/5 backdrop-blur-md rounded-full border border-white/10 mb-4">
              <span className={`w-2 h-2 rounded-full animate-ping ${student.status === 'active' ? 'bg-[#C0E87A]' : 'bg-red-400'}`}></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/80">
                {student.status === 'active' ? 'Aluno Ativo' : 'Aluno Pendente'}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md mb-2">
              {student.name}
            </h1>
            
            <p className="text-gray-400 text-lg flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4" />
              {student.email || 'E-mail não informado'}
            </p>
          </div>

          <div className="shrink-0 flex gap-4">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center min-w-[100px]">
              <Shield className="w-6 h-6 text-[#A27AE8] mx-auto mb-2" />
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Nível</p>
              <p className="text-2xl font-black text-white">{student.level || 1}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center min-w-[100px]">
              <Activity className="w-6 h-6 text-[#C0E87A] mx-auto mb-2" />
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">XP</p>
              <p className="text-2xl font-black text-white">{student.xp_points || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollments Section */}
      <div className="bg-white/5 border border-white/5 rounded-3xl p-8 backdrop-blur-sm shadow-lg">
        <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
          <Book className="w-6 h-6 text-[#7D7AE8]" />
          Matrículas Ativas
        </h2>

        {enrollments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-black/20 rounded-2xl border border-white/5 border-dashed">
            <GraduationCap className="w-12 h-12 text-gray-600 mb-4" />
            <p className="text-gray-400 font-bold">Este aluno ainda não está matriculado em nenhum curso ou turma.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrollments.map((enr: any) => (
              <div key={enr.id} className="bg-[#1A1A24] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-[#7D7AE8]/50 transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#7D7AE8]/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#7D7AE8]/20 transition-all duration-500"></div>
                
                <div className="relative z-10 flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-[#E5E87A] uppercase tracking-widest mb-1 block">Curso</span>
                    <h3 className="font-black text-white text-xl">{enr.courses?.name || 'Curso Desconhecido'}</h3>
                  </div>
                  <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-[#C0E87A]/10 text-[#C0E87A] border border-[#C0E87A]/20">
                    {enr.status === 'active' ? 'Cursando' : 'Inativo'}
                  </span>
                </div>

                <div className="space-y-3 relative z-10">
                  <div className="flex items-center gap-3 bg-black/40 p-3 rounded-xl border border-white/5">
                    <Users className="w-4 h-4 text-[#7D7AE8]" />
                    <span className="text-sm font-bold text-gray-300">
                      Turma: <span className="text-white">{enr.classes?.name || 'Apenas EAD (Sem Turma)'}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-black/40 p-3 rounded-xl border border-white/5">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-bold text-gray-300">
                      Início: <span className="text-white">{new Date(enr.start_date).toLocaleDateString('pt-BR')}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
