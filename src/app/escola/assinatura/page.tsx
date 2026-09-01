import { createClient } from '@/lib/supabase/server';
import { getSchoolPlanAndUsage } from '@/lib/saas/limits';
import { 
  Sparkles, 
  ShieldCheck, 
  Users, 
  BookOpen, 
  CheckCircle2, 
  CreditCard, 
  Clock, 
  ArrowUpRight,
  Receipt,
  FileCheck2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default async function AssinaturaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let schoolId: string | null = null;

  if (user) {
    const { data: publicUser } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    if (publicUser) {
      const { data: membership } = await supabase
        .from('school_memberships')
        .select('school_id')
        .eq('user_id', publicUser.id)
        .maybeSingle();

      schoolId = membership?.school_id || null;
    }
  }

  const subInfo = schoolId ? await getSchoolPlanAndUsage(schoolId) : null;

  // Buscar todos os planos disponíveis no banco
  const { data: plansData } = await supabase
    .from('plans')
    .select('*')
    .order('price_monthly', { ascending: true });

  const plans = plansData || [
    {
      code: 'solo',
      name: 'Solo (Garage)',
      description: 'Ideal para professores autônomos e estúdios particulares.',
      price_monthly: 59.00,
      price_yearly: 588.00,
      max_students: 30,
      max_teachers: 1,
      features: ['Até 30 alunos', '1 Professor / Admin', 'Agenda inteligente e grade de horários', 'Diário de classe e chamadas', 'Controle financeiro básico']
    },
    {
      code: 'stage',
      name: 'Stage (Pro)',
      description: 'Para escolas de música consolidadas com múltiplos professores.',
      price_monthly: 169.00,
      price_yearly: 1668.00,
      max_students: 150,
      max_teachers: 8,
      features: ['Até 150 alunos', 'Até 8 professores', 'Múltiplos horários por turma', 'Gamificação (Níveis e XP)', 'Gestão de faturas e mensalidades', 'Upload de conteúdos e partituras']
    },
    {
      code: 'festival',
      name: 'Festival (Arena)',
      description: 'Para grandes conservatórios, franquias e redes.',
      price_monthly: 349.00,
      price_yearly: 3468.00,
      max_students: -1,
      max_teachers: -1,
      features: ['Alunos ilimitados', 'Professores ilimitados', 'Multi-unidades e filiais', 'Branding customizado', 'Exportação de relatórios contábeis', 'Suporte prioritário via WhatsApp']
    }
  ];

  // Buscar histórico de pagamentos da escola
  const { data: paymentsHistory } = schoolId ? await supabase
    .from('payments')
    .select('*')
    .eq('school_id', schoolId)
    .order('created_at', { ascending: false })
    .limit(5) : { data: [] };

  const currentPlanCode = subInfo?.plan?.code || 'stage';
  const studentsCount = subInfo?.usage.students || 0;
  const maxStudents = subInfo?.limits.maxStudents || 150;
  const studentsPercent = maxStudents === -1 ? 15 : Math.min(100, Math.round((studentsCount / maxStudents) * 100));

  const teachersCount = subInfo?.usage.teachers || 0;
  const maxTeachers = subInfo?.limits.maxTeachers || 8;
  const teachersPercent = maxTeachers === -1 ? 15 : Math.min(100, Math.round((teachersCount / maxTeachers) * 100));

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-7xl mx-auto">
      
      {/* 1. Header do Plano */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#12121A] border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-red-600/20 text-red-400 border border-red-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              SaaS Subscription
            </span>
            {subInfo?.isTrialActive ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Trial Ativo: {subInfo.trialDaysLeft} dias restantes
              </span>
            ) : subInfo?.status === 'active' ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Assinatura Ativa
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                Pagamento Pendente
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Plano {subInfo?.plan?.name || 'Stage (Pro)'}
          </h1>
          <p className="text-gray-400 text-sm max-w-xl">
            Gerencie sua assinatura da plataforma Wackoda, acompanhe o consumo de limites e faça upgrade quando sua escola crescer.
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 min-w-[200px]">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Próxima Renovação</p>
            <p className="text-lg font-black text-white">
              {subInfo?.currentPeriodEnd ? new Date(subInfo.currentPeriodEnd).toLocaleDateString('pt-BR') : '14 dias'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Barra de Consumo de Limites */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Limite de Alunos */}
        <div className="bg-[#12121A] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 border border-red-500/30">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Alunos Ativos</h4>
                <p className="text-xs text-gray-500">Capacidade do plano contratado</p>
              </div>
            </div>
            <span className="text-sm font-black text-white">
              {studentsCount} / {maxStudents === -1 ? 'Ilimitado' : maxStudents}
            </span>
          </div>

          <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                studentsPercent > 85 ? 'bg-gradient-to-r from-red-600 to-amber-500' : 'bg-gradient-to-r from-red-600 to-red-400'
              }`}
              style={{ width: `${studentsPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2 text-[11px] text-gray-400">
            <span>{studentsPercent}% utilizado</span>
            {maxStudents !== -1 && studentsCount >= maxStudents && (
              <span className="text-red-400 font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Limite atingido
              </span>
            )}
          </div>
        </div>

        {/* Limite de Professores */}
        <div className="bg-[#12121A] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Professores Cadastrados</h4>
                <p className="text-xs text-gray-500">Contas de docentes liberadas</p>
              </div>
            </div>
            <span className="text-sm font-black text-white">
              {teachersCount} / {maxTeachers === -1 ? 'Ilimitado' : maxTeachers}
            </span>
          </div>

          <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-500"
              style={{ width: `${teachersPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2 text-[11px] text-gray-400">
            <span>{teachersPercent}% utilizado</span>
            {maxTeachers !== -1 && teachersCount >= maxTeachers && (
              <span className="text-red-400 font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Limite atingido
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Comparativo de Planos SaaS */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Escolha o plano que acompanha seu ritmo
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Mude de plano a qualquer momento. Seus dados e cadastros continuam 100% seguros.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((p: any) => {
            const isCurrent = currentPlanCode === p.code;
            const isHighlight = p.code === 'stage';

            return (
              <div 
                key={p.code}
                className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  isHighlight 
                    ? 'bg-gradient-to-b from-red-600/30 via-[#12121A] to-[#12121A] border-2 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.15)] md:-translate-y-2' 
                    : 'bg-[#12121A] border border-white/10 hover:border-white/20'
                }`}
              >
                {isHighlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-600 to-red-500 text-white text-[10px] font-black uppercase tracking-widest py-1 px-4 rounded-full shadow-lg">
                    Mais Popular
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-black text-white tracking-tight">{p.name}</h3>
                      <p className="text-xs text-gray-400 mt-1">{p.description}</p>
                    </div>
                  </div>

                  <div className="my-6 pb-6 border-b border-white/10">
                    <span className="text-4xl font-black text-white">R$ {Number(p.price_monthly).toFixed(0)}</span>
                    <span className="text-gray-400 text-sm font-bold"> /mês</span>
                    <p className="text-[11px] text-gray-500 mt-1">ou R$ {Number(p.price_yearly).toFixed(0)}/ano (2 meses grátis)</p>
                  </div>

                  <ul className="space-y-3.5 mb-8">
                    {(Array.isArray(p.features) ? p.features : JSON.parse(p.features || '[]')).map((feat: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  {isCurrent ? (
                    <button 
                      disabled
                      className="w-full py-4 rounded-2xl bg-white/10 text-white font-bold text-xs uppercase tracking-wider cursor-default"
                    >
                      Plano Atual
                    </button>
                  ) : (
                    <a
                      href={`mailto:suporte@wakoda.com.br?subject=Upgrade para o Plano ${p.name}&body=Olá, gostaria de fazer o upgrade da minha escola para o plano ${p.name}.`}
                      className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2 ${
                        isHighlight 
                          ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30' 
                          : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                      }`}
                    >
                      Assinar Plano
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Histórico de Pagamentos */}
      <div className="bg-[#12121A] border border-white/10 rounded-3xl p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
            <Receipt className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white tracking-tight">Histórico de Faturas da Plataforma</h3>
            <p className="text-xs text-gray-400">Recibos e comprovantes das mensalidades do software</p>
          </div>
        </div>

        {paymentsHistory && paymentsHistory.length > 0 ? (
          <div className="divide-y divide-white/5">
            {paymentsHistory.map((pmt: any) => (
              <div key={pmt.id} className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileCheck2 className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-sm font-bold text-white">Mensalidade Wackoda SaaS</p>
                    <p className="text-xs text-gray-500">
                      Pago em {new Date(pmt.paid_at || pmt.created_at).toLocaleDateString('pt-BR')} • {pmt.payment_method || 'Cartão/PIX'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-white">R$ {Number(pmt.amount).toFixed(2)}</span>
                  <span className="block text-[10px] text-emerald-400 font-bold uppercase">Confirmado</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center bg-white/5 rounded-2xl border border-white/5">
            <p className="text-sm text-gray-400 font-bold">Nenhum pagamento registrado ainda.</p>
            <p className="text-xs text-gray-500 mt-1">Suas futuras faturas e recibos aparecerão aqui automaticamente.</p>
          </div>
        )}
      </div>

    </div>
  );
}
