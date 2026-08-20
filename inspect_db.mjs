import pg from 'pg';

const connectionString = 'postgresql://postgres.sabwsllulwcqzlsevhle:Guigui151293@aws-0-us-west-2.pooler.supabase.com:6543/postgres';

async function run() {
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    const users = await client.query(`SELECT id, auth_user_id, email FROM public.users`);
    console.log("public.users:");
    console.table(users.rows);

    const memberships = await client.query(`SELECT id, user_id, role FROM public.school_memberships`);
    console.log("public.school_memberships:");
    console.table(memberships.rows);

  } catch (err) {
    console.error('Execution error', err.stack);
  } finally {
    await client.end();
    process.exit(0);
  }
}

run();
