import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sabwsllulwcqzlsevhle.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhYndzbGx1bHdjcXpsc2V2aGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0NDc5MzgsImV4cCI6MjEwMjAyMzkzOH0.MlBFC0YQXmaO0uYcoioVqOqWbaaL5vt27jnHGrv3tB8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const email = 'admin.wakoda@gmail.com';
  console.log(`Testando login para ${email}...`);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: 'Password@123!',
  });

  if (error) {
    console.error('Erro no login:', error.message);
  } else {
    console.log('Sucesso absoluto! Logado como:', data.user.email);
  }
}

run();
