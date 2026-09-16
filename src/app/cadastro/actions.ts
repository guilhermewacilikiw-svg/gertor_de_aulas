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
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://wakoda.com.br'}/escola/dashboard`
    }
  });

  if (signUpError) {
    console.error('SignUp Error:', signUpError);
    return { success: false, error: translateSupabaseError(signUpError.message) };
  }

  if (!authData.user) {
    return { success: false, error: 'Erro ao criar conta de usuário.' };
  }

  // 2. Insert into schools and users manually using RPC to bypass RLS
  const { data: schoolId, error: rpcError } = await supabase.rpc('create_school_and_membership', {
    p_school_name: schoolName,
    p_document: document || null,
    p_phone: phone || null,
    p_admin_email: adminEmail,
    p_auth_user_id: authData.user.id
  });

  if (rpcError || !schoolId) {
    console.error('RPC Insert Error:', rpcError);
    return { success: false, error: 'Erro ao criar o perfil da escola/professor. ' + (rpcError?.message || '') };
  }

  // 3. Configurar Trial de 14 dias e vincular ao plano escolhido (Solo, Stage ou Festival)
  try {
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 14);

    const chosenPlanCode = (formData.get('planCode') as string) || 'stage';

    const { data: selectedPlan } = await supabase
      .from('plans')
      .select('id')
      .eq('code', chosenPlanCode)
      .single();

    // Fallback para stage caso não encontre
    let planIdToAssign = selectedPlan?.id;
    if (!planIdToAssign) {
      const { data: fallbackPlan } = await supabase
        .from('plans')
        .select('id')
        .eq('code', 'stage')
        .single();
      planIdToAssign = fallbackPlan?.id || null;
    }

    await supabase
      .from('schools')
      .update({
        plan_id: planIdToAssign,
        subscription_status: 'active',
        trial_ends_at: null,
        current_period_end: null
      })
      .eq('id', schoolId);
  } catch (err) {
    console.warn('Erro não-bloqueante ao ativar escola:', err);
  }

  // 4. Sign in immediately so session cookies are stored
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword
  });

  // Se o login falhou porque o e-mail precisa de confirmação
  if (signInError) {
    if (signInError.message.toLowerCase().includes('confirm')) {
      return {
        success: true,
        needsConfirmation: true,
        email: adminEmail,
        message: 'Cadastro realizado com sucesso! Enviamos um link de confirmação para o seu e-mail.'
      };
    }
    return { success: false, error: translateSupabaseError(signInError.message) };
  }

  return { success: true, redirect: '/escola/dashboard' };
}
