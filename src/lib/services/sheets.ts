export interface ClientSheetData {
  schoolName: string;
  adminName: string;
  adminEmail: string;
  phone?: string | null;
  document?: string | null;
  plan?: string | null;
  createdAt?: string;
}

/**
 * Envia os dados do cliente recém-cadastrado para a planilha do Google Sheets.
 * Executa de forma resiliente com timeout de 5 segundos para nunca travar o cadastro do usuário.
 */
export async function syncNewClientToSheet(data: ClientSheetData): Promise<{ success: boolean; error?: string }> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhookUrl) {
    // Webhook ainda não configurado no .env.local
    return { success: false, error: 'GOOGLE_SHEETS_WEBHOOK_URL não definida' };
  }

  try {
    const payload = {
      dataHora: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
      escola: data.schoolName,
      responsavel: data.adminName,
      email: data.adminEmail,
      telefone: data.phone || 'Não informado',
      documento: data.document || 'Não informado',
      plano: data.plan || 'stage',
      origem: 'Cadastro Web Wakoda'
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      // 5 segundos de limite para nunca atrasar a resposta ao usuário
      signal: AbortSignal.timeout(5000),
      redirect: 'follow',
    });

    if (!response.ok) {
      console.warn(`[GoogleSheets] Webhook retornou status ${response.status}`);
      return { success: false, error: `HTTP ${response.status}` };
    }

    return { success: true };
  } catch (err: any) {
    console.warn('[GoogleSheets] Falha ao sincronizar cliente com a planilha:', err?.message || err);
    return { success: false, error: err?.message };
  }
}
