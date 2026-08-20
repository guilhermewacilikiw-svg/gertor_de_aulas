import { Suspense } from 'react';
import LancarAvaliacaoClient from './client-form';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LancarAvaliacaoPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <Link href="/professor/avaliacoes" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" />
        Voltar para Turmas
      </Link>

      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Lançar Evolução Mensal</h1>
        <p className="text-sm text-gray-400 mt-1">
          Avalie o desempenho geral dos alunos desta turma.
        </p>
      </div>

      <Suspense fallback={<div className="p-12 text-center text-gray-400">Carregando formulário...</div>}>
        <LancarAvaliacaoClient />
      </Suspense>
    </div>
  );
}
