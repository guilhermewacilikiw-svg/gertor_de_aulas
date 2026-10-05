import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export interface AuthenticatedSchoolContext {
  authUser: { id: string; email?: string };
  publicUserId: string;
  adminName: string;
  userName: string;
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
    userName: publicUser.name || '',
    schoolId,
    schoolName,
    role: primaryMembership?.role || 'admin',
  };
});

export type UserRole = 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'MANAGER' | 'TEACHER' | 'STUDENT';

const ROLE_HOME: Record<string, string> = {
  SUPER_ADMIN: '/master/dashboard',
  SCHOOL_ADMIN: '/escola/dashboard',
  MANAGER: '/escola/dashboard',
  TEACHER: '/professor/dashboard',
  STUDENT: '/aluno/dashboard',
};

/**
 * Garante que o usuário logado tem um dos papéis permitidos.
 * Sem login vai para /login; com papel errado vai para o painel do próprio papel.
 */
export async function requireRole(allowed: UserRole[]): Promise<AuthenticatedSchoolContext> {
  const ctx = await getAuthenticatedSchool();
  if (!ctx) redirect('/login');
  if (!allowed.includes(ctx.role as UserRole)) {
    redirect(ROLE_HOME[ctx.role] ?? '/login');
  }
  return ctx;
}
