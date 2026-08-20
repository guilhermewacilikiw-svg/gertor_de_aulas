'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addScheduleAction(classId: string, schoolId: string, dayOfWeek: number, startTime: string, endTime: string, room: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('class_schedules').insert({
    class_id: classId,
    school_id: schoolId,
    day_of_week: dayOfWeek,
    start_time: startTime,
    end_time: endTime,
    room: room || null,
    status: 'active'
  });

  if (error) {
    console.error('Error adding schedule:', error);
    throw new Error('Falha ao adicionar horário: ' + error.message);
  }

  revalidatePath(`/escola/turmas/${classId}`);
  return { success: true };
}

export async function removeScheduleAction(scheduleId: string, classId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('class_schedules').delete().eq('id', scheduleId);

  if (error) {
    console.error('Error removing schedule:', error);
    throw new Error('Falha ao remover horário: ' + error.message);
  }

  revalidatePath(`/escola/turmas/${classId}`);
  return { success: true };
}

export async function enrollStudentAction(classId: string, courseId: string, schoolId: string, studentId: string) {
  const supabase = await createClient();

  // We should create a new enrollment or update an existing one.
  // For simplicity and to match the schema correctly, we create a new enrollment record
  // or if they are already enrolled in this course without a class, we could update it.
  // Let's just insert a new active enrollment.
  
  const { error } = await supabase.from('enrollments').insert({
    school_id: schoolId,
    student_id: studentId,
    course_id: courseId,
    class_id: classId,
    start_date: new Date().toISOString().split('T')[0],
    status: 'active'
  });

  if (error) {
    console.error('Error enrolling student:', error);
    throw new Error('Falha ao matricular aluno: ' + error.message);
  }

  revalidatePath(`/escola/turmas/${classId}`);
  return { success: true };
}

export async function removeStudentAction(enrollmentId: string, classId: string) {
  const supabase = await createClient();

  // Removing a student from a class could mean deleting the enrollment or setting class_id to null
  // Let's delete the enrollment for simplicity, assuming they are entirely removed from this instance.
  const { error } = await supabase.from('enrollments').delete().eq('id', enrollmentId);

  if (error) {
    console.error('Error removing student:', error);
    throw new Error('Falha ao remover aluno: ' + error.message);
  }

  revalidatePath(`/escola/turmas/${classId}`);
  return { success: true };
}

export async function transferStudentAction(enrollmentId: string, newClassId: string, currentClassId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('enrollments').update({
    class_id: newClassId
  }).eq('id', enrollmentId);

  if (error) {
    console.error('Error transferring student:', error);
    throw new Error('Falha ao transferir aluno: ' + error.message);
  }

  revalidatePath(`/escola/turmas/${currentClassId}`);
  revalidatePath(`/escola/turmas/${newClassId}`);
  return { success: true };
}
