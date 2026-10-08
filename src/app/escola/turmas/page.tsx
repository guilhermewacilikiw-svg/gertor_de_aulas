import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/shared/PageHeader';
import { redirect } from 'next/navigation';
import { getAuthenticatedSchool } from '@/lib/auth';
import { TurmasGrid } from './turmas-grid';

export const dynamic = 'force-dynamic';

export default async function TurmasPage() {
  const authContext = await getAuthenticatedSchool();
  if (!authContext) redirect('/login');

  const { schoolId: SCHOOL_ID } = authContext;
  const supabase = await createClient();

  // Buscar turmas com cursos, professores e contagem de matrículas
  const { data: classes } = await supabase
    .from('classes')
    .select('*, courses(name), teachers(users(name)), enrollments(id)')
    .eq('school_id', SCHOOL_ID)
    .order('name', { ascending: true });

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      <PageHeader
        title="Turmas"
        subtitle="Organize os grupos, vincule professores e acompanhe o preenchimento de vagas."
      />

      {/* GRID DE CARDS COM BARRA DE BUSCA EM TEMPO REAL */}
      <TurmasGrid initialClasses={classes || []} />

    </div>
  );
}
