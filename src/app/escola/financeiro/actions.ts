'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createInvoiceAction(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Acesso negado' };
  }

  const { data: publicUser } = await supabase
    .from('users')
    .select('id')
    .eq('auth_user_id', user.id)
    .single();

  if (!publicUser) {
    return { success: false, error: 'Usuário não encontrado' };
  }

  const { data: membership } = await supabase
    .from('school_memberships')
    .select('school_id')
    .eq('user_id', publicUser.id)
    .single();

  if (!membership?.school_id) {
    return { success: false, error: 'Escola não encontrada' };
  }

  const studentId = formData.get('student_id') as string;
  const amountStr = formData.get('amount') as string;
  const dueDate = formData.get('due_date') as string;

  if (!studentId || !amountStr || !dueDate) {
    return { success: false, error: 'Preencha todos os campos obrigatórios' };
  }

  const amount = parseFloat(amountStr.replace(',', '.'));
  if (isNaN(amount) || amount <= 0) {
    return { success: false, error: 'Valor inválido' };
  }

  // Fetch student name to store in invoice (denormalized for simpler UI, or we can fetch joined)
  // Our current schema has student_name in invoices, let's get it.
  const { data: student } = await supabase
    .from('students')
    .select('name')
    .eq('id', studentId)
    .single();

  const studentName = student?.name || 'Aluno Desconhecido';

  const { error } = await supabase.from('invoices').insert({
    school_id: membership.school_id,
    student_id: studentId,
    student_name: studentName,
    amount: amount,
    due_date: dueDate,
    status: 'pending',
    plan: 'Fatura Avulsa'
  });

  if (error) {
    console.error('Invoice creation error:', error);
    return { success: false, error: 'Erro ao criar fatura.' };
  }

  revalidatePath('/escola/financeiro');
  
  return { success: true };
}
