-- Script para configurar o Onboarding Seguro

CREATE OR REPLACE FUNCTION public.saas_complete_onboarding(
  p_school_name text,
  p_admin_name text,
  p_user_id uuid,
  p_email text
) RETURNS jsonb AS $$
DECLARE
  v_new_school_id uuid;
  v_new_user_id uuid;
BEGIN
  -- 1. Create the school (Tenant)
  INSERT INTO public.schools (name, status)
  VALUES (p_school_name, 'active')
  RETURNING id INTO v_new_school_id;

  -- 2. Create public.users profile
  INSERT INTO public.users (auth_user_id, name, email, status)
  VALUES (p_user_id, p_admin_name, p_email, 'active')
  RETURNING id INTO v_new_user_id;

  -- 3. Create school_memberships as SCHOOL_ADMIN
  INSERT INTO public.school_memberships (school_id, user_id, role, status)
  VALUES (v_new_school_id, v_new_user_id, 'SCHOOL_ADMIN', 'active');

  RETURN jsonb_build_object(
    'success', true,
    'school_id', v_new_school_id
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
