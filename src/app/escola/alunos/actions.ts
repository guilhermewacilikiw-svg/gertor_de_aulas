'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createStudentAction(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Acesso negado' };
  }

  // Obter publicUser.id
  const { data: publicUser } = await supabase
    .from('users')
    .select('id')
    .eq('auth_user_id', user.id)
    .single();

  if (!publicUser) {
    return { success: false, error: 'Usuário público não encontrado' };
  }

  // Obter school_id do admin atual
  const { data: membership } = await supabase
    .from('school_memberships')
    .select('school_id')
    .eq('user_id', publicUser.id)
    .single();

  if (!membership?.school_id) {
    return { success: false, error: 'Escola não encontrada para este usuário' };
  }

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) {
    return { success: false, error: 'Preencha todos os campos obrigatórios' };
  }

  // Chamar a função RPC segura para criar o aluno e os perfis
  const { data, error } = await supabase.rpc('admin_create_student', {
    p_name: name,
    p_email: email,
    p_password: password,
    p_school_id: membership.school_id
  });

  if (error) {
    console.error('RPC Error:', error);
    return { success: false, error: 'Erro ao criar conta: ' + error.message };
  }

  if (data?.error) {
    return { success: false, error: data.error };
  }

  revalidatePath('/escola/alunos');
  
  return { success: true };
}
