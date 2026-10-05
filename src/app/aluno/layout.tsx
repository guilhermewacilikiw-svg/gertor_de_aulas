import { requireRole } from '@/lib/auth';
import { LayoutDashboard, GraduationCap, Calendar, BarChart } from 'lucide-react';
import { DashboardLayout, DashboardLink } from '@/components/layout/DashboardLayout';

export default async function AlunoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authContext = await requireRole(['STUDENT']);
  const userName = authContext.userName || 'Aluno';

  const links: DashboardLink[] = [
    { label: 'Início', href: '/aluno/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Minhas Aulas', href: '/aluno/aulas', icon: <GraduationCap className="w-4 h-4" /> },
    { label: 'Calendário', href: '/aluno/calendario', icon: <Calendar className="w-4 h-4" /> },
    { label: 'Desempenho', href: '/aluno/desempenho', icon: <BarChart className="w-4 h-4" /> },
  ];

  return (
    <DashboardLayout
      portalName="Portal do Aluno"
      userName={userName}
      links={links}
    >
      {children}
    </DashboardLayout>
  );
}
