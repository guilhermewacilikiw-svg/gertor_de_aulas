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
  const [linkUrl, setLinkUrl] = useState('');
  const [target, setTarget] = useState('');
  
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

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
              
              const classIds = dbClasses.map(c => c.id);
              if (classIds.length > 0) {
                 const { data: enrolls } = await supabase
                    .from('enrollments')
                    .select('students(id, name, student_code)')
                    .in('class_id', classIds)
                    .eq('status', 'active');
                 
                 const dbStudents = (enrolls?.map(e => Array.isArray(e.students) ? e.students[0] : e.students).filter(Boolean) || []) as any[];
                 setStudents(dbStudents);
                 
                 setTarget(`class_${dbClasses[0].id}`);
              }
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
    if (!title || !target || !linkUrl) return alert("Preencha título, link e selecione o destino.");

    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: publicUser } = await supabase.from('users').select('id').eq('auth_user_id', user.id).single();

      if (publicUser) {
        const { data: teacherRecord } = await supabase.from('teachers').select('id, school_id').eq('user_id', publicUser.id).single();
        const schoolId = teacherRecord?.school_id;

        if (schoolId) {
          // 1. Determinar tipo real baseado na URL
          let type = 'link';
          if (linkUrl.includes('youtube.com') || linkUrl.includes('youtu.be') || linkUrl.includes('vimeo.com')) type = 'video';
          else if (linkUrl.includes('drive.google.com') && linkUrl.includes('pdf')) type = 'pdf';

          // 2. Criar o Content
          const { data: content, error: contentError } = await supabase
            .from('contents')
            .insert({
              school_id: schoolId,
              created_by: publicUser.id,
              title,
              description,
              type: type,
              url: linkUrl,
              status: 'published'
            })
            .select()
            .single();

          if (contentError || !content) {
            alert("Erro ao criar conteúdo: " + (contentError?.message || 'Erro desconhecido'));
            setLoading(false);
            return;
          }

          // 3. Salvar no content_targets
          if (target.startsWith('class_')) {
              await supabase.from('content_targets').insert({
                school_id: schoolId,
                content_id: content.id,
                target_type: 'class',
                target_id: target.replace('class_', '')
              });
          } else if (target.startsWith('student_')) {
              await supabase.from('content_targets').insert({
                school_id: schoolId,
                content_id: content.id,
                target_type: 'student',
                target_id: target.replace('student_', '')
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

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-1">Link (YouTube, Vimeo, Drive) *</label>
              <input 
                type="url" 
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..." 
                required
                className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#7D7AE8] focus:ring-1 focus:ring-[#7D7AE8] transition-all"
              />
              <p className="text-xs text-gray-500 mt-2">Dica: Use vídeos "Não Listados" no YouTube para manter exclusividade ou links do Google Drive com permissão de leitura.</p>
            </div>

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
              <label className="block text-sm font-bold text-gray-300 mb-1">Vincular a *</label>
              <select 
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#7D7AE8] transition-all"
              >
                <optgroup label="Suas Turmas">
                  {classes.map(cls => (
                    <option key={`class_${cls.id}`} value={`class_${cls.id}`}>{cls.name} ({cls.courses?.name})</option>
                  ))}
                </optgroup>
                <optgroup label="Alunos Específicos">
                  {students.map(std => (
                    <option key={`student_${std.id}`} value={`student_${std.id}`}>Aluno: {std.name}</option>
                  ))}
                </optgroup>
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
