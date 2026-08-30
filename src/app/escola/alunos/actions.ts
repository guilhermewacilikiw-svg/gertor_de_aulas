'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { translateSupabaseError } from '@/lib/utils';

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
  const password = 'senha123'; // Senha padrão
  
  // New fields
  const cpfRaw = formData.get('cpf') as string;
  const phoneRaw = formData.get('phone') as string;
  const birthDate = formData.get('birth_date') as string;

  if (!name || !email) {
    return { success: false, error: 'Preencha todos os campos obrigatórios' };
  }

  // Clean masking
  const cpf = cpfRaw ? cpfRaw.replace(/\D/g, '') : null;
  const phone = phoneRaw ? phoneRaw.replace(/\D/g, '') : null;

  // Chamar a função RPC segura para criar o aluno e os perfis
  const { data, error } = await supabase.rpc('admin_create_student', {
    p_name: name,
    p_email: email,
    p_password: password,
    p_school_id: membership.school_id,
    p_cpf: cpf,
    p_phone: phone,
    p_birth_date: birthDate || null
  });

  if (error) {
    console.error('RPC Error:', error);
    return { success: false, error: 'Erro ao criar conta: ' + translateSupabaseError(error.message) };
  }

  if (data?.error) {
    return { success: false, error: translateSupabaseError(data.error) };
  }

  // Set requires_password_change metadata
  const { data: createdUser } = await supabase
    .from('users')
    .select('auth_user_id')
    .eq('email', email)
    .single();

  if (createdUser?.auth_user_id) {
    await supabase.auth.admin.updateUserById(createdUser.auth_user_id, {
      user_metadata: { requires_password_change: true }
    });
  }

  revalidatePath('/escola/alunos');
  
  return { success: true };
}

export async function importStudentsAction(students: { name: string, email: string, password?: string }[]) {
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
    return { success: false, error: 'Usuário não encontrado' };
  }

  const { data: membership } = await supabase
    .from('school_memberships')
    .select('school_id')
    .eq('user_id', publicUser.id)
    .single();

  if (!membership?.school_id) {
    return { success: false, error: 'Escola não encontrada' };
  }

  let successCount = 0;
  let errors = [];

  for (const student of students) {
    if (!student.name || !student.email) continue;
    
    const { data, error } = await supabase.rpc('admin_create_student', {
      p_name: student.name,
      p_email: student.email,
      p_password: student.password || 'Mudar@123',
      p_school_id: membership.school_id
    });

    if (error || data?.error) {
      const msg = error?.message || data?.error || '';
      errors.push(`Erro ao importar ${student.email}: ${translateSupabaseError(msg)}`);
    } else {
      successCount++;
    }
  }

  revalidatePath('/escola/alunos');
  
  return { 
    success: true, 
    successCount, 
    errors 
  };
}
