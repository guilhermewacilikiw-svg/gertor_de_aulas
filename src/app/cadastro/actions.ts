'use server';

import { createClient } from '@/lib/supabase/server';
import { translateSupabaseError } from '@/lib/utils';

export async function saasRegisterAction(formData: FormData) {
  const supabase = await createClient();

  const schoolName = (formData.get('schoolName') as string)?.trim();
  const adminName = (formData.get('adminName') as string)?.trim();
  const adminEmail = (formData.get('adminEmail') as string)?.trim();
  const adminPassword = (formData.get('adminPassword') as string)?.trim();
  const document = (formData.get('document') as string)?.trim();
  const phone = (formData.get('phone') as string)?.trim();

  if (!schoolName || !adminName || !adminEmail || !adminPassword) {
    return { success: false, error: 'Preencha todos os campos obrigatórios' };
  }

  // 1. SignUp user in Supabase Auth GoTrue
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email: adminEmail,
    password: adminPassword,
    options: {
      data: {
        name: adminName
      }
    }
  });

  if (signUpError) {
    console.error('SignUp Error:', signUpError);
    return { success: false, error: translateSupabaseError(signUpError.message) };
  }

  if (!authData.user) {
    return { success: false, error: 'Erro ao criar conta de usuário.' };
  }

  // 2. Insert into schools and users manually
  const { data: school, error: schoolError } = await supabase
    .from('schools')
    .insert({ 
      name: schoolName, 
      document: document || null,
      phone: phone || null,
      email: adminEmail,
      status: 'active' 
    })
    .select('id')
    .single();

  if (schoolError || !school) {
    console.error('School Insert Error:', schoolError);
    return { success: false, error: 'Erro ao criar o perfil da escola/professor.' };
  }

  // Insert into public.users (trigger might have done this, but we fallback)
  // Check if exists first
  let pubUser = null;
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('auth_user_id', authData.user.id)
    .maybeSingle();

  if (existingUser) {
    pubUser = existingUser;
  } else {
    const { data: newUser } = await supabase
      .from('users')
      .insert({ 
        auth_user_id: authData.user.id, 
        name: adminName, 
        email: adminEmail, 
        phone: phone || null,
        status: 'active' 
      })
      .select('id')
      .single();
    pubUser = newUser;
  }

  if (pubUser) {
    await supabase.from('school_memberships').insert({
      school_id: school.id,
      user_id: pubUser.id,
      role: 'SCHOOL_ADMIN',
      status: 'active'
    });
  }

  // 3. Sign in immediately so session cookies are stored
  await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword
  });

  return { success: true, redirect: '/escola/dashboard' };
}
