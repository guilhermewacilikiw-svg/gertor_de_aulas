import pg from 'pg';

const { Client } = pg;

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.sabwsllulwcqzlsevhle:Guigui151293@aws-0-us-west-2.pooler.supabase.com:6543/postgres';

async function cleanDbForUser() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("==================================================");
    console.log("   WACKODA EXPERIENCE - CLEANING MOCK DATA        ");
    console.log("==================================================\n");

    // Create / Update RPC function for seamless user onboarding
    await client.query(`
      CREATE OR REPLACE FUNCTION public.saas_complete_onboarding(
        p_school_name TEXT,
        p_admin_name TEXT,
        p_user_id UUID,
        p_email TEXT
      )
      RETURNS UUID AS $$
      DECLARE
        v_school_id UUID;
        v_pub_user_id UUID;
      BEGIN
        -- 1. Create School
        INSERT INTO public.schools (name, status)
        VALUES (p_school_name, 'active')
        RETURNING id INTO v_school_id;

        -- 2. Create School Units, Settings, Branding, Limits
        INSERT INTO public.school_units (school_id, name)
        VALUES (v_school_id, 'Unidade Sede');

        INSERT INTO public.school_settings (school_id)
        VALUES (v_school_id)
        ON CONFLICT DO NOTHING;

        INSERT INTO public.school_branding (school_id, app_name)
        VALUES (v_school_id, p_school_name)
        ON CONFLICT DO NOTHING;

        INSERT INTO public.school_limits (school_id, max_students, max_teachers)
        VALUES (v_school_id, 100, 10)
        ON CONFLICT DO NOTHING;

        -- 3. Upsert User in public.users
        INSERT INTO public.users (auth_user_id, name, email, status)
        VALUES (p_user_id, p_admin_name, p_email, 'active')
        ON CONFLICT (auth_user_id) DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email
        RETURNING id INTO v_pub_user_id;

        -- 4. Create Membership as SCHOOL_ADMIN
        INSERT INTO public.school_memberships (school_id, user_id, role, status)
        VALUES (v_school_id, v_pub_user_id, 'SCHOOL_ADMIN', 'active')
        ON CONFLICT DO NOTHING;

        RETURN v_school_id;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `);

    // Truncate tables for a clean slate for the user
    console.log("Clearing all test users and mock data...");
    await client.query(`
      TRUNCATE schools, school_units, school_settings, school_branding, school_limits,
               users, school_memberships, students, guardians, student_guardians, teachers,
               courses, course_modules, learning_tracks, track_modules, classes, class_schedules,
               enrollments, lessons, lesson_participants, lesson_records, contents, videos,
               lesson_materials, content_targets, student_progress, attendance, assessments,
               assessment_items, student_assessments, leads, events, announcements, notifications,
               subscriptions, invoices, payments, audit_logs CASCADE;
    `);

    console.log("\n==================================================");
    console.log("  SYSTEM CLEANED & READY FOR NEW USER REGISTRATION ");
    console.log("==================================================");

  } catch (err) {
    console.error("Clean Database Error:", err);
  } finally {
    await client.end();
  }
}

cleanDbForUser();
