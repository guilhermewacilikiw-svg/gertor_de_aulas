import { createClient } from '@/lib/supabase/server';
import { SchoolCalendar, CalendarEvent } from '@/components/shared/SchoolCalendar';
import { redirect } from 'next/navigation';

export default async function ProfessorCalendarioPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: publicUser } = await supabase
    .from('users')
    .select('id')
    .eq('auth_user_id', user.id)
    .single();

  if (!publicUser) redirect('/login');

  const { data: teacherRecord } = await supabase
    .from('teachers')
    .select('id, school_id')
    .eq('user_id', publicUser.id)
    .single();

  if (!teacherRecord) redirect('/login');

  const teacherId = teacherRecord.id;
  const schoolId = teacherRecord.school_id;

  // Fetch lessons for this teacher
  const { data: lessons } = await supabase
    .from('lessons')
    .select(`
      id, topic, scheduled_start, scheduled_end, status,
      classes (name, room)
    `)
    .eq('teacher_id', teacherId);

  // Fetch school events
  const { data: eventsData } = await supabase
    .from('events')
    .select('*')
    .eq('school_id', schoolId);

  // Fetch class schedules for this teacher
  const { data: schedulesData } = await supabase
    .from('class_schedules')
    .select(`
      id, day_of_week, start_time, end_time, room,
      classes!inner (
        name, teacher_id
      )
    `)
    .eq('school_id', schoolId)
    .eq('classes.teacher_id', teacherId);

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
      subtitle: l.topic || 'Sem tópico',
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
    const className = (s.classes as any)?.name || 'Turma';
    return {
      id: s.id,
      dayOfWeek: s.day_of_week,
      startTime: s.start_time.substring(0, 5),
      endTime: s.end_time.substring(0, 5),
      title: className,
      subtitle: 'Minha Turma',
      location: s.room || 'Sem Sala',
      type: 'schedule' as const
    };
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Meu Calendário</h1>
        <p className="text-sm text-gray-400 mt-1">Visualize suas aulas agendadas e os próximos eventos da instituição.</p>
      </div>

      <SchoolCalendar events={formattedEvents} schedules={formattedSchedules} role="professor" />
    </div>
  );
}
