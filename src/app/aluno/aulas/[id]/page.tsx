import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CourseViewer } from '@/components/student/CourseViewer';

export default async function AlunoCoursePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: courseId } = await params;
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

  // Verify enrollment
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('student_id', studentId)
    .eq('course_id', courseId)
    .eq('status', 'active')
    .maybeSingle();

  // If strict enrollment check is needed:
  // if (!enrollment) redirect('/aluno/aulas');

  // Fetch course details + modules + contents
  const { data: course } = await supabase
    .from('courses')
    .select(`
      *,
      course_modules (
        *,
        module_contents (
          contents (
            id, title, type, url, description
          )
        )
      )
    `)
    .eq('id', courseId)
    .maybeSingle();

  if (!course) {
    return <div className="p-8 text-white">Curso não encontrado.</div>;
  }

  // Fetch student progress for this course's contents
  const { data: progressData } = await supabase
    .from('student_progress')
    .select('content_id, status')
    .eq('student_id', studentId);

  const completedContentIds = new Set(
    progressData?.filter(p => p.status === 'completed').map(p => p.content_id) || []
  );

  // Format data for the client component
  const rawModules = course?.course_modules || [];
  
  // Sort modules by order_index
  const sortedModules = rawModules.sort((a: any, b: any) => a.order_index - b.order_index);

  const modules = sortedModules.map((m: any) => {
    const contents = m.module_contents
      ? m.module_contents
          .map((mc: any) => mc.contents)
          .filter(Boolean)
          .map((c: any) => ({
            ...c,
            completed: completedContentIds.has(c.id)
          }))
      : [];

    return {
      id: m.id,
      title: m.title,
      description: m.description || '',
      orderIndex: m.order_index,
      contents
    };
  });

  return (
    <CourseViewer
      courseId={course.id}
      courseName={course.name}
      modules={modules}
      studentId={studentId}
      schoolId={schoolId}
    />
  );
}
