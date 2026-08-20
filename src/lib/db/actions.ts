import { createClient } from '@/lib/supabase/client';
import { AttendanceStatus, LessonRecord, VideoVisibility } from '@/types/database';

// -------------------------------------------------------------
// PROFESSOR ACTIONS
// -------------------------------------------------------------

export interface CompleteLessonPayload {
  lessonId: string;
  schoolId: string;
  teacherId: string;
  summary: string;
  topics: string[];
  teacherNotes?: string;
  practiceInstructions?: string;
  attendances: { studentId: string; status: AttendanceStatus }[];
  video?: {
    title: string;
    storagePath: string;
    duration?: number;
  };
}

export async function completeLessonFlow(payload: CompleteLessonPayload) {
  const supabase = createClient();

  // 1. Update lesson status to completed
  const { error: lessonErr } = await supabase
    .from('lessons')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      actual_start: new Date().toISOString(),
      actual_end: new Date().toISOString()
    })
    .eq('id', payload.lessonId)
    .eq('school_id', payload.schoolId);

  if (lessonErr) throw lessonErr;

  // 2. Upsert lesson record
  const { error: recordErr } = await supabase
    .from('lesson_records')
    .upsert({
      school_id: payload.schoolId,
      lesson_id: payload.lessonId,
      teacher_id: payload.teacherId,
      summary: payload.summary,
      topics: payload.topics,
      teacher_notes: payload.teacherNotes || '',
      practice_instructions: payload.practiceInstructions || ''
    }, { onConflict: 'lesson_id' });

  if (recordErr) throw recordErr;

  // 3. Register attendance
  for (const item of payload.attendances) {
    await supabase
      .from('lesson_participants')
      .update({ attendance_status: item.status })
      .eq('lesson_id', payload.lessonId)
      .eq('student_id', item.studentId);

    // Also track in master attendance table
    const { data: userData } = await supabase
      .from('teachers')
      .select('user_id')
      .eq('id', payload.teacherId)
      .single();

    if (userData?.user_id) {
      await supabase
        .from('attendance')
        .upsert({
          school_id: payload.schoolId,
          lesson_id: payload.lessonId,
          student_id: item.studentId,
          status: item.status,
          marked_by: userData.user_id,
          marked_at: new Date().toISOString()
        }, { onConflict: 'lesson_id,student_id' });
    }
  }

  // 4. Attach Video if provided
  if (payload.video && payload.video.storagePath) {
    await supabase
      .from('videos')
      .insert({
        school_id: payload.schoolId,
        lesson_id: payload.lessonId,
        title: payload.video.title,
        storage_path: payload.video.storagePath,
        duration: payload.video.duration || 180,
        processing_status: 'ready',
        visibility: 'students' as VideoVisibility
      });
  }

  // 5. Notify Students
  const { data: participants } = await supabase
    .from('lesson_participants')
    .select('student_id, students(user_id)')
    .eq('lesson_id', payload.lessonId);

  if (participants && participants.length > 0) {
    for (const p of participants) {
      const studentUser = (p.students as any)?.user_id;
      if (studentUser) {
        await supabase.from('notifications').insert({
          school_id: payload.schoolId,
          user_id: studentUser,
          type: 'lesson_completed',
          title: 'Nova Aula Concluída! 🎸',
          message: `O resumo e o material da sua aula "${payload.summary.substring(0, 40)}..." já estão disponíveis.`,
          data: { lessonId: payload.lessonId }
        });
      }
    }
  }

  return { success: true };
}

// -------------------------------------------------------------
// PUBLIC / LANDING PAGE ACTIONS (LEADS)
// -------------------------------------------------------------

export async function createTrialLead(
  schoolIdOrInput: string | { schoolId: string; name: string; email: string; phone: string; notes?: string; courseInterest?: string },
  name?: string,
  email?: string,
  phone?: string,
  courseInterest?: string
) {
  const supabase = createClient();
  
  let schoolId: string;
  let leadName: string;
  let leadEmail: string;
  let leadPhone: string;
  let interest: string;

  if (typeof schoolIdOrInput === 'object') {
    schoolId = schoolIdOrInput.schoolId;
    leadName = schoolIdOrInput.name;
    leadEmail = schoolIdOrInput.email;
    leadPhone = schoolIdOrInput.phone;
    interest = schoolIdOrInput.courseInterest || schoolIdOrInput.notes || 'Geral';
  } else {
    schoolId = schoolIdOrInput;
    leadName = name!;
    leadEmail = email!;
    leadPhone = phone!;
    interest = courseInterest || 'Geral';
  }

  const { data, error } = await supabase
    .from('leads')
    .insert({
      school_id: schoolId,
      name: leadName,
      email: leadEmail,
      phone: leadPhone,
      course_interest: interest,
      source: 'landing_page',
      status: 'new'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
