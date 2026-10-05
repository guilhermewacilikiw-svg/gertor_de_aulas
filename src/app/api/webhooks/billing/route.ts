import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { createAdminClient } from '@/lib/supabase/admin';

function tokenIsValid(received: string | null, expected: string) {
  if (!received) return false;
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  // Autenticação: o gateway deve enviar o segredo configurado em BILLING_WEBHOOK_SECRET
  // (Asaas: cabeçalho "asaas-access-token"; outros: "x-webhook-secret").
  const secret = process.env.BILLING_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[Billing Webhook]: BILLING_WEBHOOK_SECRET não configurado');
    return NextResponse.json({ error: 'Webhook não configurado' }, { status: 503 });
  }
  const received = req.headers.get('asaas-access-token') || req.headers.get('x-webhook-secret');
  if (!tokenIsValid(received, secret)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const supabase = createAdminClient();
  if (!supabase) {
    console.error('[Billing Webhook]: SUPABASE_SERVICE_ROLE_KEY não configurada');
    return NextResponse.json({ error: 'Servidor não configurado' }, { status: 503 });
  }

  try {
    const body = await req.json();

    // Padrão Asaas: { event, payment: { customer, externalReference, value, id } }
    // Padrão Stripe: { type, data: { object: { customer, metadata, ... } } }
    const eventType = body.event || body.type;
    const paymentData = body.payment || body.data?.object;

    if (!eventType || !paymentData) {
      return NextResponse.json({ received: true, note: 'Ignored: No event structure found' });
    }

    const customerId = paymentData.customer || paymentData.customer_id;
    let targetSchoolId = paymentData.externalReference || paymentData.metadata?.school_id;

    if (!targetSchoolId && customerId) {
      const { data: foundSchool } = await supabase
        .from('schools')
        .select('id')
        .eq('gateway_customer_id', customerId)
        .maybeSingle();
      targetSchoolId = foundSchool?.id;
    }

    if (!targetSchoolId) {
      console.warn('[Billing Webhook]: Escola não encontrada para o cliente', customerId);
      return NextResponse.json({ received: true, warning: 'School not matched' });
    }

    if (
      eventType === 'PAYMENT_RECEIVED' ||
      eventType === 'PAYMENT_CONFIRMED' ||
      eventType === 'invoice.paid' ||
      eventType === 'checkout.session.completed'
    ) {
      const transactionId = paymentData.id || `TX-${Date.now()}`;

      // Idempotência: gateways reenviam eventos; não renove duas vezes o mesmo pagamento
      const { data: already } = await supabase
        .from('payments')
        .select('id')
        .eq('school_id', targetSchoolId)
        .eq('transaction_id', transactionId)
        .maybeSingle();

      if (!already) {
        const now = new Date();
        const nextPeriod = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        const { error: updateErr } = await supabase
          .from('schools')
          .update({
            subscription_status: 'active',
            current_period_start: now.toISOString(),
            current_period_end: nextPeriod.toISOString(),
            gateway_customer_id: customerId || undefined,
          })
          .eq('id', targetSchoolId);
        if (updateErr) throw updateErr;

        const { error: payErr } = await supabase.from('payments').insert({
          school_id: targetSchoolId,
          amount: paymentData.value || (paymentData.amount_paid ? paymentData.amount_paid / 100 : 0),
          payment_method: paymentData.billingType || paymentData.payment_method_types?.[0] || 'GATEWAY',
          status: 'paid',
          transaction_id: transactionId,
        });
        if (payErr) console.warn('[Billing Webhook]: erro ao salvar pagamento', payErr.message);
      }
    }

    if (eventType === 'PAYMENT_OVERDUE' || eventType === 'invoice.payment_failed') {
      const { error } = await supabase.from('schools').update({ subscription_status: 'past_due' }).eq('id', targetSchoolId);
      if (error) throw error;
    }

    if (eventType === 'SUBSCRIPTION_CANCELED' || eventType === 'customer.subscription.deleted') {
      const { error } = await supabase.from('schools').update({ subscription_status: 'canceled' }).eq('id', targetSchoolId);
      if (error) throw error;
    }

    return NextResponse.json({ received: true, success: true });
  } catch (error) {
    console.error('[Billing Webhook Error]:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
