# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: turmas.spec.ts >> Turmas e Horários E2E >> Deve ser possível navegar para os detalhes de uma turma e visualizar o cronograma
- Location: tests\turmas.spec.ts:17:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/escola/
Received string:  "http://localhost:3000/login"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    13 × locator resolved to <html lang="pt-BR" class="h-full antialiased inter_fe8b9d92-module__LINzvG__variable font-sans space_grotesk_a4177b3f-module__DCxVEW__variable bebas_neue_ffe4809a-module__AVAZlq__variable dark">…</html>
       - unexpected value "http://localhost:3000/login"

```

```yaml
- link "Voltar":
  - /url: /
- link "Wakoda Logo Wakoda":
  - /url: /
  - img "Wakoda Logo"
  - text: Wakoda
- heading "Acesso ao Sistema" [level=2]
- paragraph: Selecione seu perfil para entrar
- button "Escola"
- button "Prof"
- button "Aluno"
- text: SECURE_LOGIN
- paragraph: E-mail ou senha incorretos.
- text: E-mail
- textbox "E-mail":
  - /placeholder: seu@email.com
- text: Senha
- textbox "Senha":
  - /placeholder: ••••••••
- checkbox "Lembrar de mim"
- text: Lembrar de mim
- link "Esqueci minha senha":
  - /url: "#"
- button "ENTRAR"
- paragraph:
  - text: Não tem uma conta?
  - link "Cadastre sua escola":
    - /url: /cadastro
- paragraph:
  - text: Precisa de ajuda?
  - link "Fale com o suporte":
    - /url: mailto:suporte@wakoda.com.br
- alert
```

# Test source

```ts
  1  | import { Page, expect } from '@playwright/test';
  2  | 
  3  | export async function login(page: Page) {
  4  |   await page.goto('/login');
  5  |   
  6  |   // Try to use environment variables for testing, otherwise fallback
  7  |   const email = process.env.TEST_EMAIL || 'admin@wakoda.com';
  8  |   const password = process.env.TEST_PASSWORD || 'senha123';
  9  |   
  10 |   await page.fill('input[type="email"]', email);
  11 |   await page.fill('input[type="password"]', password);
  12 |   
  13 |   // Submit the form
  14 |   await page.click('button[type="submit"]');
  15 |   
  16 |   // Wait for the dashboard to load
> 17 |   await expect(page).toHaveURL(/\/escola/);
     |                      ^ Error: expect(page).toHaveURL(expected) failed
  18 |   // Espera que algum texto chave carregue
  19 |   await expect(page.getByText('Alunos', { exact: false }).first()).toBeVisible({ timeout: 15000 });
  20 | }
  21 | 
```