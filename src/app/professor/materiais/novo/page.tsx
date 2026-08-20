'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Loader2, Save, Link as LinkIcon, FileText, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function NovoMaterialPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'link' | 'pdf'>('link');
  const [linkUrl, setLinkUrl] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    async function loadClasses() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: publicUser } = await supabase.from('users').select('id').eq('auth_user_id', user.id).single();
        if (publicUser) {
          const { data: teacherRecord } = await supabase.from('teachers').select('id').eq('user_id', publicUser.id).single();
          if (teacherRecord) {
            const { data: dbClasses } = await supabase
              .from('classes')
              .select('id, name, courses(name)')
              .eq('teacher_id', teacherRecord.id)
              .eq('status', 'active');
              
            if (dbClasses) {
              setClasses(dbClasses);
              if (dbClasses.length > 0) setSelectedClassId(dbClasses[0].id);
            }
          }
        }
      }
      setLoadingInitial(false);
    }
    loadClasses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !selectedClassId) return alert("Preencha título e selecione uma turma.");
    if (type === 'link' && !linkUrl) return alert("Insira o link do vídeo.");

    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: publicUser } = await supabase.from('users').select('id').eq('auth_user_id', user.id).single();

      if (publicUser) {
        const { data: teacherRecord } = await supabase.from('teachers').select('id, school_id').eq('user_id', publicUser.id).single();
        const schoolId = teacherRecord?.school_id;

        if (schoolId) {
          // 1. Criar o Content
          const { data: content, error: contentError } = await supabase
            .from('contents')
            .insert({
              school_id: schoolId,
              created_by: publicUser.id,
              title,
              description,
              type: type,
              status: 'published'
            })
            .select()
            .single();

          if (contentError || !content) {
            alert("Erro ao criar conteúdo: " + (contentError?.message || 'Erro desconhecido'));
            setLoading(false);
            return;
          }

          // 2. Se for link, salva no content_targets
          await supabase.from('content_targets').insert({
            school_id: schoolId,
            content_id: content.id,
            target_type: 'class',
            target_id: selectedClassId
          });

          // 3. Salvar o video
          if (type === 'link') {
             await supabase.from('videos').insert({
               school_id: schoolId,
               content_id: content.id,
               title,
               storage_path: linkUrl, 
               visibility: 'class',
               processing_status: 'ready'
             });
          }

          router.push('/professor/materiais');
          router.refresh();
        } else {
          alert("Erro: ID da Escola não encontrado para este professor.");
        }
      }
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <Link href="/professor/materiais" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" />
        Voltar para Materiais
      </Link>

      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Novo Material Complementar</h1>
        <p className="text-sm text-gray-400 mt-1">
          Adicione um vídeo ou documento de apoio para seus alunos estudarem em casa.
        </p>
      </div>

      {loadingInitial ? (
        <div className="p-12 text-center text-gray-400">Carregando turmas...</div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-8 shadow-lg space-y-6">
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button"
              onClick={() => setType('link')}
              className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 ${type === 'link' ? 'bg-[#7D7AE8]/20 border-[#7D7AE8] text-[#7D7AE8]' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
            >
              <LinkIcon className="w-6 h-6" />
              <span className="font-bold text-sm">Link Externo (Vídeo)</span>
            </button>
            <button 
              type="button"
              onClick={() => setType('pdf')}
              className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 ${type === 'pdf' ? 'bg-[#C77AE8]/20 border-[#C77AE8] text-[#C77AE8]' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
            >
              <FileText className="w-6 h-6" />
              <span className="font-bold text-sm">Arquivo (PDF)</span>
            </button>
          </div>

          <div className="space-y-4 pt-4">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-1">Título do Material *</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Exercício de Pentatônica Módulo 1" 
                required
                className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#7D7AE8] focus:ring-1 focus:ring-[#7D7AE8] transition-all"
              />
            </div>

            {type === 'link' && (
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1">Link do Vídeo (YouTube / Vimeo) *</label>
                <input 
                  type="url" 
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..." 
                  required
                  className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#7D7AE8] focus:ring-1 focus:ring-[#7D7AE8] transition-all"
                />
                <p className="text-xs text-gray-500 mt-2">Dica: Use vídeos "Não Listados" no YouTube para manter exclusividade.</p>
              </div>
            )}

            {type === 'pdf' && (
              <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center bg-black hover:bg-white/5 transition-colors cursor-pointer">
                <FileText className="w-8 h-8 text-gray-500 mx-auto mb-3" />
                <p className="text-sm text-gray-300 font-bold">Clique para fazer upload de PDF</p>
                <p className="text-xs text-gray-500 mt-1">Tamanho máximo: 10MB</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-1">Descrição Opcional</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Instruções para o aluno ao acessar este material..." 
                className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#7D7AE8] focus:ring-1 focus:ring-[#7D7AE8] transition-all min-h-[100px] resize-y"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-1">Vincular à Turma *</label>
              <select 
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#7D7AE8] transition-all"
              >
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name} ({cls.courses?.name})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button 
              type="submit"
              disabled={loading}
              className="bg-[#7D7AE8] hover:bg-[#7D7AE8]/90 text-white px-8 py-3.5 rounded-xl font-black flex items-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
              Salvar e Publicar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
