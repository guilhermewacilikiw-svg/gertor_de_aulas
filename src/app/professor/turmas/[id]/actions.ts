'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function createLessonAction(formData: FormData) {
  const supabase = await createClient();
  const class_id = formData.get('class_id') as string;

  if (!class_id) {
    return { success: false, error: 'Turma não informada' };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Acesso negado' };

  const { data: publicUser } = await supabase
    .from('users')
    .select('id')
    .eq('auth_user_id', user.id)
    .single();

  if (!publicUser) return { success: false, error: 'Usuário não encontrado' };

  const { data: teacherRecord } = await supabase
    .from('teachers')
    .select('id, school_id')
    .eq('user_id', publicUser.id)
    .single();

  if (!teacherRecord) return { success: false, error: 'Professor não encontrado' };

  // Create a new lesson starting now, ending in 1 hour
  const now = new Date();
  const end = new Date(now.getTime() + 60 * 60 * 1000);

  const { data: lesson, error } = await supabase
    .from('lessons')
    .insert({
      school_id: teacherRecord.school_id,
      class_id,
      teacher_id: teacherRecord.id,
      scheduled_start: now.toISOString(),
      scheduled_end: end.toISOString(),
      actual_start: now.toISOString(),
      status: 'in_progress',
      topic: 'Nova Aula',
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating lesson:', error);
    return { success: false, error: 'Erro ao criar aula' };
  }

  // Redirect to the class diary
  redirect(`/professor/diario/${lesson.id}`);
}
