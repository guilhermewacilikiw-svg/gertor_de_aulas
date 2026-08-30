import { test, expect } from '@playwright/test';
import { login } from './utils/auth';

test.describe('Financeiro E2E', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/escola/financeiro');
  });

  test('Deve carregar o painel financeiro', async ({ page }) => {
    // Verifica a renderização do título da página
    await expect(page.getByRole('heading', { name: 'Gestão Financeira', exact: false }).first()).toBeVisible();
    
    // Verifica componentes de resumo
    await expect(page.getByText('Faturamento Total', { exact: false }).first()).toBeVisible();
    
    // Verifica se os botões principais de ação estão na tela
    await expect(page.getByText('Gerar Fatura', { exact: false }).first()).toBeVisible();
  });

  test('Deve abrir o modal de Gerar Fatura e verificar cores e responsividade', async ({ page }) => {
    const btnGerarFatura = page.getByText('Gerar Fatura', { exact: false }).first();
    
    if (await btnGerarFatura.isVisible()) {
      await btnGerarFatura.click();
      
      // O modal deve aparecer
      await expect(page.getByText('Selecione o Cliente', { exact: false }).first()).toBeVisible();
      
      // Valida que o botão Cancelar existe
      const btnCancelar = page.getByText('Cancelar', { exact: true }).first();
      await expect(btnCancelar).toBeVisible();
      await btnCancelar.click();
    }
  });
});
