import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ArrowLeft, Mail, BookOpen, Users, GraduationCap, MapPin, Clock, Star } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const DAYS_OF_WEEK = [
  'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
];

export default async function ProfessorProfilePage({ params }: { params: Promise<{ id: string }> }) {
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

  // Fetch Teacher data along with their user info
  const { data: teacher, error } = await supabase
    .from('teachers')
    .select('*, users(name, email)')
    .eq('id', id)
    .eq('school_id', SCHOOL_ID)
    .single();

  if (!teacher || error) {
    redirect('/escola/professores');
  }

  // Fetch Classes assigned to this teacher
  const { data: classes } = await supabase
    .from('classes')
    .select('*, courses(name), class_schedules(*), enrollments(id)')
    .eq('teacher_id', teacher.id)
    .eq('school_id', SCHOOL_ID)
    .order('name');

  const userName = teacher.users?.name || 'Professor';

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <Link href="/escola/professores" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-bold uppercase tracking-wider">Voltar para Professores</span>
      </Link>

      {/* Profile Header */}
      <div className="relative w-full rounded-[2.5rem] bg-gradient-to-br from-[#12121A] to-[#0A0A0F] border border-white/5 overflow-hidden shadow-2xl p-8 md:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E5E87A]/20 rounded-full blur-[100px] animate-pulse mix-blend-screen translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#7D7AE8]/10 rounded-full blur-[80px] animate-pulse mix-blend-screen -translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#E5E87A] to-amber-200 p-1 shadow-[0_0_30px_rgba(229,232,122,0.3)] shrink-0">
            <div className="w-full h-full bg-[#12121A] rounded-full flex items-center justify-center">
              <span className="font-black text-5xl text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/5 backdrop-blur-md rounded-full border border-white/10 mb-4">
              <Star className="w-4 h-4 text-[#E5E87A]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/80">
                Professor Titular
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md mb-2">
              {userName}
            </h1>
            
            <p className="text-gray-400 text-lg flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4" />
              {teacher.users?.email || 'E-mail não informado'}
            </p>
          </div>

          <div className="shrink-0 flex flex-col gap-4">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 min-w-[140px] flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-[#7D7AE8]" />
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Especialidade</p>
                <p className="font-bold text-white text-sm">{teacher.specialty || 'Geral'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Classes Section */}
      <div className="bg-white/5 border border-white/5 rounded-3xl p-8 backdrop-blur-sm shadow-lg">
        <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
          <GraduationCap className="w-6 h-6 text-[#E5E87A]" />
          Turmas Atribuídas
        </h2>

        {!classes || classes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-black/20 rounded-2xl border border-white/5 border-dashed">
            <Users className="w-12 h-12 text-gray-600 mb-4" />
            <p className="text-gray-400 font-bold">Este professor ainda não foi atribuído a nenhuma turma.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {classes.map((turma: any) => {
              const enrolledCount = Array.isArray(turma.enrollments) ? turma.enrollments.length : (turma.enrollments?.count || 0);
              const schedules = Array.isArray(turma.class_schedules) ? turma.class_schedules : [];

              return (
                <div key={turma.id} className="bg-[#1A1A24] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-[#E5E87A]/50 transition-all duration-300 flex flex-col md:flex-row gap-6">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#E5E87A]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#E5E87A]/10 transition-all duration-500"></div>
                  
                  <div className="flex-1 relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                        turma.status === 'active' 
                        ? 'bg-[#C0E87A]/10 text-[#C0E87A] border-[#C0E87A]/20' 
                        : 'bg-white/5 text-gray-500 border-white/10'
                      }`}>
                        {turma.status === 'active' ? 'Ativa' : 'Inativa'}
                      </span>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{turma.courses?.name}</span>
                    </div>
                    
                    <h3 className="font-black text-white text-2xl mb-4">{turma.name}</h3>
                    
                    <div className="flex items-center gap-2 text-gray-400 bg-black/50 w-fit px-4 py-2 rounded-xl border border-white/5">
                      <Users className="w-4 h-4 text-[#7D7AE8]" />
                      <span className="font-bold text-gray-300">{enrolledCount} / {turma.capacity || 0} Vagas Ocupadas</span>
                    </div>
                  </div>

                  {schedules.length > 0 && (
                    <div className="md:w-72 shrink-0 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 relative z-10 flex flex-col justify-center space-y-3">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Horários da Turma</p>
                      {schedules.map((schedule: any) => (
                        <div key={schedule.id} className="flex flex-col gap-1 bg-white/5 p-3 rounded-xl border border-white/5">
                          <div className="flex items-center gap-2 text-white">
                            <Clock className="w-3.5 h-3.5 text-[#E5E87A]" />
                            <span className="text-sm font-bold">{DAYS_OF_WEEK[schedule.day_of_week]} - {schedule.start_time.slice(0,5)} às {schedule.end_time.slice(0,5)}</span>
                          </div>
                          {schedule.room && (
                            <div className="flex items-center gap-2 text-gray-400">
                              <MapPin className="w-3 h-3" />
                              <span className="text-xs">{schedule.room}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {schedules.length === 0 && (
                    <div className="md:w-72 shrink-0 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 relative z-10 flex items-center justify-center text-gray-500 text-sm">
                      Nenhum horário definido.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
