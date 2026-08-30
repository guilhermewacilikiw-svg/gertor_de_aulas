import { Page, expect } from '@playwright/test';

export async function login(page: Page) {
  await page.goto('/login');
  
  // Try to use environment variables for testing, otherwise fallback
  const email = process.env.TEST_EMAIL || 'admin@wakoda.com';
  const password = process.env.TEST_PASSWORD || 'senha123';
  
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  
  // Submit the form
  await page.click('button[type="submit"]');
  
  // Wait for the dashboard to load
  await expect(page).toHaveURL(/\/escola/);
  // Espera que algum texto chave carregue
  await expect(page.getByText('Alunos', { exact: false }).first()).toBeVisible({ timeout: 15000 });
}
