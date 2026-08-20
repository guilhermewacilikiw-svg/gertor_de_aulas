import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LayoutDashboard, GraduationCap, Calendar, BarChart, CreditCard } from 'lucide-react';
import { NotificationCenter } from '@/components/shared/NotificationCenter';
import { DashboardLayout, DashboardLink } from '@/components/layout/DashboardLayout';

export default async function AlunoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let publicUserId: string | undefined;
  let schoolId: string | undefined;
  let userName = 'Aluno';

  if (user) {
    const { data: publicUser } = await supabase
      .from('users')
      .select('id, name')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    if (publicUser) {
      publicUserId = publicUser.id;
      userName = publicUser.name;
      const { data: membership } = await supabase
        .from('school_memberships')
        .select('school_id')
        .eq('user_id', publicUser.id)
        .maybeSingle();

      if (membership) {
        schoolId = membership.school_id;
      }
    }
  }

  const links: DashboardLink[] = [
    { label: 'Início', href: '/aluno/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Minhas Aulas', href: '/aluno/aulas', icon: <GraduationCap className="w-4 h-4" /> },
    { label: 'Calendário', href: '/aluno/calendario', icon: <Calendar className="w-4 h-4" /> },
    { label: 'Desempenho', href: '/aluno/desempenho', icon: <BarChart className="w-4 h-4" /> },
    { label: 'Financeiro', href: '/aluno/financeiro', icon: <CreditCard className="w-4 h-4" /> },
  ];

  return (
    <DashboardLayout
      portalName="Portal do Aluno"
      userName={userName}
      links={links}
      headerActions={<NotificationCenter userId={publicUserId} schoolId={schoolId} />}
    >
      {children}
    </DashboardLayout>
  );
}
