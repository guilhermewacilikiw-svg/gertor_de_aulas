import { LayoutDashboard, Users, BookOpen, Calendar, GraduationCap, Layers } from 'lucide-react';
import { DashboardLayout, DashboardLink } from '@/components/layout/DashboardLayout';
import { requireRole } from '@/lib/auth';

export default async function EscolaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authContext = await requireRole(['SCHOOL_ADMIN', 'MANAGER', 'SUPER_ADMIN']);
  const { adminName } = authContext;

  const links: DashboardLink[] = [
    { label: 'Painel', href: '/escola/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Calendário', href: '/escola/calendario', icon: <Calendar className="w-4 h-4" /> },
    { label: 'Alunos', href: '/escola/alunos', icon: <Users className="w-4 h-4" /> },
    { label: 'Professores', href: '/escola/professores', icon: <GraduationCap className="w-4 h-4" /> },
    { label: 'Turmas', href: '/escola/turmas', icon: <Layers className="w-4 h-4" /> },
    { label: 'Cursos', href: '/escola/cursos', icon: <BookOpen className="w-4 h-4" /> },
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
