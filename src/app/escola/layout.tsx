import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LayoutDashboard, Users, CreditCard, BookOpen, Calendar } from 'lucide-react';
import { NotificationCenter } from '@/components/shared/NotificationCenter';
import { DashboardLayout, DashboardLink } from '@/components/layout/DashboardLayout';

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
      .select('id, name')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    if (publicUser) {
      publicUserId = publicUser.id;
      adminName = publicUser.name;
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
