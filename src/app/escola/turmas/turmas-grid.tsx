'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Plus, ChevronRight } from 'lucide-react';

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" aria-hidden="true" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Buscar turma, curso ou professor"
            placeholder="Buscar turma, curso ou professor"
            className="w-full min-h-11 bg-white/[0.04] border border-white/10 rounded-lg pl-10 pr-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>

        <Link
          href="/escola/turmas/novo"
          className="inline-flex items-center justify-center gap-2 px-4 min-h-11 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova turma
        </Link>
      </div>

      {filteredClasses.length > 0 ? (
        <ul className="divide-y divide-white/5 border-t border-white/10">
          {filteredClasses.map((cls) => {
            const enrolledCount = cls.enrollments?.length || 0;
            const capacity = cls.capacity || 30;
            const percent = Math.min(100, Math.round((enrolledCount / capacity) * 100));
            const teacherName = cls.teachers?.users?.name || 'Sem professor atribuído';
            const courseName = cls.courses?.name || 'Curso geral';
            const ativa = cls.status === 'active' || cls.is_active !== false;

            return (
              <li key={cls.id}>
                <Link
                  href={`/escola/turmas/${cls.id}`}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 py-4 px-2 -mx-2 rounded-lg hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-white truncate">{cls.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-md shrink-0 ${ativa ? 'bg-green-500/15 text-green-300' : 'bg-white/5 text-gray-400'}`}>
                        {ativa ? 'Ativa' : 'Inativa'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 truncate">{courseName} · {teacherName}</p>
                  </div>

                  <div className="sm:w-56 shrink-0">
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Vagas</span>
                      <span>{enrolledCount} / {capacity}</span>
                    </div>
                    <div
                      className="mt-1.5 h-1.5 rounded-full bg-white/10 overflow-hidden"
                      role="progressbar"
                      aria-valuenow={percent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Ocupação da turma ${cls.name}`}
                    >
                      <div className="h-full rounded-full bg-red-500" style={{ width: `${percent}%` }} />
                    </div>
                  </div>

                  <ChevronRight className="hidden sm:block w-4 h-4 text-gray-500 shrink-0" aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="py-20 text-center border-t border-white/10">
          <p className="text-white font-medium">
            {searchTerm ? 'Nenhuma turma encontrada' : 'Crie sua primeira turma'}
          </p>
          <p className="text-sm text-gray-400 mt-1 mb-4">
            {searchTerm
              ? 'Tente outro termo ou limpe a busca.'
              : 'Organize alunos, cursos e horários em turmas.'}
          </p>
          {!searchTerm && (
            <Link
              href="/escola/turmas/novo"
              className="inline-flex items-center gap-2 px-4 min-h-11 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Nova turma
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
