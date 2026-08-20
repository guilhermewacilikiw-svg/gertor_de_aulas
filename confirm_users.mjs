import pg from 'pg';

const connectionString = 'postgresql://postgres.sabwsllulwcqzlsevhle:Guigui151293@aws-0-us-west-2.pooler.supabase.com:6543/postgres';

async function run() {
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    // Force email confirmation for all users
    const res = await client.query(`
      UPDATE auth.users 
      SET email_confirmed_at = now() 
      WHERE email_confirmed_at IS NULL
    `);
    console.log(`Confirmed ${res.rowCount} users.`);

  } catch (err) {
    console.error('Execution error', err.stack);
  } finally {
    await client.end();
    process.exit(0);
  }
}

run();
