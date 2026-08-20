import { Shield } from 'lucide-react';

export default function TermosDeUso() {
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
            Termos de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7D7AE8] to-[#C0E87A]">Uso</span>
          </h1>
          <p className="text-gray-400">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-p:text-gray-400 prose-headings:text-white prose-a:text-[#C0E87A] max-w-none">
          
          <h2 className="text-2xl font-bold mt-12 mb-4">1. Aceitação dos Termos</h2>
          <p className="mb-6 leading-relaxed">
            Ao acessar e utilizar a plataforma <strong>Wakoda</strong> (doravante "Plataforma", "nós" ou "nosso"), você concorda em cumprir e vincular-se a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">2. Descrição do Serviço</h2>
          <p className="mb-6 leading-relaxed">
            A Wakoda é uma plataforma SaaS (Software as a Service) desenvolvida para a gestão e evolução de escolas de música. Oferecemos ferramentas para controle de turmas, registros diários, disponibilização de materiais EAD, acompanhamento de progresso (gamificação) e gestão administrativa.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">3. Contas de Usuário</h2>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-400">
            <li><strong>Escolas/Gestores:</strong> São responsáveis por gerenciar os acessos de seus professores e alunos, garantindo que o uso da plataforma esteja de acordo com as leis locais.</li>
            <li><strong>Professores:</strong> Possuem acesso para registrar aulas, avaliações e interagir com as turmas às quais foram designados.</li>
            <li><strong>Alunos/Responsáveis:</strong> Possuem acesso ao portal do aluno para visualizar progresso, aulas agendadas e consumir materiais EAD.</li>
          </ul>
          <p className="mb-6 leading-relaxed">
            Você é responsável por manter a confidencialidade de suas credenciais de acesso. Qualquer atividade realizada através da sua conta é de sua inteira responsabilidade.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">4. Propriedade Intelectual</h2>
          <p className="mb-6 leading-relaxed">
            Todo o código, design, interface, logotipos e textos pertencem à Wakoda. Os conteúdos educacionais (vídeos, partituras, PDFs) inseridos pelas Escolas e Professores pertencem exclusivamente a quem os publicou, sendo a Wakoda apenas a provedora da infraestrutura tecnológica de hospedagem.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">5. Limitação de Responsabilidade</h2>
          <p className="mb-6 leading-relaxed">
            A Wakoda se esforça para manter a plataforma online com 99.9% de uptime. No entanto, não nos responsabilizamos por perdas de dados, lucros cessantes ou interrupções temporárias causadas por manutenções ou fatores externos (força maior).
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">6. Cancelamento e Modificações</h2>
          <p className="mb-6 leading-relaxed">
            As Escolas assinantes podem cancelar seus planos a qualquer momento, respeitando as condições de faturamento do plano escolhido. A Wakoda reserva-se o direito de modificar, suspender ou descontinuar qualquer recurso da plataforma, notificando os usuários com antecedência razoável.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">7. Contato</h2>
          <p className="mb-6 leading-relaxed">
            Para dúvidas referentes a estes Termos de Uso, entre em contato através do e-mail: <a href="mailto:comercial@wakoda.com.br" className="font-semibold hover:underline">comercial@wakoda.com.br</a>.
          </p>

        </div>
      </div>
    </div>
  );
}
