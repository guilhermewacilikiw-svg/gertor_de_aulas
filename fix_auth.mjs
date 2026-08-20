import pg from 'pg';

const connectionString = 'postgresql://postgres.sabwsllulwcqzlsevhle:Guigui151293@aws-0-us-west-2.pooler.supabase.com:6543/postgres';

async function run() {
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();

  console.log("Fixing Auth Users...");

  const users = [
    { id: '22222222-2222-2222-2222-222222222222', email: 'admin@escola.com' },
    { id: '33333333-3333-3333-3333-333333333333', email: 'carlos@escola.com' },
    { id: '55555555-5555-5555-5555-555555555555', email: 'joao@escola.com' }
  ];

  for (const u of users) {
    try {
      await client.query(`
        INSERT INTO auth.users (
          id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
          raw_app_meta_data, raw_user_meta_data, created_at, updated_at
        ) VALUES (
          $1::uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', $2, crypt('123456', gen_salt('bf')), now(),
          jsonb_build_object('provider', 'email', 'providers', array['email']), '{}', now(), now()
        )
        ON CONFLICT (id) DO UPDATE SET encrypted_password = crypt('123456', gen_salt('bf'));
      `, [u.id, u.email]);
      
      await client.query(`
        INSERT INTO auth.identities (
          id, user_id, identity_data, provider, provider_id, created_at, updated_at, last_sign_in_at
        ) VALUES (
          $1::uuid, $1::uuid, jsonb_build_object('sub', $1::text, 'email', $2::text), 'email', $2::text, now(), now(), now()
        )
        ON CONFLICT DO NOTHING;
      `, [u.id, u.email]);
      console.log(`User ${u.email} fixed.`);
    } catch(e) {
      console.log(`Failed for ${u.email}:`, e.message);
    }
  }

  await client.end();
}

run();
