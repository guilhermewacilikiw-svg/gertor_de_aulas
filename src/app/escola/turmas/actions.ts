'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createClassAction(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Acesso negado' };
  }

  const { data: publicUser } = await supabase
    .from('users')
    .select('id')
    .eq('auth_user_id', user.id)
    .single();

  if (!publicUser) {
    return { success: false, error: 'Usuário público não encontrado' };
  }

  const { data: membership } = await supabase
    .from('school_memberships')
    .select('school_id')
    .eq('user_id', publicUser.id)
    .single();

  if (!membership?.school_id) {
    return { success: false, error: 'Escola não encontrada para este usuário' };
  }

  const name = formData.get('name') as string;
  const course_id = formData.get('course_id') as string;
  const teacher_id = formData.get('teacher_id') as string;
  const capacity = formData.get('capacity') ? parseInt(formData.get('capacity') as string) : 30;

  if (!name || !course_id) {
    return { success: false, error: 'Nome da turma e Curso são obrigatórios' };
  }

  const { error } = await supabase
    .from('classes')
    .insert({
      school_id: membership.school_id,
      name,
      course_id,
      teacher_id: teacher_id ? teacher_id : null,
      capacity,
      status: 'active'
    });

  if (error) {
    console.error('Insert Class Error:', error);
    return { success: false, error: 'Erro ao criar turma: ' + error.message };
  }

  revalidatePath('/escola/turmas');
  
  return { success: true };
}
