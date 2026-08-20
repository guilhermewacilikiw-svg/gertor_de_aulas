'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function finishLesson(lessonId: string, attendanceData: Record<string, boolean>, summary: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Não autenticado' };
  }

  // 1. Encontrar o teacher_id e public_user_id
  const { data: publicUser } = await supabase
    .from('users')
    .select('id')
    .eq('auth_user_id', user.id)
    .single();

  if (!publicUser) return { success: false, error: 'Usuário não encontrado' };

  const { data: teacher } = await supabase
    .from('teachers')
    .select('id, school_id')
    .eq('user_id', publicUser.id)
    .single();

  if (!teacher) {
    return { success: false, error: 'Professor não encontrado' };
  }

  // 2. Registrar/Atualizar Frequência
  const attendanceInserts = Object.keys(attendanceData).map(studentId => ({
    school_id: teacher.school_id,
    lesson_id: lessonId,
    student_id: studentId,
    status: attendanceData[studentId] ? 'present' : 'absent',
    marked_by: publicUser.id
  }));

  if (attendanceInserts.length > 0) {
    const { error: attError } = await supabase
      .from('attendance')
      .upsert(attendanceInserts, { onConflict: 'lesson_id,student_id' });
    
    if (attError) {
      console.error('Erro na chamada:', attError);
      return { success: false, error: 'Falha ao salvar a chamada' };
    }
  }

  // 3. Salvar o Resumo da Aula (Diário)
  if (summary) {
    await supabase
      .from('lesson_records')
      .upsert({
        school_id: teacher.school_id,
        lesson_id: lessonId,
        teacher_id: teacher.id,
        summary: summary,
      }, { onConflict: 'lesson_id' });
  }

  // 4. Mudar o status da aula para completed
  const { error: lessonError } = await supabase
    .from('lessons')
    .update({ status: 'completed', completed_at: new Date().toISOString() })
    .eq('id', lessonId);

  if (lessonError) {
    return { success: false, error: 'Falha ao finalizar a aula' };
  }

  revalidatePath('/professor/dashboard');
  revalidatePath(`/professor/diario/${lessonId}`);

  return { success: true };
}
