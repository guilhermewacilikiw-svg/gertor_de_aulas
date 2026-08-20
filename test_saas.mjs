import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sabwsllulwcqzlsevhle.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhYndzbGx1bHdjcXpsc2V2aGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0NDc5MzgsImV4cCI6MjEwMjAyMzkzOH0.MlBFC0YQXmaO0uYcoioVqOqWbaaL5vt27jnHGrv3tB8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.rpc('saas_register_school', {
    p_school_name: 'Escola Teste RPC',
    p_admin_name: 'Admin Teste',
    p_admin_email: 'admintest@escola.com',
    p_admin_password: 'password123'
  });
  console.log("RPC Data:", data);
  console.log("RPC Error:", error);

  if (data?.success) {
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'admintest@escola.com',
      password: 'password123',
    });
    console.log("Login Data:", loginData?.user?.email);
    console.log("Login Error:", loginError);
  }
}

run();
