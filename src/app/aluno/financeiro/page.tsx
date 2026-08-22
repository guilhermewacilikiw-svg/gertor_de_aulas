import { createClient } from '@/lib/supabase/server';
import { Search, DollarSign, Download, ExternalLink, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function AlunoFinanceiroPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: publicUser } = await supabase.from('users').select('id').eq('auth_user_id', user.id).single();
  const { data: student } = await supabase.from('students').select('id').eq('user_id', publicUser?.id).single();

  if (!student) {
     return <div className="p-8 text-center text-white">Perfil de aluno não encontrado.</div>;
  }

  // Note: RLS ensures the student only sees their own invoices
  const { data: invoices, error } = await supabase
    .from('student_invoices')
    .select('*, student_finances(plan_name)')
    .eq('student_id', student.id)
    .order('due_date', { ascending: false });

  // Simulate current tuition calculation
  const currentInvoice = invoices?.find(i => i.status === 'pending' || i.status === 'overdue');
  
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Financeiro</h2>
        <p className="text-muted-foreground">Acompanhe suas mensalidades e histórico de pagamentos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Highlight Card for Current Invoice */}
         <div className="md:col-span-2 bg-gradient-brand rounded-2xl p-8 text-white shadow-lg relative overflow-hidden flex flex-col justify-between h-full min-h-[220px]">
            <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10">
               <h3 className="font-semibold text-white/90 text-sm uppercase tracking-wider mb-1">Mensalidade Atual</h3>
               <div className="flex items-end gap-3">
                  <h1 className="text-5xl font-bold tracking-tight">
                     <span className="text-2xl mr-1 opacity-70">R$</span>
                     {currentInvoice ? currentInvoice.amount.toFixed(2).replace('.', ',') : '0,00'}
                  </h1>
               </div>
               <p className="text-white/80 mt-2 font-medium">
                  {currentInvoice?.status === 'overdue' ? 'Vencida em' : 'Vence em'} {currentInvoice ? new Date(currentInvoice.due_date).toLocaleDateString('pt-BR') : '--/--/----'}
               </p>
            </div>

            <div className="relative z-10 mt-6 flex gap-3 flex-wrap">
               {currentInvoice?.boleto_url && (
                  <Link href={currentInvoice.boleto_url} target="_blank" className="bg-white text-primary font-semibold py-3 px-6 rounded-xl hover:bg-white/90 transition-colors shadow-sm flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Abrir Boleto
                  </Link>
               )}
               {currentInvoice?.barcode && (
                  <div className="bg-white/20 text-white text-xs font-mono p-3 rounded-xl border border-white/20 break-all">
                    Linha: {currentInvoice.barcode}
                  </div>
               )}
            </div>
         </div>

         {/* Security / Info Sidebar */}
         <div className="bg-card rounded-2xl p-6 shadow-soft border flex flex-col justify-center gap-4 text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto">
               <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
               <h3 className="font-bold text-lg">Ambiente Seguro</h3>
               <p className="text-sm text-muted-foreground mt-2">Os boletos/links são informados diretamente pela sua escola. Se houver divergências no valor, contate a diretoria.</p>
            </div>
         </div>
      </div>

      <div className="bg-card rounded-2xl border shadow-soft overflow-hidden mt-8">
        <div className="p-4 border-b bg-muted/20">
          <h3 className="font-semibold text-lg">Histórico de Pagamentos</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/20 border-b">
              <tr>
                <th className="px-6 py-4 font-semibold">Descrição</th>
                <th className="px-6 py-4 font-semibold">Valor</th>
                <th className="px-6 py-4 font-semibold">Vencimento</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Comprovante</th>
              </tr>
            </thead>
            <tbody>
              {error && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-red-500">
                    Erro ao carregar faturas. {error.message}
                  </td>
                </tr>
              )}
              {invoices?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    Nenhuma fatura encontrada.
                  </td>
                </tr>
              )}
              {invoices?.map((invoice: any) => (
                <tr key={invoice.id} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground">{invoice.student_finances?.plan_name || 'Mensalidade Padrão'}</p>
                    <p className="text-xs text-muted-foreground">Método: {invoice.payment_method === 'boleto' ? 'Boleto' : invoice.payment_method}</p>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    R$ {invoice.amount.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(invoice.due_date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    {invoice.status === 'paid' && (
                       <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700">Pago</span>
                    )}
                    {invoice.status === 'pending' && (
                       <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-700">Aguardando</span>
                    )}
                    {invoice.status === 'overdue' && (
                       <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-red-100 text-red-700">Em Atraso</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {invoice.boleto_url ? (
                       <Link href={invoice.boleto_url} target="_blank" className="text-primary hover:underline text-xs font-medium flex items-center gap-1 justify-end w-full">
                         Boleto <ExternalLink className="w-3 h-3" />
                       </Link>
                    ) : (
                       <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
