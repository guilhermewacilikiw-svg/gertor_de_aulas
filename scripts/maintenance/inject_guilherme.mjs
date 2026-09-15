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
    
    const email = 'guilherme.wacilikiw@gmail.com';
    const name = 'Guilherme';
    const schoolName = 'wakoda';
    const password = '123456';

    // Cria Escola
    const resSchool = await client.query(`INSERT INTO public.schools (name) VALUES ($1) RETURNING id`, [schoolName]);
    const schoolId = resSchool.rows[0].id;

    // Cria Auth User
    const authId = crypto.randomUUID();
    await client.query(`
      INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at
      ) VALUES (
        $1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
        $2, crypt($3, gen_salt('bf')), now(), 
        '{"provider": "email", "providers": ["email"]}', '{}', now(), now()
      )
    `, [authId, email, password]);
    
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

    // Cria Perfil Público
    const resPubUser = await client.query(`
      INSERT INTO public.users (auth_user_id, name, email, status)
      VALUES ($1, $2, $3, 'active')
      RETURNING id
    `, [authId, name, email]);
    
    const userId = resPubUser.rows[0].id;

    // Conecta como Diretor
    await client.query(`
      INSERT INTO public.school_memberships (school_id, user_id, role, status)
      VALUES ($1, $2, $3, 'active')
    `, [schoolId, userId, 'SCHOOL_ADMIN']);

    console.log(`Sucesso! Criado usuário ${email} para a escola ${schoolName}.`);

  } catch (err) {
    console.error('Execution error', err.stack);
  } finally {
    await client.end();
  }
}

run();
