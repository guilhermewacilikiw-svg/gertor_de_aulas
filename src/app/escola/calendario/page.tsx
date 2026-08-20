import { createClient } from '@/lib/supabase/server';
import { SchoolCalendar, CalendarEvent } from '@/components/shared/SchoolCalendar';

export default async function EscolaCalendarioPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  let schoolId = '11111111-1111-1111-1111-111111111111'; // Default seed

  if (user) {
    const { data: publicUser } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    if (publicUser) {
      const { data: membership } = await supabase
        .from('school_memberships')
        .select('school_id')
        .eq('user_id', publicUser.id)
        .maybeSingle();

      if (membership) {
        schoolId = membership.school_id;
      }
    }
  }

  // Fetch all lessons for the school
  const { data: lessons } = await supabase
    .from('lessons')
    .select(`
      id, topic, scheduled_start, scheduled_end, status,
      classes (name, room),
      teachers (users(name))
    `)
    .eq('school_id', schoolId);

  // Fetch all events for the school
  const { data: eventsData } = await supabase
    .from('events')
    .select('*')
    .eq('school_id', schoolId);

  // Fetch all class schedules (Grade Semanal)
  const { data: schedulesData } = await supabase
    .from('class_schedules')
    .select(`
      id, day_of_week, start_time, end_time, room,
      classes (
        name,
        teachers (
          users (name)
        )
      )
    `)
    .eq('school_id', schoolId);

  const formattedEvents: CalendarEvent[] = [];

  lessons?.forEach(l => {
    const d = new Date(l.scheduled_start);
    formattedEvents.push({
      id: l.id,
      title: (l.classes as any)?.name || 'Aula',
      date: d,
      startTime: d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      endTime: new Date(l.scheduled_end).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      type: 'lesson',
      status: l.status,
      subtitle: `Prof. ${(l.teachers as any)?.users?.name || ''} - ${l.topic || 'Sem tópico'}`,
      location: (l.classes as any)?.room || 'Sala não definida'
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
    
    return {
      id: s.id,
      dayOfWeek: s.day_of_week,
      startTime: s.start_time.substring(0, 5), // "14:00:00" -> "14:00"
      endTime: s.end_time.substring(0, 5),
      title: className,
      subtitle: teacherName,
      location: s.room || 'Sem Sala',
      type: 'schedule'
    };
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Calendário da Escola</h1>
        <p className="text-sm text-gray-400 mt-1">Visão geral da agenda de todos os professores, turmas e eventos da instituição.</p>
      </div>

      <SchoolCalendar events={formattedEvents} schedules={formattedSchedules} role="escola" />
    </div>
  );
}
