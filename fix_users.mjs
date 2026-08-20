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

  try {
    await client.connect();
    
    // 1. Apagar os usuários antigos do public e auth (cascata)
    await client.query(`DELETE FROM auth.users WHERE email IN ('admin@escola.com', 'joao@escola.com', 'carlos@escola.com')`);
    
    // 2. Garantir que a escola de teste exista
    const { rows: schoolRows } = await client.query(`SELECT id FROM public.schools LIMIT 1`);
    let schoolId;
    if (schoolRows.length === 0) {
      const res = await client.query(`INSERT INTO public.schools (name) VALUES ('Escola Wackoda') RETURNING id`);
      schoolId = res.rows[0].id;
    } else {
      schoolId = schoolRows[0].id;
    }

    // Função auxiliar para criar via GoTrue e depois arrumar no BD
    async function createUserProperly(email, password, name, role) {
      console.log(`Creating ${email}...`);
      // Cria via GoTrue (API Oficial)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error(`Error signing up ${email}:`, error);
        return;
      }
      
      const authId = data.user.id;

      // Confirma o e-mail no banco
      await client.query(`UPDATE auth.users SET email_confirmed_at = now() WHERE id = $1`, [authId]);

      // Cria os perfis públicos
      const userRes = await client.query(`
        INSERT INTO public.users (auth_user_id, name, email, status)
        VALUES ($1, $2, $3, 'active')
        RETURNING id
      `, [authId, name, email]);
      
      const userId = userRes.rows[0].id;

      // Cria a membership
      await client.query(`
        INSERT INTO public.school_memberships (school_id, user_id, role, status)
        VALUES ($1, $2, $3, 'active')
      `, [schoolId, userId, role]);

      // Se for aluno, cria o student
      if (role === 'STUDENT') {
        await client.query(`
          INSERT INTO public.students (school_id, user_id, name, email, xp_points, level)
          VALUES ($1, $2, $3, $4, 0, 1)
        `, [schoolId, userId, name, email]);
      }
      
      // Se for professor, cria o teacher
      if (role === 'TEACHER') {
        await client.query(`
          INSERT INTO public.teachers (school_id, user_id, specialty)
          VALUES ($1, $2, $3)
        `, [schoolId, userId, 'Música']);
      }
      
      console.log(`${email} created successfully!`);
    }

    await createUserProperly('admin@escola.com', '123456', 'Gestor Admin', 'SCHOOL_ADMIN');
    await createUserProperly('carlos@escola.com', '123456', 'Carlos (Professor)', 'TEACHER');
    await createUserProperly('joao@escola.com', '123456', 'Joãozinho (Aluno)', 'STUDENT');

  } catch (err) {
    console.error('Execution error', err.stack);
  } finally {
    await client.end();
  }
}

run();
