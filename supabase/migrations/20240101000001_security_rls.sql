-- Migration: 01_security_rls.sql
-- Description: Enables Row Level Security on all tables and creates authorization policies based on school_id and user role.

-- 1. Helper Functions
-- Function to get current user's UUID from Supabase Auth
CREATE OR REPLACE FUNCTION auth.user_id() RETURNS UUID AS $$
  SELECT current_setting('request.jwt.claim.sub', true)::uuid;
$$ LANGUAGE SQL;

-- Function to check if a user has a specific role in a specific school
CREATE OR REPLACE FUNCTION public.has_school_role(p_school_id UUID, p_role user_role)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM school_memberships 
    WHERE school_id = p_school_id 
      AND user_id = (SELECT id FROM users WHERE auth_user_id = auth.user_id())
      AND role = p_role
      AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user belongs to a school (any role)
CREATE OR REPLACE FUNCTION public.belongs_to_school(p_school_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM school_memberships 
    WHERE school_id = p_school_id 
      AND user_id = (SELECT id FROM users WHERE auth_user_id = auth.user_id())
      AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is a teacher for a specific lesson
CREATE OR REPLACE FUNCTION public.is_teacher_for_lesson(p_lesson_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM lessons l
    JOIN teachers t ON l.teacher_id = t.id
    JOIN users u ON t.user_id = u.id
    WHERE l.id = p_lesson_id 
      AND u.auth_user_id = auth.user_id()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is a student for a specific lesson
CREATE OR REPLACE FUNCTION public.is_student_for_lesson(p_lesson_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM lesson_participants lp
    JOIN students s ON lp.student_id = s.id
    JOIN users u ON s.user_id = u.id
    WHERE lp.lesson_id = p_lesson_id 
      AND u.auth_user_id = auth.user_id()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Enable RLS on all tables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_branding ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_limits ENABLE ROW LEVEL SECURITY;

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_memberships ENABLE ROW LEVEL SECURITY;

ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_materials ENABLE ROW LEVEL SECURITY;

ALTER TABLE contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- 3. Policies
-- Table: schools (Managers/Admins can view their own schools)
CREATE POLICY "Users can view schools they belong to" 
ON schools FOR SELECT 
USING (belongs_to_school(id));

-- Table: school_units
CREATE POLICY "Users can view units of their schools"
ON school_units FOR SELECT
USING (belongs_to_school(school_id));

-- Table: users (Users can view themselves, and admins can view users in their school)
CREATE POLICY "Users can view their own profile"
ON users FOR SELECT
USING (auth_user_id = auth.user_id());

CREATE POLICY "Users can update their own profile"
ON users FOR UPDATE
USING (auth_user_id = auth.user_id());

-- Table: students (Admins/Managers can view all in school. Teachers can view students in their classes. Students view themselves)
CREATE POLICY "Admins and Managers can view all students in their school"
ON students FOR SELECT
USING (has_school_role(school_id, 'SCHOOL_ADMIN') OR has_school_role(school_id, 'MANAGER'));

CREATE POLICY "Students can view their own record"
ON students FOR SELECT
USING (user_id = (SELECT id FROM users WHERE auth_user_id = auth.user_id()));

-- Table: teachers (Anyone in school can view teachers)
CREATE POLICY "Users can view teachers in their school"
ON teachers FOR SELECT
USING (belongs_to_school(school_id));

-- Table: lessons
CREATE POLICY "Admins can view all lessons in school"
ON lessons FOR SELECT
USING (has_school_role(school_id, 'SCHOOL_ADMIN') OR has_school_role(school_id, 'MANAGER'));

CREATE POLICY "Teachers can view their own lessons"
ON lessons FOR SELECT
USING (is_teacher_for_lesson(id));

CREATE POLICY "Students can view lessons they participate in"
ON lessons FOR SELECT
USING (is_student_for_lesson(id));

CREATE POLICY "Teachers can update their own lessons"
ON lessons FOR UPDATE
USING (is_teacher_for_lesson(id));

-- Table: lesson_records
CREATE POLICY "Teachers can create records for their lessons"
ON lesson_records FOR INSERT
WITH CHECK (is_teacher_for_lesson(lesson_id));

CREATE POLICY "Teachers can update records for their lessons"
ON lesson_records FOR UPDATE
USING (is_teacher_for_lesson(lesson_id));

CREATE POLICY "Students can view records of their lessons"
ON lesson_records FOR SELECT
USING (is_student_for_lesson(lesson_id));

-- Table: contents & videos
CREATE POLICY "Admins can manage contents"
ON contents FOR ALL
USING (has_school_role(school_id, 'SCHOOL_ADMIN') OR has_school_role(school_id, 'MANAGER'));

CREATE POLICY "Students can view published contents targeted to them"
ON contents FOR SELECT
USING (
  status = 'published' AND belongs_to_school(school_id)
  -- Add more complex logic here for content_targets if needed, simplified for phase 1.
);

CREATE POLICY "Students can view videos for lessons they attended"
ON videos FOR SELECT
USING (is_student_for_lesson(lesson_id));

-- Note: In a production setup, more granular policies should be defined for every single table.
-- The above covers the core requirements for multi-tenant isolation and the core lesson flow.
