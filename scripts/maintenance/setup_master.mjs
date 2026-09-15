import { createClient } from '@supabase/supabase-js';
import pg from 'pg';

const supabaseUrl = 'https://sabwsllulwcqzlsevhle.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhYndzbGx1bHdjcXpsc2V2aGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0NDc5MzgsImV4cCI6MjEwMjAyMzkzOH0.MlBFC0YQXmaO0uYcoioVqOqWbaaL5vt27jnHGrv3tB8';

const supabase = createClient(supabaseUrl, supabaseKey);
const connectionString = 'postgresql://postgres.sabwsllulwcqzlsevhle:Guigui151293@aws-0-us-west-2.pooler.supabase.com:6543/postgres';

async function run() {
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();

  console.log("Creating SaaS Master Account...");
  const password = 'Password@123!';
  const email = 'master@wakoda.com.br';
  const name = 'Wakoda Admin';
  const role = 'SUPER_ADMIN';

  // 1. Create a "Wackoda SaaS HQ" school for the master to be attached to
  const resSchool = await client.query(`
    INSERT INTO public.schools (name, status) 
    VALUES ('Wackoda SaaS HQ', 'active') 
    RETURNING id
  `);
  const schoolId = resSchool.rows[0].id;

  // 2. SignUp
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: { data: { name } }
  });

  if (authError) {
    console.log(`Erro ao criar Auth do Master:`, authError.message);
  } else {
    const userId = authData.user.id;

    // 3. Create public.users
    const resUser = await client.query(`
      INSERT INTO public.users (auth_user_id, name, email, status)
      VALUES ($1, $2, $3, 'active')
      RETURNING id
    `, [userId, name, email]);
    const pubUserId = resUser.rows[0].id;

    // 4. Create Membership
    await client.query(`
      INSERT INTO public.school_memberships (school_id, user_id, role, status)
      VALUES ($1, $2, $3, 'active')
    `, [schoolId, pubUserId, role]);

    // Force confirm just in case
    await client.query(`
      UPDATE auth.users SET email_confirmed_at = now() WHERE id = $1
    `, [userId]);

    console.log(`Master account created: ${email}`);
  }

  console.log("Creating RPC functions...");

  await client.query(`
    -- Check if SUPER_ADMIN
    CREATE OR REPLACE FUNCTION public.is_super_admin()
    RETURNS BOOLEAN AS $$
    BEGIN
      RETURN EXISTS (
        SELECT 1 FROM school_memberships sm
        JOIN users u ON sm.user_id = u.id
        WHERE u.auth_user_id = auth.uid() AND sm.role = 'SUPER_ADMIN'
      );
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Fetch all schools bypassing RLS
    CREATE OR REPLACE FUNCTION public.saas_get_all_schools()
    RETURNS JSON AS $$
    DECLARE
      result JSON;
    BEGIN
      IF NOT public.is_super_admin() THEN
        RAISE EXCEPTION 'Acesso Negado';
      END IF;
      
      SELECT json_agg(row_to_json(s)) INTO result
      FROM (
        SELECT 
          s.id, s.name, s.email, s.phone, s.status, s.created_at,
          (SELECT count(*) FROM students WHERE school_id = s.id) as total_students,
          (SELECT count(*) FROM teachers WHERE school_id = s.id) as total_teachers
        FROM schools s
        ORDER BY s.created_at DESC
      ) s;
      
      RETURN COALESCE(result, '[]'::json);
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Fetch all users bypassing RLS
    CREATE OR REPLACE FUNCTION public.saas_get_all_users()
    RETURNS JSON AS $$
    DECLARE
      result JSON;
    BEGIN
      IF NOT public.is_super_admin() THEN
        RAISE EXCEPTION 'Acesso Negado';
      END IF;
      
      SELECT json_agg(row_to_json(u)) INTO result
      FROM (
        SELECT 
          u.id, u.name, u.email, u.status, u.created_at,
          sm.role, s.name as school_name
        FROM users u
        JOIN school_memberships sm ON u.id = sm.user_id
        JOIN schools s ON sm.school_id = s.id
        ORDER BY u.created_at DESC
      ) u;
      
      RETURN COALESCE(result, '[]'::json);
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `);

  console.log("Master RPCs created successfully.");

  await client.end();
}

run();
