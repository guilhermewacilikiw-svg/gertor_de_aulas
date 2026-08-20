import { createClient } from '@/lib/supabase/server';
import { ArrowLeft, Save, Video, Link as LinkIcon, FileText } from 'lucide-react';
import Link from 'next/link';

export default async function RegistroAulaPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { id } = params;

  const { data: lesson } = await supabase
    .from('lessons')
    .select('*, classes(name)')
    .eq('id', id)
    .single();

  // In a real app, this form would be a Client Component (<form action={...} /> or using useForm)
  // to handle the actual submission to Supabase, updating `attendance`, `lesson_records`, etc.
  
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-4">
        <Link href="/professor/dashboard" className="p-2 bg-muted rounded-full hover:bg-muted/80 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Registro de Aula</h2>
          <p className="text-muted-foreground">{lesson?.classes?.name} • {new Date(lesson?.scheduled_start).toLocaleDateString('pt-BR')}</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Section 1: Presence */}
        <section className="bg-card border rounded-2xl p-6 shadow-soft">
          <h3 className="font-semibold text-lg mb-4 border-b pb-2">1. Chamada</h3>
          <div className="space-y-3">
             <div className="flex items-center justify-between p-3 bg-muted/20 rounded-xl">
               <span className="font-medium">João (Aluno)</span>
               <div className="flex gap-2">
                 <button className="px-4 py-1.5 bg-emerald-100 text-emerald-700 font-semibold rounded-lg text-sm border border-emerald-200">Presente</button>
                 <button className="px-4 py-1.5 bg-white text-muted-foreground font-semibold rounded-lg text-sm border hover:bg-muted transition-colors">Ausente</button>
               </div>
             </div>
             <div className="flex items-center justify-between p-3 bg-muted/20 rounded-xl">
               <span className="font-medium">Maria (Aluna)</span>
               <div className="flex gap-2">
                 <button className="px-4 py-1.5 bg-emerald-100 text-emerald-700 font-semibold rounded-lg text-sm border border-emerald-200">Presente</button>
                 <button className="px-4 py-1.5 bg-white text-muted-foreground font-semibold rounded-lg text-sm border hover:bg-muted transition-colors">Ausente</button>
               </div>
             </div>
          </div>
        </section>

        {/* Section 2: Content */}
        <section className="bg-card border rounded-2xl p-6 shadow-soft">
          <h3 className="font-semibold text-lg mb-4 border-b pb-2">2. Resumo da Aula</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">O que foi trabalhado hoje?</label>
              <textarea 
                className="w-full border rounded-xl p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/20 bg-muted/10 text-sm" 
                placeholder="Ex: Treinamos pestanas e transição entre acordes maiores..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Exercícios para casa (Prática)</label>
              <textarea 
                className="w-full border rounded-xl p-3 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary/20 bg-muted/10 text-sm" 
                placeholder="Ex: Praticar a escala maior por 15 minutos diários."
              />
            </div>
          </div>
        </section>

        {/* Section 3: Materials & Videos */}
        <section className="bg-card border rounded-2xl p-6 shadow-soft">
          <h3 className="font-semibold text-lg mb-4 border-b pb-2">3. Materiais de Apoio</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="border border-dashed rounded-xl p-6 text-center hover:bg-muted/10 transition-colors cursor-pointer group flex flex-col items-center">
               <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                 <Video className="w-6 h-6" />
               </div>
               <h4 className="font-semibold text-foreground">Upload de Vídeo</h4>
               <p className="text-xs text-muted-foreground mt-1">Grave um exercício para seus alunos.</p>
            </div>

            <div className="border border-dashed rounded-xl p-6 text-center hover:bg-muted/10 transition-colors cursor-pointer group flex flex-col items-center relative">
               <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-3 group-hover:scale-110 transition-transform">
                 <LinkIcon className="w-6 h-6" />
               </div>
               <h4 className="font-semibold text-foreground">Link do YouTube/Vimeo</h4>
               <p className="text-xs text-muted-foreground mt-1">Anexe um vídeo externo.</p>
            </div>

          </div>
        </section>

        {/* Action Bar */}
        <div className="flex justify-end gap-3 pt-4">
          <Link href="/professor/dashboard" className="px-6 py-2.5 rounded-xl font-semibold border text-foreground hover:bg-muted transition-colors">
            Cancelar
          </Link>
          <button className="px-6 py-2.5 rounded-xl font-semibold bg-primary text-primary-foreground flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm">
            <Save className="w-5 h-5" />
            Finalizar Aula
          </button>
        </div>
      </div>
    </div>
  );
}
