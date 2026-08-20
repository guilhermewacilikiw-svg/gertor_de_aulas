import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Logando como master...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'master@wakoda.com.br',
    password: 'Password@123!'
  });

  if (authError) {
    console.error('Master login failed:', authError.message);
    return;
  }
  
  console.log('Logged in as', authData.user.email);

  const newSchool = {
    p_school_name: 'Escola do Gui',
    p_admin_name: 'Gui',
    p_admin_email: 'gui@escola.com',
    p_admin_password: 'Password@123!'
  };

  console.log('Creating school and admin...');
  const { data, error } = await supabase.rpc('saas_register_school', newSchool);

  if (error) {
    console.error('RPC Error:', error.message);
  } else {
    console.log('Success! Created:', data);
  }
}

run();
