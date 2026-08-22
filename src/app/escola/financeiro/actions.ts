'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function upsertFinanceAction(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Acesso negado' };

  const { data: publicUser } = await supabase.from('users').select('id').eq('auth_user_id', user.id).single();
  const { data: membership } = await supabase.from('school_memberships').select('school_id').eq('user_id', publicUser?.id).single();

  if (!membership?.school_id) return { success: false, error: 'Escola não encontrada' };

  const studentId = formData.get('student_id') as string;
  const planName = formData.get('plan_name') as string;
  const amountStr = formData.get('amount') as string;
  const dueDayStr = formData.get('due_day') as string;
  const paymentMethod = formData.get('payment_method') as string;

  if (!studentId || !planName || !amountStr || !dueDayStr || !paymentMethod) {
    return { success: false, error: 'Preencha todos os campos obrigatórios' };
  }

  const amount = parseFloat(amountStr.replace(',', '.'));
  const dueDay = parseInt(dueDayStr, 10);
  
  if (isNaN(amount) || amount <= 0) return { success: false, error: 'Valor inválido' };
  if (isNaN(dueDay) || dueDay < 1 || dueDay > 31) return { success: false, error: 'Dia de vencimento inválido' };

  // Delete existing finance if replacing, or use UPSERT if constraint is set
  const { error } = await supabase.from('student_finances').upsert({
    school_id: membership.school_id,
    student_id: studentId,
    plan_name: planName,
    amount: amount,
    due_day: dueDay,
    payment_method: paymentMethod,
    status: 'active'
  }, { onConflict: 'student_id' });

  if (error) {
    console.error('Finance error:', error);
    return { success: false, error: 'Erro ao configurar financeiro do aluno.' };
  }

  revalidatePath('/escola/financeiro');
  return { success: true };
}

export async function createInvoiceAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Acesso negado' };

  const { data: publicUser } = await supabase.from('users').select('id').eq('auth_user_id', user.id).single();
  const { data: membership } = await supabase.from('school_memberships').select('school_id').eq('user_id', publicUser?.id).single();
  if (!membership?.school_id) return { success: false, error: 'Escola não encontrada' };

  const studentId = formData.get('student_id') as string;
  const dueDate = formData.get('due_date') as string;
  const boletoUrl = formData.get('boleto_url') as string;
  const barcode = formData.get('barcode') as string;

  // We need to fetch their finance config to get the amount and method
  const { data: finance } = await supabase.from('student_finances').select('*').eq('student_id', studentId).single();

  if (!finance) {
     return { success: false, error: 'Aluno não possui um plano financeiro configurado. Crie um contrato primeiro.' };
  }

  const { error } = await supabase.from('student_invoices').insert({
    school_id: membership.school_id,
    student_id: studentId,
    finance_id: finance.id,
    amount: finance.amount,
    due_date: dueDate,
    status: 'pending',
    payment_method: finance.payment_method,
    boleto_url: boletoUrl || null,
    barcode: barcode || null
  });

  if (error) {
    console.error('Invoice error:', error);
    return { success: false, error: 'Erro ao gerar fatura.' };
  }

  revalidatePath('/escola/financeiro');
  return { success: true };
}

export async function updateInvoiceAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Acesso negado' };

  const { data: publicUser } = await supabase.from('users').select('id').eq('auth_user_id', user.id).single();
  const { data: membership } = await supabase.from('school_memberships').select('school_id').eq('user_id', publicUser?.id).single();
  if (!membership?.school_id) return { success: false, error: 'Escola não encontrada' };

  const invoiceId = formData.get('invoice_id') as string;
  const status = formData.get('status') as string;
  const boletoUrl = formData.get('boleto_url') as string;

  if (!invoiceId || !status) {
    return { success: false, error: 'Fatura e Status são obrigatórios' };
  }

  const { error } = await supabase
    .from('student_invoices')
    .update({
      status: status,
      boleto_url: boletoUrl || null
    })
    .eq('id', invoiceId)
    .eq('school_id', membership.school_id); // security check

  if (error) {
    console.error('Invoice update error:', error);
    return { success: false, error: 'Erro ao atualizar fatura.' };
  }

  revalidatePath('/escola/financeiro');
  return { success: true };
}
