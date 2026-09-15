import pg from 'pg';

const connectionString = 'postgresql://postgres.sabwsllulwcqzlsevhle:Guigui151293@aws-0-us-west-2.pooler.supabase.com:6543/postgres';

async function run() {
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    await client.query(`DROP POLICY IF EXISTS "Users can view their own memberships" ON school_memberships`);
    
    await client.query(`
      CREATE POLICY "Users can view their own memberships"
      ON school_memberships FOR SELECT
      USING (true);
    `);
    
    console.log("Policy updated to USING (true)");

  } catch (err) {
    console.error('Execution error', err.stack);
  } finally {
    await client.end();
    process.exit(0);
  }
}

run();
