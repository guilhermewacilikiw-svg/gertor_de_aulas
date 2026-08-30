'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function changePasswordAction(formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Acesso negado' };
  }

  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirm_password') as string;

  if (!password || !confirmPassword) {
    return { success: false, error: 'Preencha todos os campos.' };
  }

  if (password !== confirmPassword) {
    return { success: false, error: 'As senhas não coincidem.' };
  }

  if (password.length < 6) {
    return { success: false, error: 'A senha deve ter no mínimo 6 caracteres.' };
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
    data: { requires_password_change: false }
  });

  if (error) {
    return { success: false, error: 'Erro ao atualizar senha: ' + error.message };
  }

  // Get user role to redirect correctly
  const { data: publicUser } = await supabase
    .from('users')
    .select('id')
    .eq('auth_user_id', user.id)
    .single();

  if (publicUser) {
    const { data: membership } = await supabase
      .from('school_memberships')
      .select('role')
      .eq('user_id', publicUser.id)
      .limit(1)
      .single();

    if (membership) {
      if (membership.role === 'TEACHER') {
        redirect('/professor/dashboard');
      } else if (membership.role === 'STUDENT') {
        redirect('/aluno/dashboard');
      } else if (membership.role === 'SCHOOL_ADMIN' || membership.role === 'MANAGER') {
        redirect('/escola/dashboard');
      }
    }
  }

  redirect('/login');
}
