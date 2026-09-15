import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LayoutDashboard, Users, CreditCard, BookOpen, Calendar, Sparkles } from 'lucide-react';
import { NotificationCenter } from '@/components/shared/NotificationCenter';
import { DashboardLayout, DashboardLink } from '@/components/layout/DashboardLayout';
import { TrialBanner } from '@/components/escola/TrialBanner';
import { getSchoolPlanAndUsage } from '@/lib/saas/limits';

export default async function EscolaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let publicUserId: string | undefined;
  let schoolId: string | undefined;
  let adminName = 'Administrador';

  if (user) {
    const { data: publicUser } = await supabase
      .from('users')
      .select('id, name, school_memberships(school_id)')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    if (publicUser) {
      publicUserId = publicUser.id;
      adminName = publicUser.name;
      const memberships: any = publicUser.school_memberships;
      schoolId = Array.isArray(memberships) ? memberships[0]?.school_id : memberships?.school_id;
    }
  }

  const subInfo = schoolId ? await getSchoolPlanAndUsage(schoolId) : null;

  const links: DashboardLink[] = [
    { label: 'Painel', href: '/escola/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Calendário', href: '/escola/calendario', icon: <Calendar className="w-4 h-4" /> },
    { label: 'Alunos', href: '/escola/alunos', icon: <Users className="w-4 h-4" /> },
    { label: 'Professores', href: '/escola/professores', icon: <Users className="w-4 h-4" /> },
    { label: 'Turmas', href: '/escola/turmas', icon: <Users className="w-4 h-4" /> },
    { label: 'Cursos', href: '/escola/cursos', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Conteúdos', href: '/escola/conteudos', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Financeiro', href: '/escola/financeiro', icon: <CreditCard className="w-4 h-4" /> },
  ];

  return (
    <DashboardLayout
      portalName="Portal da Escola"
      userName={adminName}
      links={links}
      headerActions={<NotificationCenter userId={publicUserId} schoolId={schoolId} />}
    >
      {children}
    </DashboardLayout>
  );
}
