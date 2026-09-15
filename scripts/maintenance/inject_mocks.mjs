import pg from 'pg';
import crypto from 'crypto';

const connectionString = 'postgresql://postgres.sabwsllulwcqzlsevhle:Guigui151293@aws-0-us-west-2.pooler.supabase.com:6543/postgres';

async function run() {
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    // 1. Limpar resquícios
    await client.query(`DELETE FROM auth.users WHERE email IN ('admin@escola.com', 'joao@escola.com', 'carlos@escola.com')`);

    // 2. Garantir Escola
    const { rows: schoolRows } = await client.query(`SELECT id FROM public.schools LIMIT 1`);
    let schoolId = schoolRows.length > 0 ? schoolRows[0].id : null;
    if (!schoolId) {
      const res = await client.query(`INSERT INTO public.schools (name) VALUES ('Escola Wackoda') RETURNING id`);
      schoolId = res.rows[0].id;
    }

    async function injectMockUser(email, name, role) {
      const authId = crypto.randomUUID();

      await client.query(`
        INSERT INTO auth.users (
          id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
          raw_app_meta_data, raw_user_meta_data, created_at, updated_at
        ) VALUES (
          $1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
          $2, crypt('123456', gen_salt('bf')), now(), 
          '{"provider": "email", "providers": ["email"]}', '{}', now(), now()
        )
      `, [authId, email]);
      
      const identityDataStr = JSON.stringify({ sub: authId, email: email });

      await client.query(`
        INSERT INTO auth.identities (
          id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
        ) VALUES (
          $1::uuid, $1::uuid, 
          $2::jsonb, 
          'email', $1::text, now(), now(), now()
        )
      `, [authId, identityDataStr]);

      const resPubUser = await client.query(`
        INSERT INTO public.users (auth_user_id, name, email, status)
        VALUES ($1, $2, $3, 'active')
        RETURNING id
      `, [authId, name, email]);
      
      const userId = resPubUser.rows[0].id;

      await client.query(`
        INSERT INTO public.school_memberships (school_id, user_id, role, status)
        VALUES ($1, $2, $3, 'active')
      `, [schoolId, userId, role]);

      if (role === 'STUDENT') {
        await client.query(`
          INSERT INTO public.students (school_id, user_id, name, email, xp_points, level)
          VALUES ($1, $2, $3, $4, 0, 1)
        `, [schoolId, userId, name, email]);
      }
      if (role === 'TEACHER') {
        await client.query(`
          INSERT INTO public.teachers (school_id, user_id, specialty)
          VALUES ($1, $2, $3)
        `, [schoolId, userId, 'Música']);
      }
      console.log(`Mock user ${email} injetado com sucesso!`);
    }

    await injectMockUser('admin@escola.com', 'Gestor Admin', 'SCHOOL_ADMIN');
    await injectMockUser('carlos@escola.com', 'Carlos (Professor)', 'TEACHER');
    await injectMockUser('joao@escola.com', 'Joãozinho (Aluno)', 'STUDENT');

  } catch (err) {
    console.error('Execution error', err.stack);
  } finally {
    await client.end();
  }
}

run();
