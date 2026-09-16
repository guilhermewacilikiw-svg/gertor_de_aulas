import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LayoutDashboard, Users, Calendar, BookOpen, Star } from 'lucide-react';
import { DashboardLayout, DashboardLink } from '@/components/layout/DashboardLayout';

export default async function ProfessorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let publicUserId: string | undefined;
  let schoolId: string | undefined;
  let teacherName = 'Professor';

  if (user) {
    const { data: publicUser } = await supabase
      .from('users')
      .select('id, name, school_memberships(school_id)')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    if (publicUser) {
      publicUserId = publicUser.id;
      teacherName = publicUser.name;
      const memberships: any = publicUser.school_memberships;
      schoolId = Array.isArray(memberships) ? memberships[0]?.school_id : memberships?.school_id;
    }
  }

  const links: DashboardLink[] = [
    { label: 'Painel', href: '/professor/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Minhas Turmas', href: '/professor/turmas', icon: <Users className="w-4 h-4" /> },
    { label: 'Meus Alunos', href: '/professor/alunos', icon: <Users className="w-4 h-4" /> },
    { label: 'Materiais', href: '/professor/materiais', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Avaliações', href: '/professor/avaliacoes', icon: <Star className="w-4 h-4" /> },
    { label: 'Calendário', href: '/professor/calendario', icon: <Calendar className="w-4 h-4" /> },
  ];

  return (
    <DashboardLayout
      portalName="Portal do Professor"
      userName={teacherName}
      links={links}
    >
      {children}
    </DashboardLayout>
  );
}
