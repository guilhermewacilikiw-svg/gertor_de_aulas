import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sabwsllulwcqzlsevhle.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhYndzbGx1bHdjcXpsc2V2aGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0NDc5MzgsImV4cCI6MjEwMjAyMzkzOH0.MlBFC0YQXmaO0uYcoioVqOqWbaaL5vt27jnHGrv3tB8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Tentando criar Gestor...");
  const admin = await supabase.auth.signUp({
    email: 'admin.wakoda@gmail.com',
    password: '123456',
    options: { data: { name: 'Admin Gestor' } }
  });
  console.log("Admin:", admin.error ? admin.error.message : "Sucesso: " + admin.data.user.id);
}

run();
