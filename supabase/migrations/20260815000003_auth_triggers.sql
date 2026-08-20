-- Migration: 20260815000003_auth_triggers.sql
-- Description: User synchronization trigger between auth.users and public.users + default roles initialization

-- 1. Insert default roles
INSERT INTO roles (name, description) VALUES
  ('SUPER_ADMIN', 'Platform Super Administrator'),
  ('SCHOOL_ADMIN', 'School Owner / Administrator'),
  ('MANAGER', 'School Operations Manager'),
  ('TEACHER', 'Instructor / Teacher'),
  ('STUDENT', 'Enrolled Student'),
  ('GUARDIAN', 'Parent / Guardian of Student'),
  ('STAFF', 'Administrative Staff')
ON CONFLICT (name) DO NOTHING;

-- 2. Trigger function to handle new auth user creation
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (auth_user_id, name, email, avatar_url, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url',
    'active'
  )
  ON CONFLICT (auth_user_id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Trigger setup on auth.users (if permission permits in Supabase environment)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'auth' AND tablename = 'users') THEN
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Could not create auth.users trigger directly, handled via application logic if needed.';
END;
$$;
