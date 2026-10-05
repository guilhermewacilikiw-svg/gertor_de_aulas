# Wakoda — gestão de escolas de música

Next.js 16 (App Router) + Supabase + Tailwind 4. Portais: escola, professor, aluno e master.

## Rodando

```bash
cp .env.example .env.local   # preencha as variáveis
npm install
npm run dev                  # http://localhost:3000
```

## Variáveis de ambiente

Veja `.env.example`. `SUPABASE_SERVICE_ROLE_KEY` e `BILLING_WEBHOOK_SECRET` são secretas e só usadas no servidor.

## Banco

Os scripts `setup_*.sql` na raiz criam as políticas (RLS) e funções (`admin_create_student`, etc.). Aplique-os no SQL Editor do Supabase.

## Segurança

- `src/proxy.ts` exige login nas áreas `/escola`, `/professor`, `/aluno`, `/master` e força a troca da senha temporária.
- Cada layout valida o papel do usuário (`requireRole` em `src/lib/auth.ts`).
- Senhas temporárias de alunos/professores são aleatórias e exibidas uma única vez ao administrador.
- Webhook de cobrança (`/api/webhooks/billing`) exige o cabeçalho com `BILLING_WEBHOOK_SECRET`.

## Testes e2e

```bash
TEST_EMAIL=... TEST_PASSWORD=... npm run test:e2e
```
