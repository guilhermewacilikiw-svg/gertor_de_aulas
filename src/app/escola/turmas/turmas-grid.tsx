'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Plus, Users, BookOpen, ChevronRight, GraduationCap } from 'lucide-react';

interface TurmasGridProps {
  initialClasses: any[];
}

export function TurmasGrid({ initialClasses }: TurmasGridProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClasses = (initialClasses || []).filter((cls) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = cls.name?.toLowerCase().includes(term);
    const courseMatch = cls.courses?.name?.toLowerCase().includes(term);
    const teacherMatch = cls.teachers?.users?.name?.toLowerCase().includes(term);
    return nameMatch || courseMatch || teacherMatch;
  });

  return (
    <div className="space-y-8">
      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/5 border border-white/5 rounded-3xl p-4 backdrop-blur-sm shadow-lg">
        <div className="relative w-full sm:w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar turma, curso ou professor..."
            className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all text-white font-medium placeholder:text-gray-600"
          />
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Link 
            href="/escola/turmas/novo"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 hover:scale-105 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2 group shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3] group-hover:rotate-90 transition-transform" />
            Nova Turma
          </Link>
        </div>
      </div>

      {/* CLASSES CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.length > 0 ? (
          filteredClasses.map((cls) => {
            const enrolledCount = cls.enrollments?.length || 0;
            const capacity = cls.capacity || 30;
            const percent = Math.min(100, Math.round((enrolledCount / capacity) * 100));
            const teacherName = cls.teachers?.users?.name || 'Sem professor atribuído';
            const courseName = cls.courses?.name || 'Curso Geral';

            return (
              <Link 
                href={`/escola/turmas/${cls.id}`} 
                key={cls.id} 
                className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-6 flex flex-col justify-between shadow-lg hover:border-red-600/30 hover:scale-[1.01] transition-all duration-300 group block relative overflow-hidden"
              >
                <div>
                  {/* Card Top */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-600/30 flex items-center justify-center text-red-500 font-black text-xl shrink-0 group-hover:scale-105 transition-transform">
                        <Users className="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg leading-tight group-hover:text-red-500 transition-colors line-clamp-1">
                          {cls.name}
                        </h3>
                        <p className="text-xs text-gray-400 font-medium mt-1 flex items-center gap-1.5 line-clamp-1">
                          <BookOpen className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          <span>{courseName}</span>
                        </p>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600/10 text-red-400 border border-red-600/20 shrink-0">
                      {cls.status === 'active' || cls.is_active !== false ? 'Ativa' : 'Inativa'}
                    </span>
                  </div>

                  {/* Teacher Info Pill */}
                  <div className="mt-4 p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-600/30 flex items-center justify-center text-red-500 font-black text-xs shrink-0 uppercase">
                      {teacherName.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">Professor Responsável</span>
                      <span className="text-xs font-bold text-white truncate block">{teacherName}</span>
                    </div>
                  </div>

                  {/* Vagas / Ocupação */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400 font-medium flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-red-500" />
                        Ocupação
                      </span>
                      <span className="font-black text-white">
                        {enrolledCount} <span className="text-gray-500 font-normal">/ {capacity} alunos</span>
                      </span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                      <div 
                        className="bg-gradient-to-r from-red-600 to-red-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-bold text-gray-400 group-hover:text-white transition-colors">
                  <span>Gerenciar Turma</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 text-red-500 transition-all" />
                </div>
              </Link>
            );
          })
        ) : (
          <div className="col-span-full bg-[#0f0f0f] border border-white/5 rounded-3xl p-12 text-center">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">
              {searchTerm ? 'Nenhuma turma encontrada para a busca' : 'Nenhuma turma cadastrada ainda'}
            </h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto mb-6">
              {searchTerm 
                ? 'Tente buscar com outro termo ou limpe o campo de busca.'
                : 'Cadastre sua primeira turma para organizar alunos, cursos e horários.'}
            </p>
            {!searchTerm && (
              <Link
                href="/escola/turmas/novo"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all"
              >
                <Plus className="w-4 h-4" />
                Criar Primeira Turma
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
