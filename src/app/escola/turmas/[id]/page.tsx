import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ClassManagementView } from '@/components/escola/ClassManagementView';

export default async function TurmaDetailsPage({ params }: { params: Promise<{ id: string }> }) {
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

  // 1. Fetch Class
  const { data: turma, error: classError } = await supabase
    .from('classes')
    .select('*, courses(name), teachers(users(name))')
    .eq('id', id)
    .eq('school_id', SCHOOL_ID)
    .single();

  if (!turma || classError) {
    redirect('/escola/turmas');
  }

  // 2. Fetch Schedules
  const { data: schedules } = await supabase
    .from('class_schedules')
    .select('*')
    .eq('class_id', turma.id)
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true });

  // 3. Fetch Enrollments
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('*, students(name, email)')
    .eq('class_id', turma.id)
    .order('created_at', { ascending: false });

  // 4. Fetch Available Students
  const enrolledStudentIds = (enrollments || []).map(e => e.student_id);
  
  let studentsQuery = supabase
    .from('students')
    .select('id, name, email')
    .eq('school_id', SCHOOL_ID)
    .eq('status', 'active');

  // se a lista de IDs matriculados estiver vazia, .not('id', 'in', '()') pode dar erro, então tratamos
  if (enrolledStudentIds.length > 0) {
    studentsQuery = studentsQuery.not('id', 'in', `(${enrolledStudentIds.join(',')})`);
  }

  const { data: availableStudents } = await studentsQuery;

  // 5. Fetch Other Classes for this course (for transfer)
  const { data: otherClasses } = await supabase
    .from('classes')
    .select('id, name, capacity')
    .eq('course_id', turma.course_id)
    .eq('school_id', SCHOOL_ID)
    .eq('status', 'active')
    .neq('id', turma.id);

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <ClassManagementView 
        turma={turma} 
        schedules={schedules || []}
        enrollments={enrollments || []}
        availableStudents={availableStudents || []}
        otherClasses={otherClasses || []}
      />
    </div>
  );
}
