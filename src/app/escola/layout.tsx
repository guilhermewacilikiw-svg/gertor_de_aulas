import { redirect } from 'next/navigation';
import { LayoutDashboard, Users, BookOpen, Calendar } from 'lucide-react';
import { DashboardLayout, DashboardLink } from '@/components/layout/DashboardLayout';
import { getAuthenticatedSchool } from '@/lib/auth';

export default async function EscolaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authContext = await getAuthenticatedSchool();
  if (!authContext) {
    redirect('/login');
  }

  const { publicUserId, schoolId, adminName } = authContext;

  const links: DashboardLink[] = [
    { label: 'Painel', href: '/escola/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Calendário', href: '/escola/calendario', icon: <Calendar className="w-4 h-4" /> },
    { label: 'Alunos', href: '/escola/alunos', icon: <Users className="w-4 h-4" /> },
    { label: 'Professores', href: '/escola/professores', icon: <Users className="w-4 h-4" /> },
    { label: 'Turmas', href: '/escola/turmas', icon: <Users className="w-4 h-4" /> },
    { label: 'Cursos', href: '/escola/cursos', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Conteúdos', href: '/escola/conteudos', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <DashboardLayout
      portalName="Portal da Escola"
      userName={adminName}
      links={links}
    >
      {children}
    </DashboardLayout>
  );
}
