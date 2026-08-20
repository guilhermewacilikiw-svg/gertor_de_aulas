import { createClient } from '@/lib/supabase/client';

export interface SchoolLimitsCheck {
  allowed: boolean;
  currentCount: number;
  maxLimit: number;
  message?: string;
}

/**
 * Validates whether a school has reached its student limit before allowing a new registration.
 */
export async function checkStudentLimit(schoolId: string): Promise<SchoolLimitsCheck> {
  const supabase = createClient();

  // Fetch school limits
  const { data: limits } = await supabase
    .from('school_limits')
    .select('max_students')
    .eq('school_id', schoolId)
    .maybeSingle();

  const maxStudents = limits?.max_students || 100;

  // Count current active students
  const { count } = await supabase
    .from('students')
    .select('id', { count: 'exact', head: true })
    .eq('school_id', schoolId);

  const currentCount = count || 0;

  if (currentCount >= maxStudents) {
    return {
      allowed: false,
      currentCount,
      maxLimit: maxStudents,
      message: `Limite de alunos atingido (${currentCount}/${maxStudents}). Faça um upgrade do plano da sua escola para matricular novos alunos.`
    };
  }

  return {
    allowed: true,
    currentCount,
    maxLimit: maxStudents
  };
}

/**
 * Validates whether a school has reached its teacher limit before allowing a new teacher assignment.
 */
export async function checkTeacherLimit(schoolId: string): Promise<SchoolLimitsCheck> {
  const supabase = createClient();

  const { data: limits } = await supabase
    .from('school_limits')
    .select('max_teachers')
    .eq('school_id', schoolId)
    .maybeSingle();

  const maxTeachers = limits?.max_teachers || 10;

  const { count } = await supabase
    .from('teachers')
    .select('id', { count: 'exact', head: true })
    .eq('school_id', schoolId);

  const currentCount = count || 0;

  if (currentCount >= maxTeachers) {
    return {
      allowed: false,
      currentCount,
      maxLimit: maxTeachers,
      message: `Limite de professores atingido (${currentCount}/${maxTeachers}). Atualize seu plano para cadastrar mais docentes.`
    };
  }

  return {
    allowed: true,
    currentCount,
    maxLimit: maxTeachers
  };
}
