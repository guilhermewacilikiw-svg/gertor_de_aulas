import pg from 'pg';

const connectionString = 'postgresql://postgres.sabwsllulwcqzlsevhle:Guigui151293@aws-0-us-west-2.pooler.supabase.com:6543/postgres';

async function run() {
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    // Create RLS Policy for school_memberships
    await client.query(`
      CREATE POLICY "Users can view their own memberships"
      ON school_memberships FOR SELECT
      USING (user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()));
    `);
    console.log("Policy created successfully.");

  } catch (err) {
    if (err.message.includes('already exists')) {
        console.log("Policy already exists.");
    } else {
        console.error('Execution error', err.stack);
    }
  } finally {
    await client.end();
    process.exit(0);
  }
}

run();
