'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function completeLesson(lessonId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Usuário não autenticado.' };
  }

  // 1. Encontrar o ID do estudante atrelado ao usuário
  const { data: student } = await supabase
    .from('students')
    .select('id, school_id')
    .eq('user_id', user.id)
    .single();

  if (!student) {
    return { success: false, error: 'Perfil de aluno não encontrado.' };
  }

  // 2. Registrar a presença (attendance)
  const { error: attendanceError } = await supabase
    .from('attendance')
    .insert({
      school_id: student.school_id,
      lesson_id: lessonId,
      student_id: student.id,
      status: 'present',
      marked_by: user.id
    });

  if (attendanceError) {
    // Pode falhar se já houver registro (violação unique)
    console.log("Aviso ao marcar presença (possivelmente já marcada):", attendanceError.message);
  }

  // 3. Mudar o status da aula para completed
  const { error: lessonError } = await supabase
    .from('lessons')
    .update({ status: 'completed', completed_at: new Date().toISOString() })
    .eq('id', lessonId);

  if (lessonError) {
    return { success: false, error: 'Falha ao concluir a aula.' };
  }

  // A magia do Gamification acontece no banco via trigger_lesson_completion!
  
  // Revalidar as rotas para atualizar o XP na barra e a lista de aulas
  revalidatePath('/aluno/dashboard');
  revalidatePath(`/aluno/aulas/${lessonId}`);

  return { success: true };
}
