import pg from 'pg';

const connectionString = 'postgresql://postgres.sabwsllulwcqzlsevhle:Guigui151293@aws-0-us-west-2.pooler.supabase.com:6543/postgres';

async function run() {
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    // Deleta identidades inválidas (que envenenaram o GoTrue)
    await client.query(`DELETE FROM auth.users WHERE id IN (SELECT user_id FROM auth.identities WHERE provider_id LIKE '%@%')`);
    console.log("Deleted poisoned users!");

  } catch (err) {
    console.error('Execution error', err.stack);
  } finally {
    await client.end();
  }
}

run();
