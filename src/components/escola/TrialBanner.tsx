'use client';

import { SchoolSubscriptionInfo } from '@/lib/saas/limits';

interface TrialBannerProps {
  subscription: SchoolSubscriptionInfo | null;
}

export function TrialBanner({ subscription }: TrialBannerProps) {
  // Desativado para o modo de testes: nenhum banner de pagamento ou expiração é exibido
  return null;
}
