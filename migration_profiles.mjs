import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.sabwsllulwcqzlsevhle:Guigui151293@aws-0-us-west-2.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  console.log('Connected to DB');

  try {
    await client.query('BEGIN');

    // 1. Add missing columns to teachers
    await client.query(`
      ALTER TABLE public.teachers 
      ADD COLUMN IF NOT EXISTS birth_date DATE,
      ADD COLUMN IF NOT EXISTS phone TEXT;
    `);

    // 2. Recreate admin_create_student RPC
    await client.query(`
CREATE OR REPLACE FUNCTION public.admin_create_student(
  p_school_id uuid,
  p_name text,
  p_email text,
  p_password text,
  p_cpf text DEFAULT NULL,
  p_phone text DEFAULT NULL,
  p_birth_date date DEFAULT NULL
) RETURNS jsonb AS $$
DECLARE
  v_caller_role public.user_role;
  v_new_auth_id uuid;
  v_new_user_id uuid;
  v_new_student_id uuid;
BEGIN
  -- 1. Check if the caller is SCHOOL_ADMIN or MANAGER of the target school
  SELECT role INTO v_caller_role
  FROM public.school_memberships
  WHERE user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
    AND school_id = p_school_id
    AND status = 'active';

  IF v_caller_role IS NULL OR v_caller_role NOT IN ('SCHOOL_ADMIN', 'MANAGER') THEN
    RAISE EXCEPTION 'Unauthorized: Caller must be an admin of this school.';
  END IF;

  -- 2. Check if email already exists in auth.users
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = p_email) THEN
    RAISE EXCEPTION 'Email já está em uso.';
  END IF;

  -- 3. Create the auth.user
  v_new_auth_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, phone
  ) VALUES (
    v_new_auth_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    p_email, public.crypt(p_password, public.gen_salt('bf')), now(), 
    '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), p_phone
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    v_new_auth_id, v_new_auth_id, 
    jsonb_build_object('sub', v_new_auth_id, 'email', p_email), 
    'email', p_email, now(), now(), now()
  );

  -- 4. Create public.users profile
  INSERT INTO public.users (auth_user_id, name, email, phone, status)
  VALUES (v_new_auth_id, p_name, p_email, p_phone, 'active')
  RETURNING id INTO v_new_user_id;

  -- 5. Create school_memberships
  INSERT INTO public.school_memberships (school_id, user_id, role, status)
  VALUES (p_school_id, v_new_user_id, 'STUDENT', 'active');

  -- 6. Create public.students
  INSERT INTO public.students (school_id, user_id, name, email, cpf, phone, birth_date, status, xp_points, level)
  VALUES (p_school_id, v_new_user_id, p_name, p_email, p_cpf, p_phone, p_birth_date, 'active', 0, 1)
  RETURNING id INTO v_new_student_id;

  -- Return success
  RETURN jsonb_build_object(
    'success', true,
    'student_id', v_new_student_id,
    'user_id', v_new_user_id
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
    `);

    // 3. Recreate admin_create_teacher RPC
    await client.query(`
CREATE OR REPLACE FUNCTION public.admin_create_teacher(
  p_school_id uuid,
  p_name text,
  p_email text,
  p_password text,
  p_specialty text,
  p_cpf text DEFAULT NULL,
  p_phone text DEFAULT NULL,
  p_birth_date date DEFAULT NULL
) RETURNS jsonb AS $$
DECLARE
  v_caller_role public.user_role;
  v_new_auth_id uuid;
  v_new_user_id uuid;
  v_new_teacher_id uuid;
BEGIN
  -- 1. Check if the caller is SCHOOL_ADMIN or MANAGER of the target school
  SELECT role INTO v_caller_role
  FROM public.school_memberships
  WHERE user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
    AND school_id = p_school_id
    AND status = 'active';

  IF v_caller_role IS NULL OR v_caller_role NOT IN ('SCHOOL_ADMIN', 'MANAGER') THEN
    RAISE EXCEPTION 'Unauthorized: Caller must be an admin of this school.';
  END IF;

  -- 2. Check if email already exists in auth.users
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = p_email) THEN
    RAISE EXCEPTION 'Email já está em uso.';
  END IF;

  -- 3. Create the auth.user
  v_new_auth_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, phone
  ) VALUES (
    v_new_auth_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    p_email, public.crypt(p_password, public.gen_salt('bf')), now(), 
    '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), p_phone
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    v_new_auth_id, v_new_auth_id, 
    jsonb_build_object('sub', v_new_auth_id, 'email', p_email), 
    'email', p_email, now(), now(), now()
  );

  -- 4. Create public.users profile
  INSERT INTO public.users (auth_user_id, name, email, phone, status)
  VALUES (v_new_auth_id, p_name, p_email, p_phone, 'active')
  RETURNING id INTO v_new_user_id;

  -- 5. Create school_memberships
  INSERT INTO public.school_memberships (school_id, user_id, role, status)
  VALUES (p_school_id, v_new_user_id, 'TEACHER', 'active');

  -- 6. Create public.teachers
  INSERT INTO public.teachers (school_id, user_id, specialty, cpf, phone, birth_date, status)
  VALUES (p_school_id, v_new_user_id, p_specialty, p_cpf, p_phone, p_birth_date, 'active')
  RETURNING id INTO v_new_teacher_id;

  -- Return success
  RETURN jsonb_build_object(
    'success', true,
    'teacher_id', v_new_teacher_id,
    'user_id', v_new_user_id
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
    `);

    await client.query('COMMIT');
    console.log('Migration successful');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
  } finally {
    await client.end();
  }
}

run();
