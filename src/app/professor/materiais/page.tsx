'use client';

import { useState, useEffect } from 'react';
import { Plus, Video, FileText, Search, PlayCircle, ExternalLink, MoreVertical } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function ProfessorMateriaisPage() {
  const [loading, setLoading] = useState(true);
  const [contents, setContents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadContents() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: publicUser } = await supabase
          .from('users')
          .select('id')
          .eq('auth_user_id', user.id)
          .single();

        if (publicUser) {
          // Busca os conteúdos criados por este professor
          const { data: dbContents } = await supabase
            .from('contents')
            .select(`
              id, title, description, type, status, created_at, cover_image,
              content_targets(target_type, target_id)
            `)
            .eq('created_by', publicUser.id)
            .order('created_at', { ascending: false });

          if (dbContents) {
            setContents(dbContents);
          }
        }
      }
      setLoading(false);
    }

    loadContents();
  }, []);

  const filteredContents = contents.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Materiais e Cursos</h1>
          <p className="text-sm text-gray-400 mt-1">
            Gerencie os vídeos complementares e PDFs disponibilizados para seus alunos.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Buscar material..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#0f0f0f] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7D7AE8] focus:ring-1 focus:ring-[#7D7AE8] transition-all"
            />
          </div>
          <Link 
            href="/professor/materiais/novo"
            className="w-full sm:w-auto bg-[#7D7AE8] hover:bg-[#7D7AE8]/90 text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Novo Material
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-400">Carregando seus materiais...</div>
      ) : filteredContents.length === 0 ? (
        <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-12 flex flex-col items-center justify-center text-center shadow-lg">
          <div className="w-16 h-16 bg-[#C77AE8]/10 rounded-full flex items-center justify-center mb-4">
            <Video className="w-8 h-8 text-[#C77AE8]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Nenhum material encontrado</h3>
          <p className="text-gray-400 max-w-md">
            Você ainda não fez upload de nenhum vídeo ou PDF de apoio.
          </p>
          <Link 
            href="/professor/materiais/novo"
            className="mt-6 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold border border-white/10 transition-colors"
          >
            Adicionar Primeiro Material
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContents.map((content) => {
            const isVideo = content.type === 'video' || content.type === 'link';
            return (
              <div key={content.id} className="bg-[#0f0f0f] border border-white/5 rounded-3xl overflow-hidden flex flex-col shadow-lg hover:border-[#7D7AE8]/30 transition-all group">
                {/* Thumbnail Area */}
                <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden">
                  {content.cover_image ? (
                    <img src={content.cover_image} alt={content.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#7D7AE8]/10 to-[#C77AE8]/10"></div>
                  )}
                  {isVideo ? (
                    <PlayCircle className="w-12 h-12 text-white/50 group-hover:text-white group-hover:scale-110 transition-all absolute" />
                  ) : (
                    <FileText className="w-12 h-12 text-white/50 group-hover:text-white group-hover:scale-110 transition-all absolute" />
                  )}
                  
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-black/60 text-white backdrop-blur-md border border-white/10">
                      {content.type === 'link' ? 'VÍDEO (LINK)' : content.type.toUpperCase()}
                    </span>
                    {content.status === 'published' && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#C0E87A]/20 text-[#C0E87A] backdrop-blur-md border border-[#C0E87A]/30">
                        PÚBLICO
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Info */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-white text-lg leading-tight group-hover:text-[#7D7AE8] transition-colors line-clamp-2">
                      {content.title}
                    </h3>
                    <button className="text-gray-500 hover:text-white transition-colors shrink-0">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                    {content.description || 'Sem descrição.'}
                  </p>

                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">
                      {new Date(content.created_at).toLocaleDateString('pt-BR')}
                    </span>
                    <button className="text-[#7D7AE8] text-xs font-bold hover:underline flex items-center gap-1">
                      Acessar <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
