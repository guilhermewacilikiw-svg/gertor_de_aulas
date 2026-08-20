'use client';

import { useState } from 'react';
import { BookOpen, Plus, Trash2, Edit, ChevronRight, Layers, FileText, Check, Loader2, Video, ArrowLeft, File, Headphones } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface ContentItem {
  id: string;
  title: string;
  type: 'video' | 'audio' | 'pdf' | 'image' | 'document' | 'link';
  url?: string;
}

interface CourseModuleItem {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
  contents: ContentItem[];
}

interface CourseDetailsProps {
  courseId: string;
  schoolId: string;
  initialCourseName?: string;
  initialDescription?: string;
  initialCategory?: string;
  initialLevel?: string;
  initialModules?: CourseModuleItem[];
}

export function CourseManagementView({
  courseId,
  schoolId,
  initialCourseName = 'Violão Básico',
  initialDescription = 'Curso prático para iniciantes aprenderem postura, acordes, ritmos e primeiras músicas.',
  initialCategory = 'Música',
  initialLevel = 'Iniciante',
  initialModules = []
}: CourseDetailsProps) {
  const [courseName, setCourseName] = useState(initialCourseName);
  const [description, setDescription] = useState(initialDescription);
  const [category, setCategory] = useState(initialCategory);
  const [level, setLevel] = useState(initialLevel);
  const [modules, setModules] = useState<CourseModuleItem[]>(initialModules);

  // Modals state
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  // Forms state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  
  const [contentTitle, setContentTitle] = useState('');
  const [contentType, setContentType] = useState<'video' | 'pdf' | 'audio' | 'document' | 'link'>('video');
  const [contentUrl, setContentUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [savingCourse, setSavingCourse] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveCourse = async () => {
    setSavingCourse(true);
    try {
      const supabase = createClient();
      await supabase
        .from('courses')
        .update({
          name: courseName,
          description,
          category,
          level,
          updated_at: new Date().toISOString()
        })
        .eq('id', courseId);

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingCourse(false);
    }
  };

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setLoading(true);
    const newMod: CourseModuleItem = {
      id: `m_${Date.now()}`,
      title: newTitle,
      description: newDescription,
      orderIndex: modules.length + 1,
      contents: []
    };

    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('course_modules').insert({
        school_id: schoolId,
        course_id: courseId,
        title: newTitle,
        description: newDescription,
        order_index: newMod.orderIndex
      }).select('id').single();

      if (error) throw error;
      
      newMod.id = data.id; // update with DB id
      setModules(prev => [...prev, newMod]);
      setNewTitle('');
      setNewDescription('');
      setIsModuleModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Erro ao criar módulo");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteModule = async (id: string) => {
    setModules(prev => prev.filter(m => m.id !== id));
    try {
      const supabase = createClient();
      await supabase.from('course_modules').delete().eq('id', id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentTitle.trim() || !activeModuleId) return;

    setLoading(true);
    try {
      const supabase = createClient();
      
      // 1. Get the current user for created_by
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: publicUser } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .maybeSingle();

      // 2. Insert into contents
      const { data: newContent, error: contentError } = await supabase.from('contents').insert({
        school_id: schoolId,
        created_by: publicUser?.id,
        title: contentTitle,
        type: contentType,
        url: contentUrl || null,
        status: 'published'
      }).select('id, title, type, url').single();

      if (contentError) throw contentError;

      // 3. Link content to module
      const { error: linkError } = await supabase.from('module_contents').insert({
        school_id: schoolId,
        module_id: activeModuleId,
        content_id: newContent.id,
        order_index: 0 // Simplification for now
      });

      if (linkError) throw linkError;

      // 4. Update UI state
      setModules(prev => prev.map(m => {
        if (m.id === activeModuleId) {
          return {
            ...m,
            contents: [...(m.contents || []), { id: newContent.id, title: newContent.title, type: newContent.type as any }]
          };
        }
        return m;
      }));

      setContentTitle('');
      setContentUrl('');
      setIsContentModalOpen(false);
      setActiveModuleId(null);
    } catch (err: any) {
      console.error('Add Content Error:', err);
      const msg = err?.message || err?.details || err?.code || JSON.stringify(err);
      alert("Erro ao adicionar aula/conteúdo: " + msg);
    } finally {
      setLoading(false);
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4 text-pink-400" />;
      case 'pdf': return <FileText className="w-4 h-4 text-red-400" />;
      case 'audio': return <Headphones className="w-4 h-4 text-purple-400" />;
      case 'document': return <File className="w-4 h-4 text-blue-400" />;
      default: return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      
      {/* Navigation Top */}
      <div className="flex items-center justify-between">
        <Link
          href="/escola/cursos"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para Cursos
        </Link>
        {savedSuccess && (
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            ✓ Alterações salvas com sucesso!
          </span>
        )}
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Gestão do Curso & Plano de Aulas</span>
          <h1 className="text-3xl font-black text-white tracking-tight">{courseName}</h1>
        </div>

        <button
          onClick={handleSaveCourse}
          disabled={savingCourse}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:brightness-110 text-white font-extrabold text-xs shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          {savingCourse ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          <span>SALVAR NÍVEL & DETALHES</span>
        </button>
      </div>

      {/* Course Main Details Panel */}
      <div className="bg-neutral-900/30 border border-neutral-800 rounded-3xl p-6 border border-white/10 shadow-xl space-y-6">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white">Informações Gerais do Curso</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-300">Nome do Curso</label>
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-300">Categoria</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex: Música, Dança, Idiomas..."
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-300">Nível</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-neutral-900 border border-white/10 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Iniciante">Iniciante</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
              </select>
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold uppercase text-gray-300">Descrição do Curso & Objetivos</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* PLANO DE AULAS & MÓDULOS */}
      <div className="bg-neutral-900/30 border border-neutral-800 rounded-3xl p-6 border border-white/10 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-lg font-black text-white">Grade Curricular & Planos de Aula</h2>
              <p className="text-xs text-gray-400">Monte a sequência pedagógica adicionando módulos e criando aulas (vídeos, PDFs, etc).</p>
            </div>
          </div>

          <button
            onClick={() => setIsModuleModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 hover:brightness-110 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Novo Módulo
          </button>
        </div>

        {/* Modules List */}
        <div className="space-y-6">
          {modules.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-8">Nenhum módulo cadastrado neste curso ainda. Clique no botão acima para criar o primeiro módulo.</p>
          ) : (
            modules.map((m, idx) => (
              <div
                key={m.id}
                className="rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all overflow-hidden"
              >
                {/* Module Header */}
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-black/20">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-300 font-black text-sm flex items-center justify-center border border-indigo-500/30 shrink-0">
                      #{idx + 1}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-white text-base">{m.title}</h3>
                      <p className="text-xs text-gray-400 leading-relaxed max-w-xl">{m.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <button
                      onClick={() => {
                        setActiveModuleId(m.id);
                        setIsContentModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3 h-3" /> Nova Aula
                    </button>
                    <button
                      onClick={() => handleDeleteModule(m.id)}
                      className="p-1.5 rounded-lg text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                      title="Excluir Módulo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Module Contents (Aulas) */}
                <div className="p-4 flex flex-col gap-2">
                  {(!m.contents || m.contents.length === 0) ? (
                    <div className="py-4 text-center border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
                      <p className="text-xs text-gray-500">Este módulo ainda não possui aulas.</p>
                    </div>
                  ) : (
                    m.contents.map((content, cIdx) => (
                      <div key={content.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center shrink-0">
                            {getContentIcon(content.type)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">{content.title}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">{content.type}</p>
                          </div>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-white transition-all">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CREATE MODULE MODAL */}
      {isModuleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white space-y-6">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Novo Plano</span>
                <h3 className="text-xl font-black text-white">Adicionar Módulo</h3>
              </div>
              <button
                onClick={() => setIsModuleModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddModule} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-300">Título do Módulo</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Módulo 4: Acordes com Pestana"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-300">Descrição (Opcional)</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Descreva o objetivo das aulas..."
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl bg-white text-black font-medium hover:brightness-110 font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                <span>SALVAR MÓDULO</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD CONTENT MODAL */}
      {isContentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white space-y-6">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Nova Aula</span>
                <h3 className="text-xl font-black text-white">Adicionar Conteúdo</h3>
              </div>
              <button
                onClick={() => setIsContentModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddContent} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-300">Tipo de Aula/Conteúdo</label>
                <select
                  value={contentType}
                  onChange={(e: any) => setContentType(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-neutral-900 border border-white/10 text-sm text-white focus:outline-none focus:border-pink-500"
                >
                  <option value="video">Vídeo Aula</option>
                  <option value="pdf">Material em PDF</option>
                  <option value="audio">Áudio / Podcast</option>
                  <option value="document">Documento de Texto</option>
                  <option value="link">Link Externo</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-300">Título da Aula</label>
                <input
                  type="text"
                  required
                  value={contentTitle}
                  onChange={(e) => setContentTitle(e.target.value)}
                  placeholder="Ex: Aula 01 - Postura e Afinação"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              {(contentType === 'video' || contentType === 'link' || contentType === 'audio') && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-300">URL do Material (Youtube, Drive, etc)</label>
                  <input
                    type="url"
                    value={contentUrl}
                    onChange={(e) => setContentUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-pink-500"
                  />
                  <p className="text-[10px] text-gray-500">Cole o link do vídeo hospedado externamente.</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:brightness-110 text-white font-black text-sm shadow-xl shadow-pink-500/20 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                <span>SALVAR AULA</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
