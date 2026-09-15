import pg from 'pg';

const connectionString = 'postgresql://postgres.sabwsllulwcqzlsevhle:Guigui151293@aws-0-us-west-2.pooler.supabase.com:6543/postgres';

async function run() {
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    const res = await client.query(`
      SELECT id, email, is_sso_user, email_confirmed_at, encrypted_password 
      FROM auth.users 
      WHERE email LIKE '%wakoda%'
    `);
    console.log("Users in auth.users:");
    console.table(res.rows);

    const ident = await client.query(`
      SELECT id, provider, provider_id, email 
      FROM auth.identities 
      WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE '%wakoda%')
    `);
    console.log("Identities:");
    console.table(ident.rows);

  } catch (err) {
    console.error('Execution error', err.stack);
  } finally {
    await client.end();
  }
}

run();
