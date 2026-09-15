import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sabwsllulwcqzlsevhle.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhYndzbGx1bHdjcXpsc2V2aGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0NDc5MzgsImV4cCI6MjEwMjAyMzkzOH0.MlBFC0YQXmaO0uYcoioVqOqWbaaL5vt27jnHGrv3tB8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLogin(email, password) {
  console.log(`Testing login for ${email} with password ${password}...`);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Error logging in:', error.message);
  } else {
    console.log('Success! Logged in as:', data.user.email);
  }
}

async function run() {
  await testLogin('admin@escola.com', '123456');
  await testLogin('joao@escola.com', '123456');
  await testLogin('carlos@escola.com', '123456');
}

run();
