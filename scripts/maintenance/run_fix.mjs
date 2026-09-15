import pg from 'pg';

const { Client } = pg;

const connectionString = 'postgresql://postgres.sabwsllulwcqzlsevhle:Guigui151293@aws-0-us-west-2.pooler.supabase.com:6543/postgres';

const sql = `
-- 1. Fix RLS on school_memberships
CREATE POLICY "Users can view their own memberships" ON public.school_memberships
    FOR SELECT USING (auth.uid() = user_id);

-- 2. Insert test users into auth.users (Requires pgcrypto which Supabase has by default)
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES 
('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@escola.com', crypt('123456', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now()),
('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'carlos@escola.com', crypt('123456', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now()),
('55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'joao@escola.com', crypt('123456', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now())
ON CONFLICT (id) DO NOTHING;

-- Also insert into auth.identities so they can login via email
INSERT INTO auth.identities (
  id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
) VALUES
('22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', '{"sub": "22222222-2222-2222-2222-222222222222", "email": "admin@escola.com"}', 'email', 'admin@escola.com', now(), now(), now()),
('33333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', '{"sub": "33333333-3333-3333-3333-333333333333", "email": "carlos@escola.com"}', 'email', 'carlos@escola.com', now(), now(), now()),
('55555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', '{"sub": "55555555-5555-5555-5555-555555555555", "email": "joao@escola.com"}', 'email', 'joao@escola.com', now(), now(), now())
ON CONFLICT (provider, provider_id) DO NOTHING;
`;

async function runFix() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected to Supabase to run fix!");

    await client.query(sql);
    console.log("RLS and Auth fix executed successfully!");

  } catch (err) {
    console.error('Execution error', err.stack);
  } finally {
    await client.end();
  }
}

runFix();
