import pg from 'pg';

const connectionString = 'postgresql://postgres.sabwsllulwcqzlsevhle:Guigui151293@aws-0-us-west-2.pooler.supabase.com:6543/postgres';

async function run() {
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    // The issue with raw SQL insertion is usually null values in columns GoTrue expects to be boolean
    await client.query(`
      UPDATE auth.users 
      SET is_sso_user = false, is_super_admin = false 
      WHERE is_sso_user IS NULL OR is_super_admin IS NULL
    `);
    console.log("Fixed boolean fields in auth.users");

    // Also check if there are any identities missing email
    await client.query(`
      UPDATE auth.identities
      SET email = (identity_data->>'email')::text
      WHERE email IS NULL
    `);
    console.log("Fixed email fields in auth.identities");

  } catch (err) {
    console.error('Execution error', err.stack);
  } finally {
    await client.end();
  }
}

run();
