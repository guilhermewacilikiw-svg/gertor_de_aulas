# Plano de crescimento — Wakoda (gestão de escolas de música)

Baseado no que o código já tem hoje. Itens marcados com [código] foram verificados no repositório.

## Ponto de partida

- Portais de escola, professor e aluno funcionando, com Supabase (login, regras de acesso por escola, migrações). [código]
- Planos `solo`, `stage` e `festival` já modelados, com limite de alunos e de professores. [código: `src/lib/saas/limits.ts`]
- Teste grátis de 14 dias previsto no cadastro, mas desligado: `trial_ends_at` fica nulo e o banner de cobrança está desativado. [código: `src/app/cadastro/actions.ts`, `TrialBanner.tsx`]
- Webhook de cobrança (Asaas ou Stripe) existe, mas é um esqueleto que só registra o evento. [código: `src/app/api/webhooks/billing/route.ts`]
- Captação de leads: formulário de cadastro com envio para Google Sheets. [código: `src/lib/services/sheets.ts`]
- Assistente de IA para o aluno e página de planos que redireciona para o cadastro. [código]

## O que impede de cobrar e escalar (corrigir antes de divulgar)

1. **Limites de plano estão desligados no modo de teste.** `checkSchoolLimit` já é chamada ao cadastrar aluno, professor e na importação por CSV, mas devolvia sempre "ilimitado". **Feito:** agora ela só deixa de limitar enquanto a variável `BILLING_ENFORCED` não for `true`. No lançamento basta definir `BILLING_ENFORCED=true` (e ter planos e `subscription_status` corretos nas escolas).
2. **Senha temporária fixa `senha123`.** **Feito:** cada aluno e professor novo recebe uma senha aleatória, mostrada uma única vez à escola (com botão de copiar). A importação por CSV gera uma senha por aluno e oferece o arquivo `senhas-temporarias.csv` para baixar. Falta o envio por e-mail (convite) quando houver serviço de e-mail configurado.
3. **Cobrança não implementada.** Falta criar a assinatura no gateway, tela de plano e fatura na escola, e tratar atraso e cancelamento no webhook.
4. **Banco misturando teste e produção.** Existem alunos de teste na base real. Criar um projeto Supabase só para testes e rodar os testes de ponta a ponta nele.
5. **Testes automáticos desatualizados.** Os testes em `tests/` ainda cobrem o módulo financeiro que foi removido e dependem de uma conta fixa. Atualizar e rodar a cada mudança.
6. **Erros 406 e contagens erradas no painel do professor** (turmas e aulas contadas por escola, não por professor). Corrigir antes de colocar professores reais.
7. **Observabilidade:** sem registro de erros nem métricas de uso. Adicionar Sentry (ou similar) e eventos básicos.

## Fase 1 — Base sólida (semanas 1 a 3)

Progresso: [x] senha aleatória, [x] interruptor dos limites de plano, [x] limite também na importação por CSV, [ ] ambiente de teste separado, [ ] testes de ponta a ponta atualizados, [ ] painel do professor (aulas), [ ] telas restantes no novo visual, [ ] convite por e-mail.

- Aplicar os limites de plano no cadastro de aluno e de professor, com mensagem clara e convite para mudar de plano.
- Substituir a senha fixa por convite por e-mail.
- Ambiente de teste separado e testes de ponta a ponta atualizados.
- Corrigir o painel do professor e os números do dashboard.
- Terminar os ajustes visuais das telas que faltam (detalhes de turma e curso, portal do aluno).
- Backup e política de privacidade revisada (dados de alunos, inclusive menores de idade, pedem atenção à LGPD).

## Fase 2 — Cobrança (semanas 4 a 6)

- Escolher o gateway (Asaas é o mais simples para Pix e boleto no Brasil).
- Reativar o teste de 14 dias e o banner de contagem regressiva.
- Tela "Assinatura" na escola: plano atual, uso, troca de plano, faturas.
- Completar o webhook: pagamento confirmado, atraso (carência de alguns dias) e cancelamento.
- Página pública de planos com preços (hoje ela redireciona para o cadastro).

## Fase 3 — Primeiros clientes (semanas 6 a 10)

- Piloto com 5 a 10 escolas conhecidas, com acompanhamento próximo e acesso gratuito em troca de feedback semanal.
- Importação de alunos por CSV (já existe) com modelo de planilha para baixar.
- Onboarding guiado em 3 passos: cadastrar curso, cadastrar professor, cadastrar a primeira turma.
- Canal de suporte no WhatsApp (já há link no aviso da versão beta) e meta de resposta em um dia útil.
- Coletar depoimentos e números reais (aulas registradas, tempo economizado).

## Fase 4 — Aquisição (a partir da semana 10)

- Site com a proposta clara: "agenda, diário de classe e portal do aluno para escola de música", com demonstração em vídeo curto.
- Conteúdo para professores e donos de escola (agenda sem conflitos, controle de presença, comunicação com pais).
- Parcerias com lojas de instrumentos, associações e grupos de professores de música.
- Indicação: mês grátis para a escola que indicar outra.
- Anúncios locais só depois de ter taxa de conversão do teste grátis conhecida.

## Fase 5 — Produto que retém (contínuo)

- Cobrança de mensalidades dos alunos pela escola (o módulo financeiro foi removido; reavaliar com base no pedido dos clientes).
- Avisos automáticos por WhatsApp e e-mail (aula marcada, falta, material novo).
- Relatórios para o dono da escola: frequência, evasão, ocupação das turmas.
- Aplicativo ou versão instalável (PWA) para professor e aluno no celular.
- IA como diferencial: resumo de aula, plano de estudo e feedback ao aluno, com limite por plano para controlar custo.

## Indicadores para acompanhar

| Indicador | Por que importa |
|---|---|
| Escolas cadastradas por semana | Aquisição |
| % de escolas que cadastram aluno, professor e turma em 7 dias | Ativação |
| % do teste grátis que vira assinatura | Conversão |
| Escolas ativas na semana (login + aula registrada) | Uso real |
| Cancelamentos por mês | Retenção |
| Receita mensal recorrente (MRR) e custo por escola | Saúde do negócio |

## Riscos

- Dados de menores de idade: LGPD, termos e consentimento dos responsáveis.
- Dependência de um único Supabase: planejar backup, limites do plano e custos ao crescer.
- Custo de IA crescendo mais rápido que a receita: limitar uso por plano.
- Suporte consumindo todo o tempo: documentar respostas comuns e criar uma central de ajuda simples.

## Decisões que dependem de você

1. Preços e limites de cada plano (Solo, Stage, Festival).
2. Gateway de pagamento.
3. Público inicial: escolas pequenas (até 50 alunos) ou professores autônomos.
4. Se vai cobrar mensalidade dos alunos dentro da plataforma no futuro.
