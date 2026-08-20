'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const loginType = formData.get('loginType') as string

  const { error, data: authData } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: 'E-mail ou senha incorretos.' }
  }

  if (authData.user && authData.session) {
    // Re-instantiate the SSR client so it reads the NEW cookies that were just set by signInWithPassword
    const freshSupabase = await createClient()

    // 1. Encontrar o Perfil Público (onde o RLS está 100% mapeado para o auth.uid())
    const { data: publicUser, error: userError } = await freshSupabase
      .from('users')
      .select('id')
      .eq('auth_user_id', authData.user.id)
      .single()

    if (userError || !publicUser) {
      await supabase.auth.signOut()
      return { error: 'Perfil de usuário não encontrado.' }
    }

    // 2. Encontrar a permissão usando o ID público
    const { data: membershipData, error: membershipError } = await freshSupabase
      .from('school_memberships')
      .select('role')
      .eq('user_id', publicUser.id)
      .limit(1)
      .single()

    if (membershipError || !membershipData) {
      // Falha ao achar a escola do usuário
      await supabase.auth.signOut()
      return { error: 'Sua conta não está vinculada a nenhuma escola.' }
    }

    const role = membershipData.role

    // 3. Validação do tipo de login com a role
    let isValid = false;
    if (loginType === 'aluno' && role === 'STUDENT') {
      isValid = true;
    } else if (loginType === 'professor' && role === 'TEACHER') {
      isValid = true;
    } else if (loginType === 'escola' && (role === 'SUPER_ADMIN' || role === 'SCHOOL_ADMIN' || role === 'MANAGER')) {
      isValid = true;
    }

    if (!isValid) {
      await supabase.auth.signOut()
      return { error: 'Tipo de conta incompatível com o painel selecionado.' }
    }

    revalidatePath('/', 'layout')
    
    // Redirect based on role
    if (role === 'SUPER_ADMIN') {
      redirect('/master/dashboard')
    } else if (role === 'SCHOOL_ADMIN' || role === 'MANAGER') {
      redirect('/escola/dashboard')
    } else if (role === 'TEACHER') {
      redirect('/professor/dashboard')
    } else if (role === 'STUDENT') {
      redirect('/aluno/dashboard')
    } else {
       redirect('/')
    }
  }
}
