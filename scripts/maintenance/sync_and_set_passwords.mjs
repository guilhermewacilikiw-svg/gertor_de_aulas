import { createClient } from '@supabase/supabase-js';
import pg from 'pg';

const supabaseUrl = 'https://sabwsllulwcqzlsevhle.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhYndzbGx1bHdjcXpsc2V2aGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0NDc5MzgsImV4cCI6MjEwMjAyMzkzOH0.MlBFC0YQXmaO0uYcoioVqOqWbaaL5vt27jnHGrv3tB8';

const supabase = createClient(supabaseUrl, supabaseKey);
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.sabwsllulwcqzlsevhle:Guigui151293@aws-0-us-west-2.pooler.supabase.com:6543/postgres';

async function syncAndSetPasswords() {
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log("Configurando e sincronizando credenciais de login em auth.users...\n");

  const defaultPassword = 'Password123!';

  // Clean table data and re-run seed to map cleanly
  await client.query("DELETE FROM public.users");
  
  const usersToRegister = [
    { email: 'admin@harmonia.com.br', name: 'Admin Harmonia', role: 'SCHOOL_ADMIN', schoolId: '11111111-1111-1111-1111-111111111111' },
    { email: 'carlos@harmonia.com.br', name: 'Carlos Silva', role: 'TEACHER', schoolId: '11111111-1111-1111-1111-111111111111' },
    { email: 'joao@harmonia.com.br', name: 'João Pedro', role: 'STUDENT', schoolId: '11111111-1111-1111-1111-111111111111' },
    { email: 'maria@harmonia.com.br', name: 'Maria Oliveira', role: 'STUDENT', schoolId: '11111111-1111-1111-1111-111111111111' },
    { email: 'admin@ritmo.com.br', name: 'Admin Ritmo', role: 'SCHOOL_ADMIN', schoolId: '22222222-2222-2222-2222-222222222222' },
    { email: 'ana@ritmo.com.br', name: 'Ana Costa', role: 'TEACHER', schoolId: '22222222-2222-2222-2222-222222222222' },
    { email: 'pedro@ritmo.com.br', name: 'Pedro Santos', role: 'STUDENT', schoolId: '22222222-2222-2222-2222-222222222222' }
  ];

  for (const u of usersToRegister) {
    let authId = null;
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: u.email,
      password: defaultPassword,
      options: { data: { name: u.name } }
    });

    if (authData?.user?.id) {
      authId = authData.user.id;
    } else {
      // If already registered, fetch auth.users ID directly from DB
      const { rows } = await client.query(`SELECT id FROM auth.users WHERE email = '${u.email}'`);
      if (rows.length > 0) {
        authId = rows[0].id;
      }
    }

    if (authId) {
      // Upsert public.users
      const resUser = await client.query(`
        INSERT INTO public.users (auth_user_id, name, email, status)
        VALUES ('${authId}', '${u.name}', '${u.email}', 'active')
        ON CONFLICT (auth_user_id) DO UPDATE SET email = EXCLUDED.email
        RETURNING id
      `);
      const pubUserId = resUser.rows[0].id;

      // Upsert school_memberships
      await client.query(`
        INSERT INTO public.school_memberships (school_id, user_id, role, status)
        VALUES ('${u.schoolId}', '${pubUserId}', '${u.role}', 'active')
        ON CONFLICT DO NOTHING
      `);

      // Profiles
      if (u.role === 'TEACHER') {
        await client.query(`
          INSERT INTO public.teachers (school_id, user_id, specialty)
          VALUES ('${u.schoolId}', '${pubUserId}', 'Música & Artes')
          ON CONFLICT DO NOTHING
        `);
      } else if (u.role === 'STUDENT') {
        await client.query(`
          INSERT INTO public.students (school_id, user_id, name, email, student_code)
          VALUES ('${u.schoolId}', '${pubUserId}', '${u.name}', '${u.email}', 'MAT-${Math.floor(100 + Math.random() * 900)}')
          ON CONFLICT DO NOTHING
        `);
      }

      console.log(`[USER OK] ${u.email} (${u.role}) -> Auth ID: ${authId}`);
    }
  }

  // Re-run seed to restore sample lessons
  console.log("\nRestaurando dados fictícios de turmas e aulas...");
  const seedSql = await import('fs').then(m => m.readFileSync('supabase/seed.sql', 'utf8'));
  // Execute seed query parts safely
  await client.query(`
    INSERT INTO courses (id, school_id, name, description, category, level)
    VALUES ('10000000-0000-0000-0000-300000000001', '11111111-1111-1111-1111-111111111111', 'Violão Básico', 'Curso prático para iniciantes.', 'Música', 'Iniciante')
    ON CONFLICT DO NOTHING;

    INSERT INTO classes (id, school_id, course_id, teacher_id, name, level)
    VALUES ('10000000-0000-0000-0000-400000000001', '11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-300000000001', (SELECT id FROM teachers LIMIT 1), 'Turma Violão A', 'Iniciante')
    ON CONFLICT DO NOTHING;

    INSERT INTO lessons (id, school_id, class_id, teacher_id, scheduled_start, scheduled_end, status, topic)
    VALUES ('10000000-0000-0000-0000-500000000001', '11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-400000000001', (SELECT id FROM teachers LIMIT 1), NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day 1 hour', 'scheduled', 'Acordes Maiores (C, D, G) e Batida Pop')
    ON CONFLICT DO NOTHING;
  `);

  console.log("\n==================================================");
  console.log("  TODAS AS CREDENCIAIS FORAM CONFIGURADAS!       ");
  console.log("==================================================");

  await client.end();
}

syncAndSetPasswords();
