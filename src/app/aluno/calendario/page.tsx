import { createClient } from '@/lib/supabase/server';
import { SchoolCalendar, CalendarEvent } from '@/components/shared/SchoolCalendar';

export default async function AlunoCalendarioPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  let studentId = '10000000-0000-0000-0000-200000000001';
  let schoolId = '11111111-1111-1111-1111-111111111111';

  if (user) {
    const { data: publicUser } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    if (publicUser) {
      const { data: studentRecord } = await supabase
        .from('students')
        .select('id, school_id')
        .eq('user_id', publicUser.id)
        .maybeSingle();

      if (studentRecord) {
        studentId = studentRecord.id;
        schoolId = studentRecord.school_id;
      }
    }
  }

  // Fetch all classes this student is enrolled in
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('class_id')
    .eq('student_id', studentId)
    .not('class_id', 'is', null);

  const classIds = enrollments?.map(e => e.class_id).filter(Boolean) || [];

  let lessons: any[] = [];
  
  if (classIds.length > 0) {
    const { data } = await supabase
      .from('lessons')
      .select(`
        id, topic, scheduled_start, scheduled_end, status,
        classes (name, room),
        teachers (users(name))
      `)
      .in('class_id', classIds);
      
    if (data) lessons = data;
  }

  // Fetch school events
  const { data: eventsData } = await supabase
    .from('events')
    .select('*')
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
      subtitle: `Prof. ${(l.teachers as any)?.users?.name || ''} - ${l.topic || ''}`,
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Calendário Escolar</h1>
        <p className="text-sm text-gray-400 mt-1">Acompanhe suas datas de aulas presenciais e eventos da escola.</p>
      </div>

      <SchoolCalendar events={formattedEvents} role="aluno" />
    </div>
  );
}
