import { createClient } from '@/lib/supabase/server';
import { SchoolCalendar, CalendarEvent } from '@/components/shared/SchoolCalendar';
import { Calendar } from 'lucide-react';

export default async function EscolaCalendarioPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  let schoolId = '11111111-1111-1111-1111-111111111111'; // Default seed

  if (user) {
    const { data: publicUser } = await supabase
      .from('users')
      .select('id, school_memberships(school_id)')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    if (publicUser) {
      const memberships: any = publicUser.school_memberships;
      schoolId = Array.isArray(memberships) ? memberships[0]?.school_id : memberships?.school_id;
    }
  }

  // Fetch lessons, events and schedules concurrently in parallel
  const [
    { data: lessons },
    { data: eventsData },
    { data: schedulesData }
  ] = await Promise.all([
    supabase
      .from('lessons')
      .select(`
        id, topic, scheduled_start, scheduled_end, status,
        classes (
          id, name, room,
          enrollments (
            status,
            students (id, name, email)
          )
        ),
        teachers (users(name))
      `)
      .eq('school_id', schoolId),

    supabase
      .from('events')
      .select('*')
      .eq('school_id', schoolId),

    supabase
      .from('class_schedules')
      .select(`
        id, day_of_week, start_time, end_time, room,
        classes (
          id,
          name,
          teachers (
            users (name)
          ),
          enrollments (
            status,
            students (
              id, name, email
            )
          )
        ),
        schedule_participants (
          students (
            id, name, email
          )
        )
      `)
      .eq('school_id', schoolId)
  ]);

  const formattedEvents: CalendarEvent[] = [];

  lessons?.forEach(l => {
    const d = new Date(l.scheduled_start);
    const enrolledStudents = ((l.classes as any)?.enrollments || [])
      .filter((e: any) => e.status !== 'inactive' && e.status !== 'cancelled')
      .map((e: any) => e.students)
      .filter(Boolean);

    formattedEvents.push({
      id: l.id,
      title: (l.classes as any)?.name || 'Aula',
      date: d,
      startTime: d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      endTime: new Date(l.scheduled_end).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      type: 'lesson',
      status: l.status,
      subtitle: `Prof. ${(l.teachers as any)?.users?.name || ''} - ${l.topic || 'Sem tópico'}`,
      location: (l.classes as any)?.room || 'Sala não definida',
      participants: enrolledStudents
    });
  });

  eventsData?.forEach(e => {
    const d = new Date(e.scheduled_at);
    formattedEvents.push({
      id: e.id,
      title: e.title,
      date: d,
      startTime: d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      type: 'event',
      subtitle: e.description || '',
    });
  });

  const formattedSchedules = (schedulesData || []).map(s => {
    // Navigate relationship class_schedules -> classes -> teachers -> users
    const className = (s.classes as any)?.name || 'Turma Indefinida';
    const teacherName = (s.classes as any)?.teachers?.users?.name || 'Prof. Indefinido';
    
    // Alunos especificamente delimitados para este dia e horário da semana
    const participants = (s.schedule_participants || [])
      .map((p: any) => p.students)
      .filter(Boolean);
    
    return {
      id: s.id,
      dayOfWeek: s.day_of_week,
      startTime: s.start_time.substring(0, 5), // "14:00:00" -> "14:00"
      endTime: s.end_time.substring(0, 5),
      title: className,
      subtitle: teacherName,
      location: s.room || 'Sem Sala',
      type: 'schedule' as const,
      participants
    };
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* HEADER HERO */}
      <div className="relative w-full rounded-2xl bg-[#0a0a0a] border border-white/5 overflow-hidden shadow-2xl p-8 md:p-12 mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F43F5E]/20 rounded-full blur-[100px] animate-pulse mix-blend-screen translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#E11D48]/20 rounded-full blur-[80px] animate-pulse mix-blend-screen -translate-x-1/3 translate-y-1/3" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-[0_0_20px_rgba(244,63,94,0.15)] mb-6">
              <Calendar className="w-4 h-4 text-[#F43F5E]" />
              <span className="text-xs font-black uppercase tracking-widest text-white/80">
                Agenda
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-xl mb-4">
              Calendário da Escola
            </h1>
            <p className="text-gray-400 max-w-xl text-lg">
              Visão geral da agenda de todos os professores, turmas e eventos da instituição.
            </p>
          </div>
        </div>
      </div>

      <SchoolCalendar events={formattedEvents} schedules={formattedSchedules} role="escola" />
    </div>
  );
}
