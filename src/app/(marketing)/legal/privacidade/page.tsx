import { Shield, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function PoliticaPrivacidade() {
  return (
    <div className="bg-[#0a0a0f] min-h-screen pt-32 pb-24 selection:bg-red-600/30 relative overflow-hidden text-gray-300">
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none"></div>
      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="mb-14 border-b border-white/10 pb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 border border-red-600/20 mb-6">
            <Lock className="w-4 h-4 text-red-500" />
            <span className="text-xs font-black uppercase tracking-widest text-red-500">Privacidade &bull; Conformidade LGPD</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight uppercase">
            Política de <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500">Privacidade</span>
          </h1>
          <p className="text-sm text-gray-400">
            Diretrizes de Governança, Proteção de Dados e Tratamento de Informações Pessoais (Lei Federal nº 13.709/2018 - LGPD).
            <br />
            <strong>Última revisão e vigência:</strong> {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10 text-sm leading-relaxed text-gray-300">
          
          {/* Preâmbulo */}
          <section className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <p className="text-gray-200">
              A <strong>WAKODA</strong> (doravante denominada <strong>"Plataforma"</strong> ou <strong>"Operadora"</strong>) reafirma seu compromisso inegociável com a segurança da informação, a privacidade e a proteção integral dos dados pessoais de seus clientes, parceiros, gestores, docentes e discentes, pautando suas operações pelas normas da <strong>Lei Geral de Proteção de Dados Pessoais (Lei Federal nº 13.709/2018 - "LGPD")</strong>, pelo <strong>Marco Civil da Internet (Lei Federal nº 12.965/2014)</strong> e pelas disposições constitucionais de proteção à intimidade e autodeterminação informativa.
            </p>
          </section>

          {/* 1. Agentes de Tratamento */}
          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-wider mb-4 border-l-4 border-red-600 pl-3">
              1. Enquadramento e Agentes de Tratamento
            </h2>
            <p className="mb-3">
              Nos moldes preconizados pelo Artigo 5º da LGPD, a qualificação das partes na relação de tratamento de dados se estabelece da seguinte forma:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li>
                <strong>A Escola / Instituição Contratante:</strong> Atua precipuamente como <strong>CONTROLADORA</strong> dos dados pessoais relativos aos seus professores, alunos e respectivos responsáveis legais. É da Escola a competência sobre as decisões referentes ao tratamento de dados, à coleta originária de consentimentos e à veracidade das matrículas inseridas no sistema.
              </li>
              <li>
                <strong>A Wakoda:</strong> Atua na condição de <strong>OPERADORA</strong> ao processar, armazenar e disponibilizar a infraestrutura técnica para hospedar os dados acadêmicos sob estritas instruções da Escola; e atua como <strong>CONTROLADORA</strong> única e exclusivamente no tocante aos dados cadastrais e de faturamento da própria instituição de ensino contratante.
              </li>
            </ul>
          </section>

          {/* 2. Bases Legais */}
          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-wider mb-4 border-l-4 border-red-600 pl-3">
              2. Bases Legais do Tratamento (Art. 7º da LGPD)
            </h2>
            <p className="mb-3">
              As operações de tratamento de dados realizadas pela Plataforma encontram respaldo irrestrito nas seguintes hipóteses autorizativas legais:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li><strong>Execução de Contrato (Art. 7º, V):</strong> Necessária para o cumprimento das obrigações contratuais pactuadas nos Termos de Uso e prestação dos serviços de gestão escolar;</li>
              <li><strong>Cumprimento de Obrigação Legal e Regulatória (Art. 7º, II):</strong> Para manutenção de registros obrigatórios de conexão (Artigo 15 do Marco Civil da Internet) e atendimento a ordens judiciais;</li>
              <li><strong>Legítimo Interesse (Art. 7º, IX):</strong> Para aprimoramento contínuo da segurança cibernética, prevenção contra fraudes e suporte técnico aos gestores;</li>
              <li><strong>Consentimento do Titular ou Responsável Legal (Art. 7º, I e Art. 14, §1º):</strong> Obtido pela Escola no ato da matrícula ou do cadastro do aluno.</li>
            </ul>
          </section>

          {/* 3. Dados Coletados */}
          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-wider mb-4 border-l-4 border-red-600 pl-3">
              3. Categorias de Dados Pessoais Tratados
            </h2>
            <p className="mb-3">Para a consecução de suas finalidades específicas, a Plataforma trata as seguintes categorias de informações:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <h4 className="font-bold text-white mb-2 text-xs uppercase text-red-400">A. Dados da Escola & Gestores</h4>
                <p className="text-xs text-gray-400">
                  Nome da instituição, razão social, número de inscrição no <strong>CNPJ ou CPF</strong> do gestor responsável, nome completo, endereço de e-mail institucional, telefone de contato e credenciais de acesso criptografadas.
                </p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <h4 className="font-bold text-white mb-2 text-xs uppercase text-red-400">B. Dados Acadêmicos dos Alunos</h4>
                <p className="text-xs text-gray-400">
                  Nome do discente, e-mail, telefone, turma matriculada, instrumentos estudados, registros de presença em aula, notas avaliativas (escala de 0 a 10), comentários didáticos de evolução musical e histórico pedagógico.
                </p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <h4 className="font-bold text-white mb-2 text-xs uppercase text-red-400">C. Dados do Corpo Docente</h4>
                <p className="text-xs text-gray-400">
                  Nome do professor, e-mail de acesso, especialidade instrumental, carga horária de aulas atribuídas e anotações didáticas lançadas no diário de classe.
                </p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <h4 className="font-bold text-white mb-2 text-xs uppercase text-red-400">D. Dados Técnicos de Conexão</h4>
                <p className="text-xs text-gray-400">
                  Endereço IP de origem, data e horário de acesso, porta lógica, identificadores de sessão e logs de segurança mantidos conforme imposição do Art. 15 da Lei nº 12.965/2014.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Proteção de Menores de Idade */}
          <section className="border border-red-500/20 bg-red-950/10 p-6 rounded-2xl">
            <h2 className="text-xl font-black text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-500" />
              4. Tratamento de Dados de Crianças e Adolescentes (Art. 14 da LGPD)
            </h2>
            <p className="text-gray-300 mb-3">
              4.1. Ciente de que o ensino de música atende amplamente o público infantojuvenil, a Wakoda estabelece salvaguardas rigorosas para que o tratamento de dados de menores de 18 anos ocorra sempre no seu <strong>melhor interesse</strong>, com finalidade exclusivamente pedagógica.
            </p>
            <p className="text-gray-400 text-xs">
              4.2. É obrigação legal da Escola Contratante colher e arquivar a expressa autorização ou consentimento dos pais ou responsáveis legais antes do cadastramento de alunos menores na Plataforma, eximindo a Wakoda de responsabilidade caso a Escola descumpra referida obrigação regulatória.
            </p>
          </section>

          {/* 5. Não Comercialização e Compartilhamento */}
          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-wider mb-4 border-l-4 border-red-600 pl-3">
              5. Compartilhamento Restrito e Vedação de Comercialização
            </h2>
            <p className="mb-3">
              A Wakoda <strong>NÃO VENDE, NÃO ALUGA E NÃO MONETIZA</strong> dados pessoais sob qualquer pretexto. O compartilhamento ocorre única e exclusivamente nas seguintes hipóteses estritas:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li><strong>No âmbito do ecossistema da própria Escola:</strong> Os dados do aluno são visualizados apenas pelos gestores e professores autorizados da instituição em que está matriculado;</li>
              <li><strong>Subprocessadores de Infraestrutura em Nuvem:</strong> Provedores líderes de computação e banco de dados (ex: Supabase, Amazon Web Services - AWS), submetidos a rigorosos padrões contratuais de confidencialidade e segurança ISO/IEC 27001 e SOC 2;</li>
              <li><strong>Determinação Legal ou Judicial:</strong> Mediante requerimento formal de autoridades competentes, órgãos de persecução criminal ou ordem emanada do Poder Judiciário.</li>
            </ul>
          </section>

          {/* 6. Segurança da Informação */}
          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-wider mb-4 border-l-4 border-red-600 pl-3">
              6. Medidas Técnicas e Administrativas de Segurança
            </h2>
            <p className="mb-3">
              Adotamos salvaguardas técnicas avançadas para proteger os dados sob nossa custódia contra acessos não autorizados, extravio, destruição, alteração ou qualquer modalidade de tratamento inadequado:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li>Criptografia de ponta a ponta em trânsito através de protocolos SSL/TLS (HTTPS com certificados de alta segurança);</li>
              <li>Criptografia de dados sensíveis e credenciais de acesso em repouso (hashing com salt criptográfico);</li>
              <li>Isolamento lógico estrito entre bases de dados (Row Level Security - RLS), impedindo que dados de uma escola sejam acessados por qualquer outra instituição;</li>
              <li>Monitoramento automatizado contra tentativas de intrusão e ataques de força bruta.</li>
            </ul>
          </section>

          {/* 7. Direitos do Titular de Dados */}
          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-wider mb-4 border-l-4 border-red-600 pl-3">
              7. Direitos dos Titulares de Dados (Art. 18 da LGPD)
            </h2>
            <p className="mb-3">
              Os titulares de dados pessoais têm o direito de requisitar a qualquer momento, mediante solicitação expressa:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li>A confirmação da existência de tratamento e o acesso facilitado aos seus dados;</li>
              <li>A retificação ou correção de dados incompletos, inexatos ou desatualizados;</li>
              <li>A anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade com a lei;</li>
              <li>A portabilidade dos dados a outro fornecedor de serviço, respeitados os segredos comerciais e industriais;</li>
              <li>A revogação do consentimento concedido, nos termos do § 5º do Artigo 8º da LGPD.</li>
            </ul>
            <p className="text-xs text-gray-400 mt-3">
              <em>Nota ao Aluno:</em> Como a sua Escola é a Controladora originária do seu cadastro acadêmico, solicitações de retificação de notas ou cancelamento de matrícula devem ser direcionadas prioritariamente à secretaria da sua respectiva instituição de ensino.
            </p>
          </section>

          {/* 8. Retenção e Descarte */}
          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-wider mb-4 border-l-4 border-red-600 pl-3">
              8. Retenção e Descarte dos Dados Pessoais
            </h2>
            <p className="mb-3">
              Os dados pessoais serão conservados enquanto perdurar o vínculo contratual entre a Escola e a Plataforma, ou pelo período estritamente necessário para o cumprimento de prazos prescricionais civis, fiscais e obrigações legais de guarda (como o prazo obrigatório de 6 meses para logs de conexão, previsto no Artigo 15 do Marco Civil da Internet). Após findos tais prazos, os dados serão descartados de forma segura ou devidamente anonimizados.
            </p>
          </section>

          {/* 9. Canal do Encarregado de Dados (DPO) */}
          <section className="border-t border-white/10 pt-6">
            <h2 className="text-xl font-black text-white uppercase tracking-wider mb-3 border-l-4 border-red-600 pl-3">
              9. Canal de Atendimento do Encarregado (DPO)
            </h2>
            <p className="text-gray-300 text-xs leading-relaxed">
              Para o exercício de qualquer dos direitos previstos na LGPD, esclarecimentos sobre esta Política de Privacidade ou reporte de incidentes de segurança, favor contatar o Encarregado pelo Tratamento de Dados Pessoais (DPO) pelo e-mail:
              <br />
              <a href="mailto:comercial@wakoda.com.br" className="text-red-400 font-bold hover:underline text-sm mt-1 inline-block">
                comercial@wakoda.com.br
              </a>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
