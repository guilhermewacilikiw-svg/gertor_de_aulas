import { createClient } from '@/lib/supabase/server';
import { CourseManagementView } from '@/components/escola/CourseManagementView';
import { redirect } from 'next/navigation';

export default async function CourseDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: courseId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  let schoolId = '11111111-1111-1111-1111-111111111111';

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

  // Fetch course details from DB if available
  const { data: course } = await supabase
    .from('courses')
    .select(`
      *,
      course_modules (
        *,
        module_contents (
          contents (
            id,
            title,
            type
          )
        )
      )
    `)
    .eq('id', courseId)
    .maybeSingle();

  const courseName = course?.name || 'Violão Básico';
  const description = course?.description || 'Curso prático para iniciantes aprenderem postura, acordes, ritmos e primeiras músicas.';
  const category = course?.category || 'Música';
  const level = course?.level || 'Iniciante';

  const rawModules = course?.course_modules || [];
  const modules = rawModules.length > 0
    ? rawModules.map((m: any) => {
        // PostgREST returns an array for module_contents
        const contents = m.module_contents
          ? m.module_contents
              .map((mc: any) => mc.contents)
              .filter(Boolean)
          : [];

        return {
          id: m.id,
          title: m.title,
          description: m.description || '',
          orderIndex: m.order_index,
          contents
        };
      })
    : undefined;

  return (
    <CourseManagementView
      courseId={courseId}
      schoolId={schoolId}
      initialCourseName={courseName}
      initialDescription={description}
      initialCategory={category}
      initialLevel={level}
      initialModules={modules}
    />
  );
}
