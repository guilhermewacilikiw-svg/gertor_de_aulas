import { Shield } from 'lucide-react';

export default function PoliticaPrivacidade() {
  return (
    <div className="bg-[#0a0a0f] min-h-screen pt-32 pb-24 selection:bg-[#7D7AE8]/30 relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none"></div>
      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7D7AE8]/10 border border-[#7D7AE8]/20 mb-6">
            <Shield className="w-4 h-4 text-[#7D7AE8]" />
            <span className="text-xs font-black uppercase tracking-widest text-[#7D7AE8]">Documentação Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
            Política de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7D7AE8] to-[#C0E87A]">Privacidade</span>
          </h1>
          <p className="text-gray-400">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-p:text-gray-400 prose-headings:text-white prose-a:text-[#C0E87A] max-w-none">
          
          <h2 className="text-2xl font-bold mt-12 mb-4">1. Introdução</h2>
          <p className="mb-6 leading-relaxed">
            A <strong>Wakoda</strong> ("nós", "nosso" ou "Plataforma") está comprometida com a proteção e a privacidade dos seus dados pessoais. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos as informações de Escolas, Professores, Alunos e Visitantes, em conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018).
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">2. Dados que Coletamos</h2>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-400">
            <li><strong>Dados Cadastrais:</strong> Nome completo, e-mail, telefone, CPF/CNPJ (para escolas contratantes) e data de nascimento.</li>
            <li><strong>Dados de Uso:</strong> Informações de login, progresso de aulas (XP, níveis), conteúdos assistidos e histórico de avaliações.</li>
            <li><strong>Dados Técnicos:</strong> Endereço de IP, tipo de navegador, sistema operacional e cookies.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-4">3. Como Usamos seus Dados</h2>
          <p className="mb-6 leading-relaxed">
            Utilizamos as informações coletadas estritamente para as seguintes finalidades:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-400">
            <li>Fornecer, operar e manter os recursos da plataforma;</li>
            <li>Permitir que Escolas e Professores acompanhem o progresso didático de seus alunos;</li>
            <li>Garantir a segurança e prevenir fraudes;</li>
            <li>Enviar notificações importantes sobre atualizações ou alterações no serviço;</li>
            <li>Para os leads: entrar em contato caso tenha solicitado uma "Aula Experimental" ou "Criação de Conta".</li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-4">4. Compartilhamento de Dados</h2>
          <p className="mb-6 leading-relaxed">
            Nós <strong>não vendemos</strong> seus dados pessoais para terceiros. O compartilhamento de informações ocorre apenas:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-400">
            <li><strong>Entre o ecossistema da Escola:</strong> Dados de alunos são visíveis para os professores e gestores da <em>própria escola</em> na qual estão matriculados.</li>
            <li><strong>Com Fornecedores:</strong> Provedores de infraestrutura e hospedagem (ex: servidores em nuvem, banco de dados Supabase) que operam sob rígidos contratos de confidencialidade.</li>
            <li><strong>Por Requisito Legal:</strong> Se exigido por autoridades competentes mediante ordem judicial.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-4">5. Direitos do Titular (LGPD)</h2>
          <p className="mb-6 leading-relaxed">
            Você tem o direito de solicitar o acesso, a correção, a portabilidade e a exclusão dos seus dados pessoais. Caso você seja um aluno, recomendamos que solicite essas alterações inicialmente diretamente à administração da sua Escola, que é a Controladora dos seus dados primários dentro da Wakoda.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">6. Segurança da Informação</h2>
          <p className="mb-6 leading-relaxed">
            Utilizamos criptografia padrão de mercado, controles de acesso (Row Level Security - RLS) e protocolos seguros (HTTPS) para proteger suas informações contra acessos não autorizados. No entanto, nenhum sistema é 100% impenetrável. Recomendamos o uso de senhas fortes e exclusivas.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">7. Fale Conosco</h2>
          <p className="mb-6 leading-relaxed">
            Se você tiver qualquer dúvida sobre esta Política de Privacidade ou sobre como tratamos seus dados, entre em contato através do e-mail: <a href="mailto:comercial@wakoda.com.br" className="font-semibold hover:underline">comercial@wakoda.com.br</a>.
          </p>

        </div>
      </div>
    </div>
  );
}
