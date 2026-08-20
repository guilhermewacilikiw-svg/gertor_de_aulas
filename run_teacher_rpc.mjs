import pg from 'pg';
import fs from 'fs';

const { Client } = pg;

const connectionString = 'postgresql://postgres.sabwsllulwcqzlsevhle:Guigui151293@aws-0-us-west-2.pooler.supabase.com:6543/postgres';

async function runSQL() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected to Supabase!");

    const sql = fs.readFileSync('setup_teacher_rpc.sql', 'utf8');
    console.log("Executing setup_teacher_rpc.sql...");
    await client.query(sql);
    console.log("RPC created successfully!");

  } catch (err) {
    console.error('Connection error', err.stack);
  } finally {
    await client.end();
  }
}

runSQL();
