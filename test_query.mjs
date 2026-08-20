import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sabwsllulwcqzlsevhle.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhYndzbGx1bHdjcXpsc2V2aGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0NDc5MzgsImV4cCI6MjEwMjAyMzkzOH0.MlBFC0YQXmaO0uYcoioVqOqWbaaL5vt27jnHGrv3tB8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const authUserId = 'f6b96371-0137-4959-80c7-a57958e4b2d9'; // admin.wakoda@gmail.com's auth.user.id

  const { data, error } = await supabase
      .from('school_memberships')
      .select('role, users!inner(auth_user_id)')
      .eq('users.auth_user_id', authUserId)
      .limit(1)
      .single();

  console.log("Error:", error);
  console.log("Data:", data);
}

run();
