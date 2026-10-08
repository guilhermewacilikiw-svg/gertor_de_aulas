import Link from 'next/link';
import { ArrowRight, Calendar, GraduationCap, Video, Check, Users } from 'lucide-react';

const BENEFICIOS = [
  {
    icone: GraduationCap,
    titulo: 'Diário de classe sem papel',
    texto: 'Registre presença, o que foi ensinado em cada aula e a evolução de cada aluno.',
  },
  {
    icone: Calendar,
    titulo: 'Agenda sem conflitos',
    texto: 'Veja os horários de todos os professores e turmas em uma só tela.',
  },
  {
    icone: Video,
    titulo: 'Portal para o aluno estudar em casa',
    texto: 'O aluno acessa vídeos, PDFs e o histórico das próprias aulas.',
  },
];

const RECURSOS = [
  {
    icone: GraduationCap,
    titulo: 'Gestão pedagógica',
    texto: 'Acompanhe o progresso musical de cada turma sem planilhas espalhadas.',
    itens: [
      'Diário de aula com resumo do que foi feito',
      'Controle de presença e faltas',
      'Avaliações com notas de 0 a 10 por critério',
    ],
  },
  {
    icone: Calendar,
    titulo: 'Calendário da escola',
    texto: 'Organize as grades dos professores e saiba quem dá aula, quando e em qual sala.',
    itens: [
      'Horários semanais por turma',
      'Visão da semana e do mês, com feriados nacionais',
      'Agenda própria para professor e aluno',
    ],
  },
  {
    icone: Users,
    titulo: 'Alunos, professores e turmas',
    texto: 'Cadastre quem faz parte da escola e organize em turmas e cursos.',
    itens: [
      'Cadastro individual ou importação por planilha (CSV)',
      'Turmas com limite de vagas e professor responsável',
      'Cursos organizados em módulos e aulas',
    ],
  },
];

export default function LandingPage() {
  return (
    <div className="bg-[#0a0a0f] min-h-screen selection:bg-red-500/30 font-sans text-white">
      {/* Início */}
      <section className="pt-32 sm:pt-40 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm text-red-400 mb-4">Para escolas de música e professores</p>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.1]">
            Organize sua escola de música em um só lugar
          </h1>
          <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
            Cadastre alunos, monte as turmas, controle a agenda dos professores e registre cada aula.
            O aluno ganha um portal para estudar em casa.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-3">
            <Link
              href="/cadastro"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 min-h-12 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium transition-colors"
            >
              Criar conta grátis
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/#recursos"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 min-h-12 rounded-lg border border-white/15 text-white hover:bg-white/5 transition-colors"
            >
              Ver o que o sistema faz
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-400">Sem cartão de crédito durante o período de testes.</p>
        </div>
      </section>

      {/* Benefícios */}
      <section id="beneficios" className="px-4 py-16 border-t border-white/10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {BENEFICIOS.map(({ icone: Icone, titulo, texto }) => (
            <div key={titulo}>
              <Icone className="w-6 h-6 text-red-500 mb-4" aria-hidden="true" />
              <h2 className="text-lg font-medium">{titulo}</h2>
              <p className="mt-2 text-gray-400">{texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recursos */}
      <section id="recursos" className="px-4 py-16 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">O que você encontra no sistema</h2>
          <p className="mt-3 text-gray-400 max-w-2xl">
            Cada perfil vê só o que precisa: a escola administra, o professor registra as aulas e o aluno acompanha o seu estudo.
          </p>

          <div className="mt-12 divide-y divide-white/10 border-t border-white/10">
            {RECURSOS.map(({ icone: Icone, titulo, texto, itens }) => (
              <div key={titulo} className="py-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                <div>
                  <Icone className="w-6 h-6 text-red-500 mb-4" aria-hidden="true" />
                  <h3 className="text-2xl font-semibold">{titulo}</h3>
                  <p className="mt-3 text-gray-400">{texto}</p>
                </div>
                <ul className="space-y-3 self-center">
                  {itens.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-gray-300">
                      <Check className="w-5 h-5 text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chamada final */}
      <section className="px-4 py-20 border-t border-white/10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">Pronto para testar na sua escola?</h2>
          <p className="mt-4 text-gray-300">
            Crie a conta, cadastre a primeira turma e veja como fica a rotina com tudo organizado.
          </p>
          <Link
            href="/cadastro"
            className="mt-8 inline-flex items-center justify-center gap-2 px-8 min-h-12 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium transition-colors"
          >
            Criar conta grátis
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
