import pg from 'pg';
const { Client } = pg;
const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.sabwsllulwcqzlsevhle:Guigui151293@aws-0-us-west-2.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});
await client.connect();

await client.query(`
CREATE OR REPLACE FUNCTION public.create_school_and_membership(
  p_school_name text,
  p_document text,
  p_phone text,
  p_admin_email text,
  p_auth_user_id uuid
) RETURNS uuid AS $$
DECLARE
  v_school_id uuid;
  v_user_id uuid;
BEGIN
  INSERT INTO public.schools (name, document, phone, email, status)
  VALUES (p_school_name, p_document, p_phone, p_admin_email, 'active')
  RETURNING id INTO v_school_id;

  SELECT id INTO v_user_id FROM public.users WHERE auth_user_id = p_auth_user_id;

  IF v_user_id IS NULL THEN
    INSERT INTO public.users (auth_user_id, name, email, phone, status)
    VALUES (p_auth_user_id, 'Admin', p_admin_email, p_phone, 'active')
    RETURNING id INTO v_user_id;
  END IF;

  INSERT INTO public.school_memberships (school_id, user_id, role, status)
  VALUES (v_school_id, v_user_id, 'SCHOOL_ADMIN', 'active');

  RETURN v_school_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`);

console.log('RPC created');
await client.end();
