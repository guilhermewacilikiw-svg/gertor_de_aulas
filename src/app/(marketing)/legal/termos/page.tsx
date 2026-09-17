import { Shield, FileText, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function TermosDeUso() {
  return (
    <div className="bg-[#0a0a0f] min-h-screen pt-32 pb-24 selection:bg-red-600/30 relative overflow-hidden text-gray-300">
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none"></div>
      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="mb-14 border-b border-white/10 pb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 border border-red-600/20 mb-6">
            <Shield className="w-4 h-4 text-red-500" />
            <span className="text-xs font-black uppercase tracking-widest text-red-500">Documentação Legal &bull; Contrato de Licença</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight uppercase">
            Termos e Condições <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500">Gerais de Uso</span>
          </h1>
          <p className="text-sm text-gray-400">
            Regulamento contratual aplicável ao licenciamento e utilização da Plataforma Wakoda.
            <br />
            <strong>Última revisão e vigência:</strong> {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10 text-sm leading-relaxed text-gray-300">
          

          {/* 1. Definições */}
          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-wider mb-4 border-l-4 border-red-600 pl-3">
              1. Definições e Glossário Jurídico
            </h2>
            <p className="mb-3">Para os fins deste instrumento, consideram-se as seguintes definições:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li><strong>Plataforma / Software:</strong> Sistema tecnológico disponibilizado em modelo SaaS (Software as a Service), acessível via web, desenvolvido para otimização de gestão acadêmica, diário de classe, turmas, controle de frequência e avaliações em escolas e institutos de música.</li>
              <li><strong>Contratante / Escola:</strong> Entidade de ensino musical, pessoa jurídica (inscrita no CNPJ) ou pessoa física (inscrita no CPF) com capacidade jurídica e civil plena para contratar e representar legalmente o estabelecimento.</li>
              <li><strong>Usuários Vinculados:</strong> Indivíduos cadastrados sob a égide da Escola, incluindo administradores, gestores pedagógicos, professores e alunos (ou seus respectivos representantes legais, quando incapazes).</li>
              <li><strong>Conteúdo do Usuário:</strong> Todo e qualquer dado, partitura, cifra, áudio, vídeo, anotação pedagógica ou material didático inserido na Plataforma pela CONTRATANTE ou por seus Usuários Vinculados.</li>
            </ul>
          </section>

          {/* 2. Objeto e Licenciamento */}
          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-wider mb-4 border-l-4 border-red-600 pl-3">
              2. Objeto e Concessão da Licença de Uso
            </h2>
            <p className="mb-3">
              O objeto do presente contrato consiste na outorga, pela LICENCIANTE à CONTRATANTE, de uma licença de uso do software Wakoda, de caráter temporário, revogável, não exclusivo e intransferível, para fins estritos de gestão interna de sua respectiva escola ou instituto musical, vedada qualquer forma de sublicenciamento, cópia, cessão, empréstimo ou redistribuição comercial.
            </p>
            <p className="text-gray-400">
              Este instrumento não importa na cessão, transferência ou alienação do código-fonte, arquitetura, design, patentes ou quaisquer direitos de propriedade intelectual referentes à Plataforma, que permanecem de propriedade exclusiva da LICENCIANTE.
            </p>
          </section>

          {/* 3. Cadastro e Abertura via CPF ou CNPJ */}
          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-wider mb-4 border-l-4 border-red-600 pl-3">
              3. Cadastro, Veracidade e Representação Legal (CPF ou CNPJ)
            </h2>
            <p className="mb-3">
              3.1. A abertura de conta destina-se exclusivamente a instituições de ensino e gestores escolares, sendo expressamente facultada a contratação tanto por intermédio de <strong>Cadastro Nacional de Pessoas Jurídicas (CNPJ)</strong> quanto por <strong>Cadastro de Pessoas Físicas (CPF)</strong> do responsável e fundador da instituição.
            </p>
            <p className="mb-3">
              3.2. A CONTRATANTE declara e garante sob as penas da lei civil e penal que todos os dados fornecidos no ato do cadastro são autênticos, atuais e fidedignos, assumindo total e irrestrita responsabilidade por sua veracidade.
            </p>
            <p>
              3.3. As credenciais de autenticação (login e senha) são de uso estritamente pessoal e confidencial. A CONTRATANTE é a única responsável pela guarda, confidencialidade e eventuais danos decorrentes do extravio ou uso não autorizado de suas senhas de acesso.
            </p>
          </section>

          {/* 4. Responsabilidade sobre Alunos e Menores */}
          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-wider mb-4 border-l-4 border-red-600 pl-3">
              4. Gestão de Alunos, Avaliações e Menores de Idade
            </h2>
            <p className="mb-3">
              4.1. Na qualidade de instituição de ensino, a CONTRATANTE é a única e exclusiva responsável pela relação jurídica, pedagógica e financeira mantida com seus alunos e respectivos professores.
            </p>
            <p className="mb-3">
              4.2. Tratando-se de alunos menores de 18 (dezoito) anos de idade, incumbe à CONTRATANTE obter a autorização e o consentimento expresso dos pais ou responsáveis legais para o tratamento de seus dados cadastrais e acadêmicos no sistema, em estrito cumprimento ao Artigo 14 da Lei nº 13.709/2018 (Lei Geral de Proteção de Dados - LGPD).
            </p>
            <p>
              4.3. As notas, registros de faltas e avaliações didáticas inseridas na Plataforma refletem exclusivamente os critérios pedagógicos adotados pelos docentes e gestores da própria Escola, eximindo a LICENCIANTE de qualquer responsabilidade sobre controvérsias de natureza acadêmica.
            </p>
          </section>

          {/* 5. Propriedade Intelectual dos Conteúdos Didáticos */}
          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-wider mb-4 border-l-4 border-red-600 pl-3">
              5. Propriedade Intelectual e Direitos Autorais
            </h2>
            <p className="mb-3">
              5.1. A LICENCIANTE é titular soberana de todos os direitos autorais, de marcas e patentes incidentes sobre o software Wakoda, nos moldes da Lei Federal nº 9.609/1998 (Lei do Software) e da Lei Federal nº 9.610/1998 (Lei de Direitos Autorais).
            </p>
            <p>
              5.2. Em contrapartida, os conteúdos didáticos, gravações em vídeo, partituras, tablaturas e apostilas disponibilizados pelas Escolas e Professores a seus alunos continuam pertencendo integralmente aos seus respectivos titulares, cabendo à CONTRATANTE assegurar que detém as licenças ou autorizações autorais cabíveis sobre as obras musicais veiculadas.
            </p>
          </section>

          {/* 6. Nível de Serviço (SLA) e Limitação de Responsabilidade */}
          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-wider mb-4 border-l-4 border-red-600 pl-3">
              6. Disponibilidade, Manutenção e Limitação de Responsabilidade
            </h2>
            <p className="mb-3">
              6.1. A LICENCIANTE envidará seus melhores esforços técnicos para assegurar a continuidade operacional e a estabilidade da Plataforma. Todavia, a CONTRATANTE reconhece que nenhum software está imune a interrupções decorrentes de falhas nas redes de telecomunicações, servidores de nuvem de terceiros, casos fortuitos ou eventos de força maior (art. 393 do Código Civil).
            </p>
            <p>
              6.2. Em nenhuma hipótese a LICENCIANTE responderá por lucros cessantes, perdas financeiras indiretas, danos morais ou prejuízos advindos de desavenças comerciais havidas entre a Escola e seus respectivos matriculados.
            </p>
          </section>

          {/* 7. Condutas Proibidas */}
          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-wider mb-4 border-l-4 border-red-600 pl-3">
              7. Práticas Vedadas e Condutas Ilícitas
            </h2>
            <p className="mb-3">É expressamente defeso à CONTRATANTE e a seus Usuários Vinculados:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li>Praticar atos de engenharia reversa, descompilação ou decodificação do código-fonte da Plataforma;</li>
              <li>Empregar robôs, spiders, crawlers ou scripts automatizados para raspagem ou extração de dados;</li>
              <li>Inserir ou disseminar códigos maliciosos, vírus, trojans ou qualquer mecanismo apto a corromper a infraestrutura da Plataforma;</li>
              <li>Utilizar a Plataforma para difusão de conteúdo ilícito, difamatório, pornográfico ou violador de direitos humanos.</li>
            </ul>
          </section>

          {/* 8. Rescisão e Descontinuidade */}
          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-wider mb-4 border-l-4 border-red-600 pl-3">
              8. Rescisão, Cancelamento e Retenção de Informações
            </h2>
            <p className="mb-3">
              8.1. A CONTRATANTE poderá solicitar a descontinuidade do uso da Plataforma a qualquer momento mediante canal oficial de suporte.
            </p>
            <p>
              8.2. A LICENCIANTE reserva-se a prerrogativa de suspender cautelarmente ou rescindir o presente contrato, de pleno direito e independentemente de notificação prévia, em caso de violação de quaisquer das obrigações aqui pactuadas ou suspeita fundamentada de fraude.
            </p>
          </section>

          {/* 9. Disposições Finais e Foro */}
          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-wider mb-4 border-l-4 border-red-600 pl-3">
              9. Disposições Gerais e Foro de Eleição
            </h2>
            <p className="mb-3">
              9.1. A tolerância de uma parte para com a outra relativamente ao descumprimento de qualquer disposição não configurará renúncia a direitos nem novação contratual.
            </p>
            <p className="mb-3">
              9.2. A LICENCIANTE poderá modificar este instrumento a qualquer tempo visando à adequação normativa ou ao aperfeiçoamento de seus serviços, conferindo ampla divulgação aos termos aditados.
            </p>
            <p className="mb-4">
              9.3. Para dirimir quaisquer litígios ou controvérsias oriundas do presente contrato, as partes elegem, com renúncia expressa a qualquer outro por mais privilegiado que seja, o <strong>Foro da Comarca do domicílio da CONTRATANTE</strong> (ou do Foro Central da Capital do Estado de sede da Licenciante), aplicando-se integralmente a legislação vigente na República Federativa do Brasil.
            </p>
          </section>

          {/* Canal de Atendimento */}
          <section className="border-t border-white/10 pt-6">
            <p className="text-xs text-gray-400">
              Questões contratuais, notificações formais e esclarecimentos jurídicos deverão ser endereçados ao Departamento Jurídico através do e-mail oficial: <a href="mailto:comercial@wakoda.com.br" className="text-red-400 font-bold hover:underline">comercial@wakoda.com.br</a>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
