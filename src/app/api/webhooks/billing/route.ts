import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[SaaS Billing Webhook Received]:', JSON.stringify(body, null, 2));

    const supabase = await createClient();

    // 1. Identificar evento do Asaas ou Stripe
    // Padrão Asaas: { event: 'PAYMENT_RECEIVED' | 'PAYMENT_CONFIRMED' | 'PAYMENT_OVERDUE', payment: { customer, externalReference, value, ... } }
    // Padrão Stripe: { type: 'invoice.paid' | 'customer.subscription.updated', data: { object: { customer, metadata, ... } } }

    const eventType = body.event || body.type;
    const paymentData = body.payment || body.data?.object;

    if (!eventType || !paymentData) {
      return NextResponse.json({ received: true, note: 'Ignored: No event structure found' });
    }

    // Identificar a Escola pelo externalReference, metadata.school_id ou customer_id
    const schoolId = paymentData.externalReference || paymentData.metadata?.school_id;
    const customerId = paymentData.customer || paymentData.customer_id;

    let targetSchoolId = schoolId;

    if (!targetSchoolId && customerId) {
      const { data: foundSchool } = await supabase
        .from('schools')
        .select('id')
        .eq('gateway_customer_id', customerId)
        .single();
      
      targetSchoolId = foundSchool?.id;
    }

    if (!targetSchoolId) {
      console.warn('[Billing Webhook]: Escola não encontrada para o pagamento:', customerId);
      return NextResponse.json({ received: true, warning: 'School not matched' });
    }

    // 2. Processar Pagamento Aprovado / Renovação
    if (
      eventType === 'PAYMENT_RECEIVED' ||
      eventType === 'PAYMENT_CONFIRMED' ||
      eventType === 'invoice.paid' ||
      eventType === 'checkout.session.completed'
    ) {
      const nextPeriod = new Date();
      nextPeriod.setDate(nextPeriod.getDate() + 30); // 30 dias para ciclo mensal

      await supabase
        .from('schools')
        .update({
          subscription_status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: nextPeriod.toISOString(),
          gateway_customer_id: customerId || undefined
        })
        .eq('id', targetSchoolId);

      // Registrar o pagamento na tabela de auditoria/financeiro do SaaS
      try {
        await supabase.from('payments').insert({
          school_id: targetSchoolId,
          amount: paymentData.value || (paymentData.amount_paid ? paymentData.amount_paid / 100 : 0),
          payment_method: paymentData.billingType || paymentData.payment_method_types?.[0] || 'GATEWAY',
          status: 'paid',
          transaction_id: paymentData.id || `TX-${Date.now()}`
        });
      } catch (logErr) {
        console.warn('Erro ao salvar log de pagamento:', logErr);
      }

      console.log(`[Billing Webhook]: Assinatura da escola ${targetSchoolId} renovada com sucesso até ${nextPeriod.toLocaleDateString('pt-BR')}`);
    }

    // 3. Processar Inadimplência / Pagamento Atrasado
    if (
      eventType === 'PAYMENT_OVERDUE' ||
      eventType === 'invoice.payment_failed'
    ) {
      await supabase
        .from('schools')
        .update({
          subscription_status: 'past_due'
        })
        .eq('id', targetSchoolId);

      console.log(`[Billing Webhook]: Assinatura da escola ${targetSchoolId} marcada como PAST_DUE.`);
    }

    // 4. Processar Cancelamento
    if (
      eventType === 'SUBSCRIPTION_CANCELED' ||
      eventType === 'customer.subscription.deleted'
    ) {
      await supabase
        .from('schools')
        .update({
          subscription_status: 'canceled'
        })
        .eq('id', targetSchoolId);

      console.log(`[Billing Webhook]: Assinatura da escola ${targetSchoolId} CANCELADA.`);
    }

    return NextResponse.json({ received: true, success: true });
  } catch (error: any) {
    console.error('[Billing Webhook Error]:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
