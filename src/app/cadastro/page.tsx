import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ShieldCheck, Users, BookOpen, Award } from 'lucide-react';
import Image from 'next/image';
import { SaaSOnboardingForm } from './client-form';
import { Suspense } from 'react';

const RECURSOS = [
  { icone: Users, titulo: 'Alunos e professores', texto: 'Cadastros organizados, com identificação e histórico.' },
  { icone: BookOpen, titulo: 'Turmas e diário de aula', texto: 'Presenças, resumos de aula e materiais complementares.' },
  { icone: Award, titulo: 'Avaliações de 0 a 10', texto: 'Critérios que você define para cada turma.' },
];

export default function CadastroPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0f] text-gray-200">
      <header className="w-full border-b border-white/10">
        <div className="max-w-6xl mx-auto h-16 px-4 sm:px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <span className="w-10 h-10 overflow-hidden rounded-lg border border-white/10">
              <Image src="/logo-rock.jpg" alt="" width={40} height={40} priority className="w-full h-full object-cover" />
            </span>
            <span className="font-bebas text-2xl text-white">Wakoda</span>
          </Link>

          <Link href="/" className="inline-flex items-center gap-2 min-h-11 text-sm text-gray-300 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Voltar ao início
          </Link>
        </div>
      </header>

      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-16 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight leading-tight">
                Crie a conta da sua escola de música
              </h1>
              <p className="text-gray-400">
                Cadastre alunos, monte as turmas, registre as aulas e lance as avaliações em um só lugar.
              </p>
            </div>

            <ul className="space-y-5">
              {RECURSOS.map(({ icone: Icone, titulo, texto }) => (
                <li key={titulo} className="flex items-start gap-3">
                  <Icone className="w-5 h-5 text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-white">{titulo}</p>
                    <p className="text-sm text-gray-400">{texto}</p>
                  </div>
                </li>
              ))}
            </ul>

            <ul className="space-y-3 pt-6 border-t border-white/10 text-sm text-gray-300">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" aria-hidden="true" />
                Todos os recursos liberados durante o período de testes.
              </li>
              <li className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-green-400 shrink-0" aria-hidden="true" />
                Os dados de cada escola ficam separados dos de outras escolas.
              </li>
            </ul>
          </div>

          <div className="lg:col-span-7">
            <Suspense fallback={<div className="w-full h-[500px] rounded-xl bg-white/[0.03] border border-white/10" />}>
              <SaaSOnboardingForm />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
