import { test, expect } from '@playwright/test';
import { login } from './utils/auth';

test.describe('Turmas e Horários E2E', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    // Navega para a aba de turmas
    await page.goto('/escola/turmas');
  });

  test('Deve carregar a listagem de turmas', async ({ page }) => {
    // Verifica se a página de turmas renderizou e o botão de criar existe
    await expect(page.getByRole('heading', { name: 'Turmas' }).first()).toBeVisible();
    await expect(page.getByText('Nova Turma').first()).toBeVisible();
  });

  test('Deve ser possível navegar para os detalhes de uma turma e visualizar o cronograma', async ({ page }) => {
    // Busca o primeiro link para os detalhes da turma ("Gerenciar" ou equivalente)
    // Assumindo que o componente CourseCard ou ClassCard tenha links para "/escola/turmas/[id]"
    const classLinks = page.locator('a[href^="/escola/turmas/"]');
    
    // Se houver turmas cadastradas, entra na primeira
    if (await classLinks.count() > 0) {
      await classLinks.first().click();
      
      // Verifica se a página de detalhes carregou
      await expect(page.getByText('Alunos Matriculados').first()).toBeVisible({ timeout: 15000 });
      
      // Clica na aba "Horários das Aulas" / "Cronograma da Turma"
      const horariosTab = page.getByText('Horários das Aulas', { exact: false });
      await horariosTab.click();
      
      // Verifica se a UI do cronograma carregou
      await expect(page.getByText('Novo Horário', { exact: false }).first()).toBeVisible();
      
      // Checa se o texto "Alunos Vinculados" está visível no cartão (se houver horários)
      const alunosVinculados = page.getByText('Alunos Vinculados');
      if (await alunosVinculados.count() > 0) {
         await expect(alunosVinculados.first()).toBeVisible();
         // Valida que o botão "+ Adicionar" aparece e abre modal
         const btnAdicionar = page.getByText('Adicionar', { exact: true }).first();
         if (await btnAdicionar.isVisible()) {
           await btnAdicionar.click();
           await expect(page.getByText('Vincular Aluno')).toBeVisible();
           // Clica em cancelar para fechar
           await page.getByText('Cancelar', { exact: true }).click();
         }
      }
    }
  });
});
