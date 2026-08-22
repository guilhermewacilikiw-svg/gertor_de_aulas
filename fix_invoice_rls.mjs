import pg from 'pg';
const { Client } = pg;
const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.sabwsllulwcqzlsevhle:Guigui151293@aws-0-us-west-2.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});
await client.connect();
await client.query(`
  GRANT SELECT, INSERT, UPDATE, DELETE ON student_invoices TO authenticated;
  GRANT SELECT, INSERT, UPDATE, DELETE ON student_finances TO authenticated;
  ALTER TABLE student_invoices ENABLE ROW LEVEL SECURITY;
  
  DROP POLICY IF EXISTS "Students can read their invoices" ON student_invoices;
  CREATE POLICY "Students can read their invoices" ON student_invoices FOR SELECT 
  USING (student_id IN (SELECT id FROM students WHERE user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid())));
  
  DROP POLICY IF EXISTS "Admins can manage invoices" ON student_invoices;
  CREATE POLICY "Admins can manage invoices" ON student_invoices FOR ALL 
  USING (school_id IN (SELECT school_id FROM school_memberships WHERE user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid())));
`);
await client.end();
console.log('Fixed RLS for invoices');
