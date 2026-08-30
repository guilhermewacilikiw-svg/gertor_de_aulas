import { test, expect } from '@playwright/test';
import { login } from './utils/auth';

test.describe('Dashboard & Navegação E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Realiza o login antes de cada teste no bloco
    await login(page);
  });

  test('Deve carregar o dashboard corretamente', async ({ page }) => {
    // Verifica elementos chaves do dashboard
    await expect(page.getByText('Estatísticas Visão Geral', { exact: false }).first()).toBeVisible();
    await expect(page.getByText('Receita Mensal', { exact: false }).first()).toBeVisible();
    await expect(page.getByText('Alunos Ativos', { exact: false }).first()).toBeVisible();
  });

  test('Deve navegar pelas páginas principais pela Sidebar sem erro', async ({ page }) => {
    // Clica no menu Alunos e verifica se carregou
    await page.getByRole('link', { name: 'Alunos' }).first().click();
    await expect(page).toHaveURL(/\/escola\/alunos/);
    await expect(page.getByRole('heading', { name: 'Alunos', exact: true }).first()).toBeVisible();

    // Clica no menu Financeiro e verifica se carregou
    await page.getByRole('link', { name: 'Financeiro' }).first().click();
    await expect(page).toHaveURL(/\/escola\/financeiro/);
    await expect(page.getByRole('heading', { name: 'Financeiro', exact: true }).first()).toBeVisible();

    // Clica no menu Turmas e verifica se carregou
    await page.getByRole('link', { name: 'Turmas' }).first().click();
    await expect(page).toHaveURL(/\/escola\/turmas/);
    await expect(page.getByRole('heading', { name: 'Turmas', exact: true }).first()).toBeVisible();
  });
});
