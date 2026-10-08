import { createClient } from '@/lib/supabase/server';
import { SchoolCalendar, CalendarEvent } from '@/components/shared/SchoolCalendar';
import { PageHeader } from '@/components/shared/PageHeader';
import { getAuthenticatedSchool } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function EscolaCalendarioPage() {
  const authContext = await getAuthenticatedSchool();
  if (!authContext) redirect('/login');

  const { schoolId } = authContext;
  const supabase = await createClient();

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
      <PageHeader
        title="Calendário da escola"
        subtitle="Visão geral da agenda de todos os professores, turmas e eventos da instituição."
      />

      <SchoolCalendar events={formattedEvents} schedules={formattedSchedules} role="escola" />
    </div>
  );
}
