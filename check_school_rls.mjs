import pg from 'pg';
const { Client } = pg;
const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.sabwsllulwcqzlsevhle:Guigui151293@aws-0-us-west-2.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});
await client.connect();
const { rows } = await client.query("SELECT policyname, cmd FROM pg_policies WHERE tablename = 'school_memberships'");
console.log(rows);
await client.end();
