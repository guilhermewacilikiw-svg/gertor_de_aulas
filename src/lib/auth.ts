import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';

export interface AuthenticatedSchoolContext {
  authUser: { id: string; email?: string };
  publicUserId: string;
  adminName: string;
  schoolId: string;
  schoolName: string;
  role: string;
}

/**
 * Cache deduplicado por requisição (React cache).
 * Evita que o layout e as páginas façam múltiplas chamadas repetidas
 * ao Supabase Auth e à tabela de usuários na mesma navegação.
 */
export const getAuthenticatedSchool = cache(async (): Promise<AuthenticatedSchoolContext | null> => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: publicUser, error } = await supabase
    .from('users')
    .select('id, name, school_memberships(school_id, role, schools(name))')
    .eq('auth_user_id', user.id)
    .maybeSingle();

  if (error || !publicUser) {
    return null;
  }

  const memberships: any = publicUser.school_memberships;
  const primaryMembership = Array.isArray(memberships) ? memberships[0] : memberships;
  const schoolId = primaryMembership?.school_id;
  
  if (!schoolId) {
    return null;
  }

  const schoolObj = primaryMembership?.schools;
  const schoolName = Array.isArray(schoolObj)
    ? schoolObj[0]?.name
    : schoolObj?.name || 'Sua Escola';

  return {
    authUser: { id: user.id, email: user.email },
    publicUserId: publicUser.id,
    adminName: publicUser.name || 'Administrador',
    schoolId,
    schoolName,
    role: primaryMembership?.role || 'admin',
  };
});
