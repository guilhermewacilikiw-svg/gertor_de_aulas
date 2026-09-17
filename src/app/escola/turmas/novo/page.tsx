import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getAuthenticatedSchool } from '@/lib/auth';
import { NovoTurmaForm } from './client-form';

export const dynamic = 'force-dynamic';

export default async function NovaTurmaPage() {
  const authContext = await getAuthenticatedSchool();
  if (!authContext) redirect('/login');

  const { schoolId: SCHOOL_ID } = authContext;
  const supabase = await createClient();

  const [
    { data: courses },
    { data: teachers }
  ] = await Promise.all([
    supabase
      .from('courses')
      .select('id, name')
      .eq('school_id', SCHOOL_ID)
      .order('name', { ascending: true }),
    supabase
      .from('teachers')
      .select('id, users (name)')
      .eq('school_id', SCHOOL_ID)
  ]);

  return (
    <NovoTurmaForm 
      courses={courses || []} 
      teachers={(teachers as any) || []} 
    />
  );
}
