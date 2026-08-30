import { test, expect } from '@playwright/test';

test('A página de login deve carregar e exibir os elementos principais', async ({ page }) => {
  // Navega até a página de login
  await page.goto('/login');

  // Verifica se a palavra 'Wakoda' está na tela, que é a marca do sistema
  await expect(page.getByText('Wakoda', { exact: false }).first()).toBeVisible();

  // Verifica se o formulário de login está presente (campos de email e senha)
  const emailInput = page.locator('input[type="email"]');
  const passwordInput = page.locator('input[type="password"]');
  const submitButton = page.locator('button[type="submit"]');

  await expect(emailInput).toBeVisible({ timeout: 10000 });
  await expect(passwordInput).toBeVisible();
  await expect(submitButton).toBeVisible();
});
