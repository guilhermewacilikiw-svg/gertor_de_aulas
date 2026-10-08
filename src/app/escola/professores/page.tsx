import { createClient } from '@/lib/supabase/server';
import { Search, Plus, ChevronRight } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAuthenticatedSchool } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function ProfessoresPage() {
  const authContext = await getAuthenticatedSchool();
  if (!authContext) redirect('/login');

  const { schoolId: SCHOOL_ID } = authContext;
  const supabase = await createClient();

  const { data: teachers, error } = await supabase
    .from('teachers')
    .select('*, users (name, email)')
    .eq('school_id', SCHOOL_ID)
    .order('created_at', { ascending: false });

  const total = teachers?.length || 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">
      <PageHeader
        title="Professores"
        subtitle={`${total} ${total === 1 ? 'professor cadastrado' : 'professores cadastrados'} na sua escola.`}
        action={
          <Link
            href="/escola/professores/novo"
            className="inline-flex items-center justify-center gap-2 px-4 min-h-11 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo professor
          </Link>
        }
      />

      <div className="relative w-full sm:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" aria-hidden="true" />
        <input
          type="text"
          aria-label="Buscar professor por nome"
          placeholder="Buscar professor por nome"
          className="w-full min-h-11 bg-white/[0.04] border border-white/10 rounded-lg pl-10 pr-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-red-500 transition-colors"
        />
      </div>

      {teachers && teachers.length > 0 ? (
        <ul className="divide-y divide-white/5 border-t border-white/10">
          {teachers.map((teacher) => {
            const userName = teacher.users?.name || 'Professor sem nome';
            const userEmail = teacher.users?.email || 'Sem e-mail';
            return (
              <li key={teacher.id}>
                <Link
                  href={`/escola/professores/${teacher.id}`}
                  className="flex items-center gap-4 py-3 px-2 -mx-2 rounded-lg hover:bg-white/[0.03] transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center font-medium shrink-0">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{userName}</p>
                    <p className="text-sm text-gray-400 truncate">{userEmail}</p>
                  </div>
                  <span className="hidden sm:block text-sm text-gray-400 shrink-0">
                    {teacher.specialty || 'Música geral'}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-500 shrink-0" aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="py-20 text-center border-t border-white/10">
          <p className="text-white font-medium">Cadastre seu primeiro professor</p>
          <p className="text-sm text-gray-400 mt-1 mb-4">Sua escola ainda não tem professores cadastrados.</p>
          <Link
            href="/escola/professores/novo"
            className="inline-flex items-center gap-2 px-4 min-h-11 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Novo professor
          </Link>
        </div>
      )}
    </div>
  );
}
