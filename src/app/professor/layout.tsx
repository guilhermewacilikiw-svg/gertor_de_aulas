import { requireRole } from '@/lib/auth';
import { LayoutDashboard, Users, Calendar, BookOpen, Star } from 'lucide-react';
import { DashboardLayout, DashboardLink } from '@/components/layout/DashboardLayout';

export default async function ProfessorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authContext = await requireRole(['TEACHER']);
  const teacherName = authContext.userName || 'Professor';

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
