import { Page, expect } from '@playwright/test';

export async function login(page: Page) {
  await page.goto('/login');
  
  // Credenciais de teste vêm do ambiente (nunca do código)
  const email = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;
  if (!email || !password) {
    throw new Error('Defina TEST_EMAIL e TEST_PASSWORD para rodar os testes e2e.');
  }
  
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  
  // Submit the form
  await page.click('button[type="submit"]');
  
  // Wait for the dashboard to load
  await expect(page).toHaveURL(/\/escola/);
  // Espera que algum texto chave carregue
  await expect(page.getByText('Alunos', { exact: false }).first()).toBeVisible({ timeout: 15000 });
}
