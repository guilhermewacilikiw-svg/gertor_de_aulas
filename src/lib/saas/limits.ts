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

  // 1. Obter dados da escola e plano vinculado
  const { data: school, error: schoolError } = await supabase
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
    .single();

  if (schoolError || !school) {
    console.error('Erro ao buscar dados do plano da escola:', schoolError);
    return null;
  }

  // 2. Contar alunos ativos
  const { count: studentCount } = await supabase
    .from('students')
    .select('id', { count: 'exact', head: true })
    .eq('school_id', schoolId);

  // 3. Contar professores ativos
  const { count: teacherCount } = await supabase
    .from('teachers')
    .select('id', { count: 'exact', head: true })
    .eq('school_id', schoolId);

  const students = studentCount || 0;
  const teachers = teacherCount || 0;

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
  const info = await getSchoolPlanAndUsage(schoolId);

  if (!info) {
    // Se não encontrou os dados da escola, permite por precaução para não quebrar a aplicação
    return { allowed: true, current: 0, max: 9999, planName: 'Padrão' };
  }

  if (!info.isSubscriptionValid) {
    return {
      allowed: false,
      error: 'O período de testes ou a assinatura da sua escola expirou. Regularize seu plano para continuar cadastrando novos registros.',
      current: resource === 'students' ? info.usage.students : info.usage.teachers,
      max: resource === 'students' ? info.limits.maxStudents : info.limits.maxTeachers,
      planName: info.plan?.name || 'Wackoda'
    };
  }

  if (resource === 'students') {
    if (info.limits.maxStudents !== -1 && info.usage.students >= info.limits.maxStudents) {
      return {
        allowed: false,
        error: `Você atingiu o limite de ${info.limits.maxStudents} alunos do seu plano ${info.plan?.name}. Faça upgrade para continuar expandindo sua escola.`,
        current: info.usage.students,
        max: info.limits.maxStudents,
        planName: info.plan?.name || 'Solo'
      };
    }
  }

  if (resource === 'teachers') {
    if (info.limits.maxTeachers !== -1 && info.usage.teachers >= info.limits.maxTeachers) {
      return {
        allowed: false,
        error: `Você atingiu o limite de ${info.limits.maxTeachers} professores do seu plano ${info.plan?.name}. Faça upgrade para adicionar mais docentes.`,
        current: info.usage.teachers,
        max: info.limits.maxTeachers,
        planName: info.plan?.name || 'Solo'
      };
    }
  }

  return {
    allowed: true,
    current: resource === 'students' ? info.usage.students : info.usage.teachers,
    max: resource === 'students' ? info.limits.maxStudents : info.limits.maxTeachers,
    planName: info.plan?.name || 'Wackoda'
  };
}
