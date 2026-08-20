'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createCourseAction(formData: FormData) {
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
  const description = formData.get('description') as string;

  if (!name) {
    return { success: false, error: 'O nome do curso é obrigatório' };
  }

  const { error } = await supabase
    .from('courses')
    .insert({
      school_id: membership.school_id,
      name,
      description,
      status: 'active'
    });

  if (error) {
    console.error('Insert Course Error:', error);
    return { success: false, error: 'Erro ao criar curso: ' + error.message };
  }

  revalidatePath('/escola/cursos');
  
  return { success: true };
}
