'use client';

import { useState } from 'react';
import { PlayCircle, CheckCircle, Circle, Video, FileText, Headphones, Link as LinkIcon, File, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface ContentItem {
  id: string;
  title: string;
  type: 'video' | 'audio' | 'pdf' | 'image' | 'document' | 'link';
  url?: string;
  description?: string;
  completed?: boolean;
}

interface CourseModule {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
  contents: ContentItem[];
}

interface CourseViewerProps {
  courseId: string;
  courseName: string;
  modules: CourseModule[];
  studentId: string;
  schoolId: string;
}

export function CourseViewer({ courseId, courseName, modules, studentId, schoolId }: CourseViewerProps) {
  const [activeContentId, setActiveContentId] = useState<string | null>(
    modules[0]?.contents?.[0]?.id || null
  );
  
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    [modules[0]?.id]: true
  });

  const [localModules, setLocalModules] = useState<CourseModule[]>(modules);
  const [isMarking, setIsMarking] = useState(false);

  const toggleModule = (modId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [modId]: !prev[modId]
    }));
  };

  const activeModule = localModules.find(m => m.contents.some(c => c.id === activeContentId));
  const activeContent = activeModule?.contents.find(c => c.id === activeContentId);

  const handleMarkComplete = async () => {
    if (!activeContentId || isMarking) return;
    setIsMarking(true);

    try {
      const supabase = createClient();
      
      const isCompleted = activeContent?.completed;
      const newStatus = isCompleted ? 'not_started' : 'completed';

      // Update DB
      const { error } = await supabase.from('student_progress').upsert({
        student_id: studentId,
        school_id: schoolId,
        content_id: activeContentId,
        status: newStatus,
        completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
        last_accessed_at: new Date().toISOString()
      }, { onConflict: 'student_id,content_id' });

      if (error) throw error;

      // Update Local State
      setLocalModules(prev => prev.map(m => ({
        ...m,
        contents: m.contents.map(c => 
          c.id === activeContentId ? { ...c, completed: !isCompleted } : c
        )
      })));

    } catch (error) {
      console.error(error);
      alert("Erro ao marcar conclusão da aula.");
    } finally {
      setIsMarking(false);
    }
  };

  const getContentIcon = (type: string, completed?: boolean) => {
    if (completed) return <CheckCircle className="w-5 h-5 text-emerald-400" />;
    
    switch (type) {
      case 'video': return <PlayCircle className="w-5 h-5 text-pink-400" />;
      case 'pdf': return <FileText className="w-5 h-5 text-red-400" />;
      case 'audio': return <Headphones className="w-5 h-5 text-purple-400" />;
      case 'link': return <LinkIcon className="w-5 h-5 text-blue-400" />;
      default: return <File className="w-5 h-5 text-gray-400" />;
    }
  };

  // Helper to format YouTube URLs for embed
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')) {
        let videoId = '';
        if (u.hostname.includes('youtu.be')) {
          videoId = u.pathname.slice(1);
        } else {
          videoId = u.searchParams.get('v') || '';
        }
        return `https://www.youtube.com/embed/${videoId}?rel=0`;
      }
      return url;
    } catch (e) {
      return url;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row h-screen pt-16 -mt-16 overflow-hidden animate-in fade-in duration-500">
      
      {/* LEFT AREA: PLAYER */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-10">
          <Link href="/aluno/aulas" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>
          <h1 className="text-sm font-bold truncate max-w-sm hidden sm:block">{courseName}</h1>
        </div>

        <div className="flex-1 flex flex-col items-center p-4 lg:p-8 max-w-5xl mx-auto w-full">
          {activeContent ? (
            <div className="w-full space-y-6">
              
              {/* Media Player Area */}
              <div className="w-full aspect-video bg-neutral-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative flex items-center justify-center">
                {(activeContent.type === 'video' || activeContent.type === 'link') && activeContent.url ? (
                  <iframe 
                    src={getEmbedUrl(activeContent.url)}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : activeContent.type === 'pdf' ? (
                  <div className="text-center p-12">
                    <FileText className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Material em PDF</h3>
                    <a href={activeContent.url} target="_blank" rel="noreferrer" className="px-6 py-2 rounded-full bg-red-500/20 text-red-400 font-bold text-sm inline-block border border-red-500/30 hover:bg-red-500/30 transition-colors">
                      Baixar PDF
                    </a>
                  </div>
                ) : (
                  <div className="text-center p-12">
                    <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Conteúdo Indisponível</h3>
                    <p className="text-gray-400">O link do material não foi fornecido pelo professor.</p>
                  </div>
                )}
              </div>

              {/* Title & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 bg-neutral-900/30 p-6 rounded-3xl border border-white/10">
                <div>
                  <h2 className="text-2xl font-black">{activeContent.title}</h2>
                  <p className="text-sm text-cyan-400 mt-1 font-medium">{activeModule?.title}</p>
                </div>

                <button 
                  onClick={handleMarkComplete}
                  disabled={isMarking}
                  className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg border whitespace-nowrap active:scale-95 ${
                    activeContent.completed 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' 
                    : 'bg-white text-black border-transparent hover:brightness-110'
                  }`}
                >
                  {isMarking ? <Circle className="w-4 h-4 animate-spin" /> : <CheckCircle className={`w-5 h-5 ${activeContent.completed ? 'text-emerald-400' : 'text-black'}`} />}
                  {activeContent.completed ? 'CONCLUÍDO' : 'MARCAR COMO CONCLUÍDA'}
                </button>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 min-h-[50vh]">
              <PlayCircle className="w-16 h-16 mb-4 opacity-20" />
              <p>Selecione uma aula no menu lateral para começar.</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT AREA: PLAYLIST (ACCORDION) */}
      <div className="w-full md:w-80 lg:w-96 bg-neutral-900 border-l border-white/10 flex flex-col h-[50vh] md:h-full shrink-0">
        <div className="p-6 border-b border-white/10 shrink-0 bg-black/20">
          <h2 className="text-lg font-black text-white">Conteúdo do Curso</h2>
          <div className="mt-2 w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-cyan-400 h-full rounded-full transition-all duration-1000" 
              style={{ 
                width: `${Math.round((localModules.flatMap(m => m.contents).filter(c => c.completed).length / Math.max(1, localModules.flatMap(m => m.contents).length)) * 100)}%` 
              }} 
            />
          </div>
          <p className="text-xs text-gray-400 mt-2 font-medium">
            {localModules.flatMap(m => m.contents).filter(c => c.completed).length} de {localModules.flatMap(m => m.contents).length} aulas concluídas
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {localModules.map((module, mIdx) => {
            const isExpanded = expandedModules[module.id];
            
            return (
              <div key={module.id} className="border-b border-white/5">
                <button 
                  onClick={() => toggleModule(module.id)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Módulo {mIdx + 1}</span>
                    <h3 className="text-sm font-bold text-gray-200 line-clamp-2">{module.title}</h3>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>

                {isExpanded && (
                  <div className="bg-black/20 pb-2">
                    {module.contents.map((content, cIdx) => {
                      const isActive = content.id === activeContentId;
                      return (
                        <button
                          key={content.id}
                          onClick={() => setActiveContentId(content.id)}
                          className={`w-full text-left p-3 pl-6 flex items-start gap-3 transition-colors ${
                            isActive 
                            ? 'bg-cyan-500/10 border-l-2 border-cyan-400' 
                            : 'hover:bg-white/5 border-l-2 border-transparent'
                          }`}
                        >
                          <div className="shrink-0 mt-0.5">
                            {getContentIcon(content.type, content.completed)}
                          </div>
                          <div>
                            <p className={`text-sm font-medium line-clamp-2 ${isActive ? 'text-cyan-400' : 'text-gray-300'}`}>
                              {cIdx + 1}. {content.title}
                            </p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">{content.type}</p>
                          </div>
                        </button>
                      );
                    })}
                    {module.contents.length === 0 && (
                      <p className="text-xs text-gray-500 pl-6 py-2">Nenhuma aula cadastrada.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
