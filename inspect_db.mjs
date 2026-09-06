import pg from 'pg';

const connectionString = 'postgresql://postgres.sabwsllulwcqzlsevhle:Guigui151293@aws-0-us-west-2.pooler.supabase.com:6543/postgres';

async function run() {
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    await client.query(`ALTER TABLE assessment_items ADD COLUMN IF NOT EXISTS is_highlighted BOOLEAN DEFAULT false;`);
    await client.query(`DROP POLICY IF EXISTS "Teachers and admins manage assessments" ON assessments;`);
    await client.query(`
      CREATE POLICY "Teachers and admins manage assessments" ON assessments
        FOR ALL USING (
          has_school_role(school_id, 'TEACHER'::user_role) OR
          has_school_role(school_id, 'SCHOOL_ADMIN'::user_role) OR
          has_school_role(school_id, 'MANAGER'::user_role)
        ) WITH CHECK (
          has_school_role(school_id, 'TEACHER'::user_role) OR
          has_school_role(school_id, 'SCHOOL_ADMIN'::user_role) OR
          has_school_role(school_id, 'MANAGER'::user_role)
        );
    `);
    await client.query(`DROP POLICY IF EXISTS "Teachers and admins manage assessment items" ON assessment_items;`);
    await client.query(`
      CREATE POLICY "Teachers and admins manage assessment items" ON assessment_items
        FOR ALL USING (
          has_school_role(school_id, 'TEACHER'::user_role) OR
          has_school_role(school_id, 'SCHOOL_ADMIN'::user_role) OR
          has_school_role(school_id, 'MANAGER'::user_role)
        ) WITH CHECK (
          has_school_role(school_id, 'TEACHER'::user_role) OR
          has_school_role(school_id, 'SCHOOL_ADMIN'::user_role) OR
          has_school_role(school_id, 'MANAGER'::user_role)
        );
    `);
    console.log("ASSESSMENT_RLS_MIGRATED_SUCCESSFULLY");

  } catch (err) {
    console.error('Execution error', err.stack);
  } finally {
    await client.end();
    process.exit(0);
  }
}

run();
