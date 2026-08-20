import { createClient } from '@/lib/supabase/server';
import { Plus, Search, MoreVertical, DollarSign, TrendingUp, TrendingDown, CreditCard, ShieldCheck } from 'lucide-react';
import { redirect } from 'next/navigation';
import { cn } from '@/lib/utils';
import { CreateInvoiceModal } from './client-modal';

export default async function EscolaFinanceiroPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: publicUser } = await supabase
    .from('users')
    .select('id')
    .eq('auth_user_id', user.id)
    .single();

  if (!publicUser) redirect('/login');

  const { data: membership } = await supabase
    .from('school_memberships')
    .select('school_id')
    .eq('user_id', publicUser.id)
    .single();

  const schoolId = membership?.school_id;
  if (!schoolId) redirect('/login');

  const { data: invoices } = await supabase
    .from('invoices')
    .select('*, subscriptions(plan_name)')
    .eq('school_id', schoolId)
    .order('due_date', { ascending: false });

  const invoiceList = invoices || [];

  const { data: students } = await supabase
    .from('students')
    .select('id, name')
    .eq('school_id', schoolId);
  const studentList = students || [];

  return (
    <div className="bg-[#0a0a0f] min-h-screen text-white w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-8 max-w-6xl mx-auto pb-12 pt-4">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tight drop-shadow-md">Módulo Financeiro <span className="text-[#C0E87A]">Desacoplado</span></h1>
            <p className="text-sm text-gray-400 mt-2 font-medium">Gestão de mensalidades, cobranças e fluxo de caixa da escola.</p>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs transition-all shadow-lg hover:shadow-xl">
              Ver Planos & Limites
            </button>
            <CreateInvoiceModal students={studentList} />
          </div>
        </div>

        {/* Grid Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FinanceCard 
            title="Receita Estimada" 
            value="R$ 0,00" 
            subtitle="+0% este mês" 
            subtitleColor="text-[#C0E87A]"
            icon={<TrendingUp className="w-5 h-5 text-black" />} 
            color="from-[#C0E87A] to-[#E5E87A]" 
            glowColor="bg-[#C0E87A]"
          />
          <FinanceCard 
            title="Inadimplência Zero" 
            value="0%" 
            subtitle="Todas as faturas em dia" 
            subtitleColor="text-gray-400"
            icon={<ShieldCheck className="w-5 h-5 text-white" />} 
            color="from-[#7D7AE8] to-[#A27AE8]" 
            glowColor="bg-[#7D7AE8]"
          />
          <FinanceCard 
            title="Cobranças Pendentes" 
            value="0" 
            subtitle="Nenhuma fatura pendente" 
            subtitleColor="text-gray-400"
            icon={<CreditCard className="w-5 h-5 text-white" />} 
            color="from-[#A27AE8] to-[#C77AE8]" 
            glowColor="bg-[#C77AE8]"
          />
        </div>

        {/* Table */}
        <div className="bg-[#12121A]/80 backdrop-blur-xl border border-white/5 rounded-3xl shadow-xl overflow-hidden relative">
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#7D7AE8]/10 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5 relative z-10">
            <h3 className="font-bold text-white text-lg">Histórico de Cobranças</h3>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar cobrança..."
                className="w-full pl-11 pr-4 py-3 text-xs rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#7D7AE8]/50 focus:ring-1 focus:ring-[#7D7AE8]/50 transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto relative z-10">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-black/40 text-[10px] uppercase font-black tracking-widest text-gray-500 border-b border-white/5">
                <tr>
                  <th className="p-5 pl-6">Aluno / Plano</th>
                  <th className="p-5">Valor</th>
                  <th className="p-5">Vencimento</th>
                  <th className="p-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {invoiceList.length > 0 ? invoiceList.map((invoice: any) => (
                  <tr key={invoice.id} className="hover:bg-white/5 transition-colors group cursor-default">
                    <td className="p-5 pl-6">
                      <div className="font-bold text-white text-base group-hover:text-[#C0E87A] transition-colors">{invoice.student_name || 'Sem nome'}</div>
                      <div className="text-xs text-gray-400 font-medium mt-0.5">{invoice.plan || 'Plano Básico'}</div>
                    </td>
                    <td className="p-5 font-bold text-white text-base">
                      R$ {Number(invoice.amount).toFixed(2).replace('.', ',')}
                    </td>
                    <td className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {new Date(invoice.due_date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-5">
                      <span className={cn(
                        "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border flex w-fit",
                        invoice.status === 'paid'
                          ? "bg-[#C0E87A]/10 text-[#C0E87A] border-[#C0E87A]/20"
                          : "bg-[#E5E87A]/10 text-[#E5E87A] border-[#E5E87A]/20"
                      )}>
                        {invoice.status === 'paid' ? 'Pago' : 'Pendente'}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-gray-500">
                      <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p className="font-bold text-sm">Nenhuma cobrança registrada.</p>
                      <p className="text-xs mt-1">Gere sua primeira cobrança no botão Nova Cobrança.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

function FinanceCard({ title, value, subtitle, subtitleColor, icon, color, glowColor }: { title: string; value: string; subtitle: string; subtitleColor: string; icon: React.ReactNode; color: string, glowColor: string }) {
  return (
    <div className="bg-[#12121A]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-white/20 transition-all shadow-lg hover:-translate-y-1">
      <div className={`absolute top-0 right-0 p-4 opacity-20 transform translate-x-4 -translate-y-4 group-hover:scale-110 group-hover:opacity-30 transition-all duration-500`}>
        <div className={`w-32 h-32 ${glowColor} rounded-full blur-[40px]`}></div>
      </div>
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{title}</p>
            <h3 className="text-4xl font-black text-white mt-1 tracking-tight">{value}</h3>
          </div>
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300`}>
            {icon}
          </div>
        </div>
        <p className={cn("text-xs font-bold", subtitleColor)}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}
