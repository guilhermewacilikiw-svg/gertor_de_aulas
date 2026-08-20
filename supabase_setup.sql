-- Single execution setup file for Supabase PostgreSQL database initialization
-- Combines Core Schema, Security RLS policies and Auth triggers.

\i supabase/migrations/20260815000001_core_schema.sql
\i supabase/migrations/20260815000002_security_rls.sql
\i supabase/migrations/20260815000003_auth_triggers.sql
