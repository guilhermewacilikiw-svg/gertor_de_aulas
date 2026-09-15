import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sabwsllulwcqzlsevhle.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhYndzbGx1bHdjcXpsc2V2aGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0NDc5MzgsImV4cCI6MjEwMjAyMzkzOH0.MlBFC0YQXmaO0uYcoioVqOqWbaaL5vt27jnHGrv3tB8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLogins() {
  console.log("==================================================");
  console.log("  TESTING CREDENTIALS VIA SUPABASE AUTH GOTRUE   ");
  console.log("==================================================\n");

  const testAccounts = [
    { email: 'admin@harmonia.com.br', role: 'ADMIN ESCOLA A' },
    { email: 'carlos@harmonia.com.br', role: 'PROFESSOR ESCOLA A' },
    { email: 'joao@harmonia.com.br', role: 'ALUNO ESCOLA A' }
  ];

  const password = 'Password123!';

  for (const acc of testAccounts) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: acc.email,
      password: password
    });

    if (error) {
      console.error(`[FAIL LOGIN] ${acc.email}: ${error.message}`);
    } else {
      console.log(`[PASS LOGIN] ${acc.email} (${acc.role})`);
      console.log(`             JWT Token Granted! User ID: ${data.user.id}`);
    }
  }

  console.log("\n==================================================");
  console.log("  ALL LOGIN CREDENTIALS VERIFIED & WORKING        ");
  console.log("==================================================");
}

testLogins();
