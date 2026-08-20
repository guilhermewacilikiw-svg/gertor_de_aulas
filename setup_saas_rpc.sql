-- Script to create a SECURITY DEFINER function for SaaS Onboarding

CREATE OR REPLACE FUNCTION public.saas_register_school(
  p_school_name text,
  p_admin_name text,
  p_admin_email text,
  p_admin_password text
) RETURNS jsonb AS $$
DECLARE
  v_new_school_id uuid;
  v_new_auth_id uuid;
  v_new_user_id uuid;
BEGIN
  -- 1. Check if email already exists in auth.users
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = p_admin_email) THEN
    RAISE EXCEPTION 'E-mail já está em uso.';
  END IF;

  -- 2. Create the school (Tenant)
  INSERT INTO public.schools (name, status)
  VALUES (p_school_name, 'active')
  RETURNING id INTO v_new_school_id;

  -- 3. Create the auth.user
  v_new_auth_id := gen_random_uuid();
  
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    v_new_auth_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
    p_admin_email, crypt(p_admin_password, gen_salt('bf')), now(), 
    '{"provider": "email", "providers": ["email"]}', '{}', now(), now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    v_new_auth_id, v_new_auth_id, 
    jsonb_build_object('sub', v_new_auth_id, 'email', p_admin_email), 
    'email', p_admin_email, now(), now(), now()
  );

  -- 4. Create public.users profile
  INSERT INTO public.users (auth_user_id, name, email, status)
  VALUES (v_new_auth_id, p_admin_name, p_admin_email, 'active')
  RETURNING id INTO v_new_user_id;

  -- 5. Create school_memberships as SCHOOL_ADMIN
  INSERT INTO public.school_memberships (school_id, user_id, role, status)
  VALUES (v_new_school_id, v_new_user_id, 'SCHOOL_ADMIN', 'active');

  -- Return success
  RETURN jsonb_build_object(
    'success', true,
    'school_id', v_new_school_id,
    'user_id', v_new_user_id
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
