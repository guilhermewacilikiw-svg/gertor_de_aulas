import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { BibliotecaMateriais } from './client-modal';
import { FolderArchive, HardDrive, FileText, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export default async function EscolaConteudosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: publicUser } = await supabase
    .from('users')
    .select('id')
    .eq('auth_user_id', user.id)
    .single();

  let schoolId;
  if (publicUser) {
    const { data: membership } = await supabase
      .from('school_memberships')
      .select('school_id')
      .eq('user_id', publicUser.id)
      .single();
    if (membership) schoolId = membership.school_id;
  }

  // Fetch real materials
  let initialMaterials: any[] = [];
  let modules: any[] = [];
  let lessons: any[] = [];
  let students: any[] = [];

  if (schoolId) {
    const [contentsRes, modulesRes, lessonsRes, studentsRes] = await Promise.all([
      supabase.from('contents').select('*').eq('school_id', schoolId).order('created_at', { ascending: false }),
      supabase.from('course_modules').select('id, title').eq('school_id', schoolId),
      supabase.from('lessons').select('id, topic, scheduled_start').eq('school_id', schoolId).order('scheduled_start', { ascending: false }),
      supabase.from('students').select('id, name, users(name)').eq('school_id', schoolId)
    ]);

    if (contentsRes.data) {
      initialMaterials = contentsRes.data.map(c => ({
        id: c.id,
        title: c.title,
        type: c.type,
        target: c.description || 'Todos',
        size: 'Link Externo',
        uploadedAt: new Date(c.created_at).toLocaleDateString('pt-BR'),
        url: c.url
      }));
    }

    modules = modulesRes.data || [];
    lessons = lessonsRes.data || [];
    students = studentsRes.data || [];
  }

  return (
    <div className="bg-[#0a0a0f] min-h-screen text-white w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-8 max-w-6xl mx-auto pb-12 pt-4">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tight drop-shadow-md">Conteúdos <span className="text-[#C0E87A]">Ricos</span></h1>
            <p className="text-sm text-gray-400 mt-2 font-medium">Gerencie a biblioteca de arquivos, PDFs e materiais pedagógicos da escola.</p>
          </div>
        </div>

        {/* Grid Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard 
            title="Links e Vídeos" 
            value={initialMaterials.length.toString()} 
            subtitle="Cadastrados no sistema" 
            subtitleColor="text-[#C0E87A]"
            icon={<FolderArchive className="w-5 h-5 text-black" />} 
            color="from-[#C0E87A] to-[#E5E87A]" 
            glowColor="bg-[#C0E87A]"
          />
          <MetricCard 
            title="Armazenamento" 
            value="Nuvem Externa" 
            subtitle="Via Links" 
            subtitleColor="text-gray-400"
            icon={<LinkIcon className="w-5 h-5 text-white" />} 
            color="from-[#7D7AE8] to-[#A27AE8]" 
            glowColor="bg-[#7D7AE8]"
          />
          <MetricCard 
            title="Acessos Totais" 
            value="0" 
            subtitle="Downloads e visualizações" 
            subtitleColor="text-gray-400"
            icon={<FileText className="w-5 h-5 text-white" />} 
            color="from-[#A27AE8] to-[#C77AE8]" 
            glowColor="bg-[#C77AE8]"
          />
        </div>

        {/* Acervo Recente / Biblioteca */}
        <BibliotecaMateriais 
          initialMaterials={initialMaterials} 
          modules={modules}
          lessons={lessons}
          students={students}
        />

      </div>
    </div>
  );
}

function MetricCard({ title, value, subtitle, subtitleColor, icon, color, glowColor }: { title: string; value: string; subtitle: string; subtitleColor: string; icon: React.ReactNode; color: string, glowColor: string }) {
  return (
    <div className="bg-[#12121A]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-white/20 transition-all shadow-lg hover:-translate-y-1">
      <div className={`absolute top-0 right-0 p-4 opacity-20 transform translate-x-4 -translate-y-4 group-hover:scale-110 group-hover:opacity-30 transition-all duration-500`}>
        <div className={`w-32 h-32 ${glowColor} rounded-full blur-[40px]`}></div>
      </div>
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{title}</p>
            <h3 className="text-4xl font-black text-white mt-1 tracking-tight">{value}</h3>
          </div>
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300`}>
            {icon}
          </div>
        </div>
        <p className={cn("text-xs font-bold", subtitleColor)}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}
