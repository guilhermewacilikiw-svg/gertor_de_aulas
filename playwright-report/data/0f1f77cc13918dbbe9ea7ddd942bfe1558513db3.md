# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard.spec.ts >> Dashboard & Navegação E2E >> Deve navegar pelas páginas principais pela Sidebar sem erro
- Location: tests\dashboard.spec.ts:17:7

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://localhost:3000/login", waiting until "load"

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - link "Voltar" [ref=e4] [cursor=pointer]:
    - /url: /
  - generic [ref=e7]:
    - link "Wakoda Logo Wakoda" [ref=e9] [cursor=pointer]:
      - /url: /
      - img "Wakoda Logo" [ref=e11]
      - generic [ref=e12]: Wakoda
    - heading "Acesso ao Sistema" [level=2] [ref=e13]
    - paragraph [ref=e14]: Selecione seu perfil para entrar
  - generic [ref=e15]:
    - generic [ref=e16]:
      - button "Escola" [ref=e17]
      - button "Prof" [ref=e22]
      - button "Aluno" [ref=e26]
    - generic [ref=e32]:
      - generic [ref=e33]: SECURE_LOGIN
      - generic [ref=e34]:
        - generic [ref=e35]:
          - generic [ref=e36]: E-mail
          - textbox "E-mail" [ref=e38]:
            - /placeholder: seu@email.com
        - generic [ref=e39]:
          - generic [ref=e40]: Senha
          - textbox "Senha" [ref=e42]:
            - /placeholder: ••••••••
        - generic [ref=e43]:
          - generic [ref=e44]:
            - checkbox "Lembrar de mim" [ref=e45]
            - generic [ref=e46]: Lembrar de mim
          - link "Esqueci minha senha" [ref=e48] [cursor=pointer]:
            - /url: "#"
        - button "ENTRAR" [ref=e50]
    - paragraph [ref=e54]:
      - text: Não tem uma conta?
      - link "Cadastre sua escola" [ref=e55] [cursor=pointer]:
        - /url: /cadastro
    - paragraph [ref=e56]:
      - text: Precisa de ajuda?
      - link "Fale com o suporte" [ref=e57] [cursor=pointer]:
        - /url: mailto:suporte@wakoda.com.br
```

# Test source

```ts
  1  | import { Page, expect } from '@playwright/test';
  2  | 
  3  | export async function login(page: Page) {
> 4  |   await page.goto('/login');
     |              ^ Error: page.goto: Test timeout of 30000ms exceeded.
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
  17 |   await expect(page).toHaveURL(/\/escola/);
  18 |   // Espera que algum texto chave carregue
  19 |   await expect(page.getByText('Alunos', { exact: false }).first()).toBeVisible({ timeout: 15000 });
  20 | }
  21 | 
```