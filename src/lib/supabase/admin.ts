import { createClient } from '@supabase/supabase-js';

/**
 * Client com a chave de serviço (ignora RLS). Use SOMENTE no servidor
 * (server actions e rotas de API) e só depois de autenticar/autorizar a chamada.
 * Retorna null se SUPABASE_SERVICE_ROLE_KEY não estiver configurada.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
