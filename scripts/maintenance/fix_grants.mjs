import pg from 'pg';

const connectionString = 'postgresql://postgres.sabwsllulwcqzlsevhle:Guigui151293@aws-0-us-west-2.pooler.supabase.com:6543/postgres';

async function run() {
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    await client.query(`GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;`);
    await client.query(`GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;`);
    await client.query(`GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;`);
    await client.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;`);

    console.log("Grants applied successfully.");

  } catch (err) {
    console.error('Execution error', err.stack);
  } finally {
    await client.end();
    process.exit(0);
  }
}

run();
