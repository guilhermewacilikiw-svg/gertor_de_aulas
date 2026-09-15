import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://sabwsllulwcqzlsevhle.supabase.co';
// Read from .env.local for service key to bypass RLS for testing, or just use anon key if RPC is SECURITY DEFINER
// Actually, let's just log in as admin.wakoda@gmail.com
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function runTests() {
  console.log('Logging in...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin.wakoda@gmail.com',
    password: 'Password@123!'
  });

  if (authError) {
    console.error('Login error:', authError);
    return;
  }
  
  const user = authData.user;
  console.log('Logged in as', user.email);

  // 1. Get publicUser
  const { data: publicUser } = await supabase.from('users').select('id').eq('auth_user_id', user.id).single();
  console.log('Public User ID:', publicUser?.id);

  // 2. Get school_id
  const { data: membership } = await supabase.from('school_memberships').select('school_id').eq('user_id', publicUser.id).single();
  const SCHOOL_ID = membership?.school_id;
  console.log('School ID:', SCHOOL_ID);

  if (!SCHOOL_ID) return;

  // 3. Create Course
  console.log('Testing create course...');
  const { data: courseData, error: courseError } = await supabase.from('courses').insert({
    school_id: SCHOOL_ID,
    name: 'Curso Teste Automação',
    description: 'Teste',
    status: 'active'
  }).select('id').single();
  
  if (courseError) {
    console.error('Error creating course:', courseError);
  } else {
    console.log('Course created:', courseData.id);
  }

  // 4. Create Teacher
  console.log('Testing create teacher...');
  const { data: teacherRes, error: teacherError } = await supabase.rpc('admin_create_teacher', {
    p_name: 'Professor Teste',
    p_email: 'prof.teste' + Date.now() + '@escola.com',
    p_password: 'senha',
    p_school_id: SCHOOL_ID,
    p_specialty: 'Teste'
  });

  if (teacherError) {
    console.error('Error creating teacher:', teacherError);
  } else if (teacherRes?.error) {
    console.error('RPC returned error for teacher:', teacherRes.error);
  } else {
    console.log('Teacher created:', teacherRes);
  }

  // 5. Create Class
  console.log('Testing create class...');
  const { data: classData, error: classError } = await supabase.from('classes').insert({
    school_id: SCHOOL_ID,
    name: 'Turma Teste',
    course_id: courseData?.id || '00000000-0000-0000-0000-000000000000',
    teacher_id: teacherRes?.teacher_id || null,
    capacity: 30,
    status: 'active'
  }).select('id').single();

  if (classError) {
    console.error('Error creating class:', classError);
  } else {
    console.log('Class created:', classData.id);
  }

  console.log('Tests completed.');
}

runTests();
