import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sabwsllulwcqzlsevhle.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhYndzbGx1bHdjcXpsc2V2aGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0NDc5MzgsImV4cCI6MjEwMjAyMzkzOH0.MlBFC0YQXmaO0uYcoioVqOqWbaaL5vt27jnHGrv3tB8';

async function run() {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin.wakoda@gmail.com',
    password: 'Password@123!'
  });

  if (authError) {
    console.log("Login error:", authError);
    return;
  }
  
  const freshSupabase = createClient(supabaseUrl, supabaseKey);
  await freshSupabase.auth.setSession({
    access_token: authData.session.access_token,
    refresh_token: authData.session.refresh_token
  });

  // Step 1
  const { data: publicUser, error: userError } = await freshSupabase
    .from('users')
    .select('id')
    .eq('auth_user_id', authData.user.id)
    .single();

  console.log("Step 1 User Data:", publicUser);
  console.log("Step 1 User Error:", userError);

  if (publicUser) {
    // Step 2
    const { data: membershipData, error: membershipError } = await freshSupabase
      .from('school_memberships')
      .select('role')
      .eq('user_id', publicUser.id)
      .limit(1)
      .single();
      
    console.log("Step 2 Membership Data:", membershipData);
    console.log("Step 2 Membership Error:", membershipError);
  }
}

run();
