'use client';

import { useState, useTransition } from 'react';
import { Plus, X, Upload, FileText, FileDown, MoreVertical, Search, FileCode2, Video, Database, Sparkles, FolderArchive, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { uploadMaterial } from './actions';

interface Material {
  id: string;
  title: string;
  type: string;
  target: string;
  size: string;
  uploadedAt: string;
  url?: string;
}

export function BibliotecaMateriais({ 
  initialMaterials = [],
  modules = [],
  lessons = [],
  students = []
}: { 
  initialMaterials?: Material[];
  modules?: any[];
  lessons?: any[];
  students?: any[];
}) {
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState('');

  const filteredMaterials = materials.filter(m => m.title.toLowerCase().includes(search.toLowerCase()));

  const handleUploadSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await uploadMaterial(formData);
      
      if (result.error) {
        setErrorMsg(result.error);
        return;
      }
      
      // Sucesso
      setIsOpen(false);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      // The page will revalidate and update initialMaterials via Server Component
    });
  };

  const setIsOpen = setIsModalOpen;

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-5 h-5 text-rose-400" />;
      case 'video': return <Video className="w-5 h-5 text-cyan-400" />;
      case 'sheet': return <FileCode2 className="w-5 h-5 text-emerald-400" />;
      case 'archive': return <FolderArchive className="w-5 h-5 text-amber-400" />;
      default: return <Database className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-white text-lg">Acervo Recente</h3>
        <button 
          onClick={() => setIsOpen(true)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#A27AE8] to-[#C77AE8] hover:scale-105 text-white font-black text-xs shadow-[0_0_20px_rgba(162,122,232,0.4)] transition-all flex items-center gap-2 group"
        >
          <Upload className="w-4 h-4 stroke-[3] group-hover:-translate-y-1 transition-transform" />
          Novo Material
        </button>
      </div>

      <div className="bg-[#12121A]/80 backdrop-blur-xl border border-white/5 rounded-3xl shadow-xl overflow-hidden relative mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#A27AE8]/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5 relative z-10">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar material na biblioteca..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 text-xs rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#A27AE8]/50 focus:ring-1 focus:ring-[#A27AE8]/50 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-black/40 text-[10px] uppercase font-black tracking-widest text-gray-500 border-b border-white/5">
              <tr>
                <th className="p-5 pl-6">Material</th>
                <th className="p-5">Público Alvo</th>
                <th className="p-5">Tamanho</th>
                <th className="p-5">Data</th>
                <th className="p-5 text-right pr-6">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredMaterials.map((mat) => (
                <tr key={mat.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-5 pl-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                        {getFileIcon(mat.type)}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm group-hover:text-[#A27AE8] transition-colors">{mat.title}</div>
                        <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-0.5">{mat.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/10 bg-white/5 text-gray-300">
                      {mat.target === 'all' ? 'Escola' : (mat.target.includes('module_') ? 'Módulo' : (mat.target.includes('student_') ? 'Aluno Específico' : mat.target))}
                    </span>
                  </td>
                  <td className="p-5 text-xs font-bold text-[#C0E87A]">{mat.size}</td>
                  <td className="p-5 text-xs font-medium text-gray-500">{mat.uploadedAt}</td>
                  <td className="p-5 text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <a href={mat.url} target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-[#C0E87A] transition-colors" title="Acessar Link">
                        <FileDown className="w-4 h-4" />
                      </a>
                      <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredMaterials.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500">
                    <Database className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="font-bold text-sm">Nenhum material encontrado.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE UPLOAD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#0a0a0f] border border-white/10 rounded-3xl p-6 shadow-2xl text-white">
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C0E87A]/10 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
              <div>
                <span className="text-xs font-bold text-[#C0E87A] uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Biblioteca
                </span>
                <h2 className="text-xl font-black text-white">Upload de Material</h2>
                <p className="text-xs text-gray-400 mt-0.5">Envie arquivos para os alunos e professores.</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="pt-6 space-y-4 relative z-10">
              
              {errorMsg && (
                <div className="p-3 border-l-4 border-red-500 bg-red-500/10 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] font-mono text-red-400 uppercase">{errorMsg}</p>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Título do Material</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    name="title"
                    required
                    disabled={isPending}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#C0E87A] focus:ring-1 focus:ring-[#C0E87A] transition-all placeholder-gray-600 disabled:opacity-50"
                    placeholder="Ex: Escalas Maiores e Menores"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Público Alvo (Acesso)</label>
                <select
                  name="target"
                  required
                  disabled={isPending}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-[#C0E87A] focus:ring-1 focus:ring-[#C0E87A] transition-all appearance-none disabled:opacity-50"
                >
                  <option value="all">Material Base (Toda a Escola)</option>
                  <optgroup label="Módulos">
                    {modules.map(m => (
                      <option key={m.id} value={`module_${m.id}`}>{m.title}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Alunos (Material Complementar)">
                    {students.map(s => (
                      <option key={s.id} value={`student_${s.id}`}>{s.users?.name || s.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Vincular a uma Aula (Opcional)</label>
                <select
                  name="lesson_id"
                  disabled={isPending}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-[#C0E87A] focus:ring-1 focus:ring-[#C0E87A] transition-all appearance-none disabled:opacity-50"
                >
                  <option value="">Nenhuma aula vinculada</option>
                  {lessons.map(l => (
                    <option key={l.id} value={l.id}>{new Date(l.scheduled_start).toLocaleDateString('pt-BR')} - {l.topic || 'Aula'}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Link do Conteúdo (URL)</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="url"
                    name="url"
                    required
                    disabled={isPending}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#C0E87A] focus:ring-1 focus:ring-[#C0E87A] transition-all placeholder-gray-600 disabled:opacity-50"
                    placeholder="Ex: https://youtube.com/watch?v=..."
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isPending}
                  className="flex-1 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-3.5 rounded-xl bg-[#C0E87A] text-black font-black text-sm hover:brightness-110 shadow-[0_0_15px_rgba(192,232,122,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-4 h-4 stroke-[3]" /> {isPending ? 'SALVANDO...' : 'CADASTRAR LINK'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
