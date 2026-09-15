import pg from 'pg';

const connectionString = 'postgresql://postgres.sabwsllulwcqzlsevhle:Guigui151293@aws-0-us-west-2.pooler.supabase.com:6543/postgres';

async function run() {
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    const res = await client.query(`SELECT id, email, encrypted_password, is_sso_user FROM auth.users ORDER BY created_at DESC LIMIT 2`);
    console.log("Users:", res.rows);

    const ident = await client.query(`SELECT id, user_id, provider, provider_id FROM auth.identities LIMIT 2`);
    console.log("Identities:", ident.rows);

  } catch (err) {
    console.error('Execution error', err.stack);
  } finally {
    await client.end();
  }
}

run();
