import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a0f] text-gray-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-6">
            <p className="font-bebas text-3xl text-white">Wakoda</p>
            <p className="mt-3 text-sm text-gray-400 max-w-sm">
              Gestão de alunos, turmas e aulas para escolas de música, com um portal para o aluno estudar em casa.
            </p>
          </div>

          <nav aria-label="Produto" className="md:col-span-3">
            <h2 className="text-sm text-white mb-3">Produto</h2>
            <ul className="space-y-1 text-sm text-gray-400">
              <li><Link href="/#recursos" className="inline-flex items-center min-h-11 hover:text-white transition-colors">Recursos</Link></li>
              <li><Link href="/login" className="inline-flex items-center min-h-11 hover:text-white transition-colors">Entrar</Link></li>
              <li><Link href="/cadastro" className="inline-flex items-center min-h-11 hover:text-white transition-colors">Criar conta</Link></li>
            </ul>
          </nav>

          <nav aria-label="Legal e contato" className="md:col-span-3">
            <h2 className="text-sm text-white mb-3">Legal e contato</h2>
            <ul className="space-y-1 text-sm text-gray-400">
              <li><Link href="/legal/termos" className="inline-flex items-center min-h-11 hover:text-white transition-colors">Termos de uso</Link></li>
              <li><Link href="/legal/privacidade" className="inline-flex items-center min-h-11 hover:text-white transition-colors">Privacidade</Link></li>
              <li><a href="mailto:comercial@wakoda.com.br" className="inline-flex items-center min-h-11 hover:text-white transition-colors">comercial@wakoda.com.br</a></li>
            </ul>
          </nav>
        </div>

        <p className="mt-10 pt-6 border-t border-white/10 text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Wakoda. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
