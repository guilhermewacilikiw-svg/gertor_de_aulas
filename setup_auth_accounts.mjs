import { createClient } from '@supabase/supabase-js';
import pg from 'pg';

const supabaseUrl = 'https://sabwsllulwcqzlsevhle.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhYndzbGx1bHdjcXpsc2V2aGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0NDc5MzgsImV4cCI6MjEwMjAyMzkzOH0.MlBFC0YQXmaO0uYcoioVqOqWbaaL5vt27jnHGrv3tB8';

const supabase = createClient(supabaseUrl, supabaseKey);
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.sabwsllulwcqzlsevhle:Guigui151293@aws-0-us-west-2.pooler.supabase.com:6543/postgres';

async function setupAuthAccounts() {
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log("Setting up Supabase Auth credentials for Wackoda Experience users...\n");

  const password = 'Password123!';

  const usersToCreate = [
    { email: 'admin@harmonia.com.br', name: 'Admin Harmonia' },
    { email: 'carlos@harmonia.com.br', name: 'Carlos Silva' },
    { email: 'joao@harmonia.com.br', name: 'João Pedro' },
    { email: 'maria@harmonia.com.br', name: 'Maria Oliveira' },
    { email: 'admin@ritmo.com.br', name: 'Admin Ritmo' },
    { email: 'ana@ritmo.com.br', name: 'Ana Costa' },
    { email: 'pedro@ritmo.com.br', name: 'Pedro Santos' }
  ];

  for (const u of usersToCreate) {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: u.email,
        password: password,
        options: { data: { name: u.name } }
      });

      if (error && !error.message.includes('already registered')) {
        console.log(`Error signing up ${u.email}:`, error.message);
      } else if (authData?.user?.id) {
        const authId = authData.user.id;
        await client.query(`UPDATE public.users SET auth_user_id = '${authId}' WHERE email = '${u.email}'`);
        console.log(`[AUTH OK] ${u.email} -> auth_user_id: ${authId}`);
      } else {
        console.log(`[EXISTING] ${u.email}`);
      }
    } catch (err) {
      console.log(`Error with ${u.email}:`, err.message);
    }
  }

  console.log("\n==================================================");
  console.log("  AUTH SETUP COMPLETE - ALL ACCOUNTS READY        ");
  console.log("==================================================");

  await client.end();
}

setupAuthAccounts();
