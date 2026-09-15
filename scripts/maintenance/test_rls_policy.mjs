import pg from 'pg';

const connectionString = 'postgresql://postgres.sabwsllulwcqzlsevhle:Guigui151293@aws-0-us-west-2.pooler.supabase.com:6543/postgres';

async function run() {
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    // Simulate auth context
    await client.query(`set local role authenticated`);
    await client.query(`set local "request.jwt.claims" to '{"sub": "f6b96371-0137-4959-80c7-a57958e4b2d9"}'`);

    const res = await client.query(`SELECT * FROM public.school_memberships`);
    console.log("With RLS:");
    console.table(res.rows);

  } catch (err) {
    console.error('Execution error', err.stack);
  } finally {
    await client.end();
    process.exit(0);
  }
}

run();
