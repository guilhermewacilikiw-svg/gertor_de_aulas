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

  console.log("Iniciando a criação de contas de teste 100% seguras através da API oficial...");
  
  const password = 'Password@123!';

  // 1. Criar Escola e pegar o ID
  const resSchool = await client.query(`INSERT INTO public.schools (name, status) VALUES ('Escola Wakoda (Teste)', 'active') RETURNING id`);
  const schoolId = resSchool.rows[0].id;
  console.log("Escola criada com sucesso!");

  async function createRoleUser(email, name, role) {
    // 1. SignUp usando GoTrue API (Seguro, com Hash, Políticas, etc)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: { data: { name } }
    });

    if (authError) {
      console.log(`Erro ao criar Auth de ${name}:`, authError.message);
      return;
    }
    
    const userId = authData.user.id;

    // 2. Criar public.users
    const resUser = await client.query(`
      INSERT INTO public.users (auth_user_id, name, email, status)
      VALUES ($1, $2, $3, 'active')
      RETURNING id
    `, [userId, name, email]);
    const pubUserId = resUser.rows[0].id;

    // 3. Criar Membership
    await client.query(`
      INSERT INTO public.school_memberships (school_id, user_id, role, status)
      VALUES ($1, $2, $3, 'active')
    `, [schoolId, pubUserId, role]);

    // 4. Perfil Específico
    if (role === 'STUDENT') {
      await client.query(`
        INSERT INTO public.students (school_id, user_id, name, email, xp_points, level)
        VALUES ($1, $2, $3, $4, 0, 1)
      `, [schoolId, pubUserId, name, email]);
    }
    if (role === 'TEACHER') {
      await client.query(`
        INSERT INTO public.teachers (school_id, user_id, specialty)
        VALUES ($1, $2, $3)
      `, [schoolId, pubUserId, 'Música Geral']);
    }

    console.log(`Usuário [${role}] criado com sucesso: ${email}`);
  }

  // Vamos criar 3 contas!
  await createRoleUser('admin.wakoda@gmail.com', 'Gestor Wakoda', 'SCHOOL_ADMIN');
  await createRoleUser('prof.wakoda@gmail.com', 'Professor Carlos', 'TEACHER');
  await createRoleUser('aluno.wakoda@gmail.com', 'Joãozinho', 'STUDENT');

  console.log("\\n=== TODAS AS CONTAS FORAM CRIADAS COM SUCESSO! ===");
  console.log("Senha padrão para todas as contas: Password@123!");
  
  await client.end();
}

run();
