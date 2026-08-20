import { createClient } from '@supabase/supabase-js';
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const connectionString = 'postgresql://postgres.sabwsllulwcqzlsevhle:Guigui151293@aws-0-us-west-2.pooler.supabase.com:6543/postgres';

async function run() {
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();

  console.log("Recreating auth users properly...");

  const users = [
    { email: 'admin@escola.com' },
    { email: 'carlos@escola.com' },
    { email: 'joao@escola.com' }
  ];

  for (const u of users) {
    try {
      console.log(`Processing ${u.email}...`);
      
      // 1. Delete from auth.users (it cascades to auth.identities)
      await client.query(`DELETE FROM auth.users WHERE email = $1`, [u.email]);
      
      // 2. Sign up using Supabase GoTrue
      const { data, error } = await supabase.auth.signUp({
        email: u.email,
        password: 'Password@123!',
      });

      if (error) {
        console.error(`SignUp error for ${u.email}:`, error.message);
        continue;
      }

      const newAuthId = data.user.id;
      
      // 3. Confirm email forcefully
      await client.query(`UPDATE auth.users SET email_confirmed_at = now() WHERE id = $1`, [newAuthId]);
      
      // 4. Link the new Auth ID to the existing public.users
      await client.query(`UPDATE public.users SET auth_user_id = $1 WHERE email = $2`, [newAuthId, u.email]);
      
      console.log(`Success! Linked ${u.email} to new auth ID ${newAuthId}`);
    } catch(e) {
      console.log(`Exception for ${u.email}:`, e.message);
    }
  }

  await client.end();
}

run();
