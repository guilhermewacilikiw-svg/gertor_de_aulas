import pg from 'pg';
const { Client } = pg;
const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.sabwsllulwcqzlsevhle:Guigui151293@aws-0-us-west-2.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});
await client.connect();
await client.query(`
  CREATE POLICY "Users can create schools" ON schools FOR INSERT WITH CHECK (true);
  CREATE POLICY "Users can create their own membership" ON school_memberships FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));
`);
console.log('RLS fixed');
await client.end();
