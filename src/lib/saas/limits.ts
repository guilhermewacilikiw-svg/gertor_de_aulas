import { createClient } from '@/lib/supabase/server';

export interface PlanData {
  id: string;
  code: 'solo' | 'stage' | 'festival';
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  max_students: number;
  max_teachers: number;
  features: string[];
}

export interface SchoolSubscriptionInfo {
  schoolId: string;
  schoolName: string;
  status: 'trialing' | 'active' | 'past_due' | 'canceled';
  plan: PlanData | null;
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
  trialDaysLeft: number;
  isTrialActive: boolean;
  isSubscriptionValid: boolean;
  usage: {
    students: number;
    teachers: number;
  };
  limits: {
    maxStudents: number;
    maxTeachers: number;
    canAddStudent: boolean;
    canAddTeacher: boolean;
  };
}

export async function getSchoolPlanAndUsage(schoolId: string): Promise<SchoolSubscriptionInfo | null> {
  const supabase = await createClient();

  // 1. Obter dados da escola, contagem de alunos e contagem de professores em paralelo
  const [schoolRes, studentRes, teacherRes] = await Promise.all([
    supabase
      .from('schools')
      .select(`
        id,
        name,
        subscription_status,
        trial_ends_at,
        current_period_end,
        plan_id,
        plans (
          id,
          code,
          name,
          description,
          price_monthly,
          price_yearly,
          max_students,
          max_teachers,
          features
        )
      `)
      .eq('id', schoolId)
      .single(),

    supabase
      .from('students')
      .select('id', { count: 'exact', head: true })
      .eq('school_id', schoolId),

    supabase
      .from('teachers')
      .select('id', { count: 'exact', head: true })
      .eq('school_id', schoolId)
  ]);

  const school = schoolRes.data;
  if (schoolRes.error || !school) {
    console.error('Erro ao buscar dados do plano da escola:', schoolRes.error);
    return null;
  }

  const students = studentRes.count || 0;
  const teachers = teacherRes.count || 0;

  // Normalizar dados do plano (fallback para Stage Pro se não tiver plano explicitado)
  const planData: PlanData = (school.plans as any) || {
    id: 'default',
    code: 'stage',
    name: 'Stage (Pro)',
    description: 'Plano padrão com recursos completos.',
    price_monthly: 169.00,
    price_yearly: 1668.00,
    max_students: 150,
    max_teachers: 8,
    features: ['Até 150 alunos', 'Até 8 professores', 'Recursos Pro']
  };

  const status = (school.subscription_status as any) || 'active';
  const now = new Date();
  
  let trialDaysLeft = 0;
  let isTrialActive = false;

  if (school.trial_ends_at) {
    const trialEnd = new Date(school.trial_ends_at);
    const diffTime = trialEnd.getTime() - now.getTime();
    trialDaysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    isTrialActive = status === 'trialing' && diffTime > 0;
  }

  const isSubscriptionValid = status === 'active' || isTrialActive;

  const maxStudents = planData.max_students ?? 150;
  const maxTeachers = planData.max_teachers ?? 8;

  const canAddStudent = isSubscriptionValid && (maxStudents === -1 || students < maxStudents);
  const canAddTeacher = isSubscriptionValid && (maxTeachers === -1 || teachers < maxTeachers);

  return {
    schoolId: school.id,
    schoolName: school.name,
    status,
    plan: planData,
    trialEndsAt: school.trial_ends_at,
    currentPeriodEnd: school.current_period_end,
    trialDaysLeft,
    isTrialActive,
    isSubscriptionValid,
    usage: {
      students,
      teachers
    },
    limits: {
      maxStudents,
      maxTeachers,
      canAddStudent,
      canAddTeacher
    }
  };
}

export async function checkSchoolLimit(
  schoolId: string, 
  resource: 'students' | 'teachers'
): Promise<{ allowed: boolean; error?: string; current: number; max: number; planName: string }> {
  // Enquanto BILLING_ENFORCED não for 'true' (período de testes), não há limites nem cobrança.
  if (process.env.BILLING_ENFORCED !== 'true') {
    return {
      allowed: true,
      current: 0,
      max: 99999,
      planName: 'Ilimitado (Teste)'
    };
  }

  const info = await getSchoolPlanAndUsage(schoolId);
  if (!info) {
    return { allowed: false, error: 'Não foi possível verificar o plano da escola. Tente novamente.', current: 0, max: 0, planName: '' };
  }

  const planName = info.plan?.name || '';
  const current = resource === 'students' ? info.usage.students : info.usage.teachers;
  const max = resource === 'students' ? info.limits.maxStudents : info.limits.maxTeachers;
  const allowed = resource === 'students' ? info.limits.canAddStudent : info.limits.canAddTeacher;

  if (allowed) {
    return { allowed: true, current, max, planName };
  }

  if (!info.isSubscriptionValid) {
    return {
      allowed: false,
      error: 'Sua assinatura não está ativa. Regularize o pagamento para cadastrar novos registros.',
      current, max, planName
    };
  }

  const rotulo = resource === 'students' ? 'alunos' : 'professores';
  return {
    allowed: false,
    error: `Você chegou ao limite de ${max} ${rotulo} do plano ${planName}. Mude de plano para cadastrar mais.`,
    current, max, planName
  };
}
