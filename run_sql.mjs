import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Client } = pg;

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.sabwsllulwcqzlsevhle:Guigui151293@aws-0-us-west-2.pooler.supabase.com:6543/postgres';

async function runSQL() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected to Supabase PostgreSQL!");

    console.log("Resetting public schema for a clean slate...");
    await client.query(`
      DROP SCHEMA IF EXISTS public CASCADE;
      CREATE SCHEMA public;
      GRANT ALL ON SCHEMA public TO postgres;
      GRANT ALL ON SCHEMA public TO public;
    `);
    console.log("Clean public schema created.");

    const migrations = [
      'supabase/migrations/20260815000001_core_schema.sql',
      'supabase/migrations/20260815000002_security_rls.sql',
      'supabase/migrations/20260815000003_auth_triggers.sql'
    ];

    for (const file of migrations) {
      console.log(`Executing migration: ${file}...`);
      const sql = fs.readFileSync(path.resolve(file), 'utf8');
      await client.query(sql);
      console.log(`Successfully applied ${file}`);
    }

    console.log("Executing seed SQL...");
    const seedSql = fs.readFileSync(path.resolve('supabase/seed.sql'), 'utf8');
    await client.query(seedSql);
    console.log("Seed data loaded successfully!");

  } catch (err) {
    console.error('Migration Execution Error:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runSQL();
