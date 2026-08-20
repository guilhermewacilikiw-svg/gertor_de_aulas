-- Migration: 20260815000002_security_rls.sql
-- Description: Enables Row Level Security (RLS) and defines multi-tenant authorization policies

-- 0. SCHEMA GRANTS FOR SUPABASE ROLES
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated, service_role;

-- 1. HELPER FUNCTIONS FOR AUTHORIZATION (SECURITY DEFINER)

-- Function to obtain current authenticated user's ID
CREATE OR REPLACE FUNCTION public.current_auth_user_id()
RETURNS UUID AS $$
  SELECT COALESCE(
    auth.uid(),
    (current_setting('request.jwt.claim.sub', true))::uuid
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Function to check if user belongs to a school
CREATE OR REPLACE FUNCTION public.belongs_to_school(p_school_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM school_memberships sm
    JOIN users u ON sm.user_id = u.id
    WHERE sm.school_id = p_school_id 
      AND u.auth_user_id = public.current_auth_user_id()
      AND sm.status = 'active'
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Function to check if user has a specific role in a school
CREATE OR REPLACE FUNCTION public.has_school_role(p_school_id UUID, p_role user_role)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM school_memberships sm
    JOIN users u ON sm.user_id = u.id
    WHERE sm.school_id = p_school_id 
      AND u.auth_user_id = public.current_auth_user_id()
      AND sm.role = p_role
      AND sm.status = 'active'
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Function to check if user is a SUPER_ADMIN
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM school_memberships sm
    JOIN users u ON sm.user_id = u.id
    WHERE u.auth_user_id = public.current_auth_user_id()
      AND sm.role = 'SUPER_ADMIN'
      AND sm.status = 'active'
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Function to check if user is the assigned teacher for a lesson
CREATE OR REPLACE FUNCTION public.is_teacher_for_lesson(p_lesson_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM lessons l
    JOIN teachers t ON l.teacher_id = t.id
    JOIN users u ON t.user_id = u.id
    WHERE l.id = p_lesson_id 
      AND u.auth_user_id = public.current_auth_user_id()
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Function to check if user is a student participant in a lesson
CREATE OR REPLACE FUNCTION public.is_student_for_lesson(p_lesson_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM lesson_participants lp
    JOIN students s ON lp.student_id = s.id
    JOIN users u ON s.user_id = u.id
    WHERE lp.lesson_id = p_lesson_id 
      AND u.auth_user_id = public.current_auth_user_id()
  ) OR EXISTS (
    SELECT 1
    FROM lessons l
    JOIN enrollments e ON e.class_id = l.class_id
    JOIN students s ON e.student_id = s.id
    JOIN users u ON s.user_id = u.id
    WHERE l.id = p_lesson_id
      AND u.auth_user_id = public.current_auth_user_id()
      AND e.status = 'active'
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 2. ENABLE RLS ON ALL TABLES
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_branding ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_limits ENABLE ROW LEVEL SECURITY;

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_memberships ENABLE ROW LEVEL SECURITY;

ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE track_modules ENABLE ROW LEVEL SECURITY;

ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

ALTER TABLE contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_targets ENABLE ROW LEVEL SECURITY;

ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_assessments ENABLE ROW LEVEL SECURITY;

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 3. POLICIES DEFINITION

-- SCHOOLS
CREATE POLICY "Super admins access all schools" ON schools FOR ALL USING (public.is_super_admin());
CREATE POLICY "Users view member schools" ON schools FOR SELECT USING (public.belongs_to_school(id));

-- SCHOOL UNITS
CREATE POLICY "Super admins access all units" ON school_units FOR ALL USING (public.is_super_admin());
CREATE POLICY "Members view school units" ON school_units FOR SELECT USING (public.belongs_to_school(school_id));
CREATE POLICY "Admins manage school units" ON school_units FOR ALL USING (public.has_school_role(school_id, 'SCHOOL_ADMIN') OR public.has_school_role(school_id, 'MANAGER'));

-- SCHOOL SETTINGS & BRANDING
CREATE POLICY "Members view school settings" ON school_settings FOR SELECT USING (public.belongs_to_school(school_id));
CREATE POLICY "Admins manage school settings" ON school_settings FOR ALL USING (public.has_school_role(school_id, 'SCHOOL_ADMIN'));
CREATE POLICY "Members view school branding" ON school_branding FOR SELECT USING (public.belongs_to_school(school_id));
CREATE POLICY "Admins manage school branding" ON school_branding FOR ALL USING (public.has_school_role(school_id, 'SCHOOL_ADMIN'));
CREATE POLICY "Members view school limits" ON school_limits FOR SELECT USING (public.belongs_to_school(school_id));

-- USERS & MEMBERSHIPS
CREATE POLICY "Users view own profile" ON users FOR SELECT USING (auth_user_id = public.current_auth_user_id() OR public.is_super_admin());
CREATE POLICY "Users update own profile" ON users FOR UPDATE USING (auth_user_id = public.current_auth_user_id());
CREATE POLICY "School members view school memberships" ON school_memberships FOR SELECT USING (public.belongs_to_school(school_id) OR public.is_super_admin());
CREATE POLICY "School admins manage memberships" ON school_memberships FOR ALL USING (public.has_school_role(school_id, 'SCHOOL_ADMIN') OR public.is_super_admin());

-- STUDENTS & GUARDIANS
CREATE POLICY "Admins view all students in school" ON students FOR SELECT USING (public.belongs_to_school(school_id));
CREATE POLICY "Students view own student profile" ON students FOR SELECT USING (user_id IN (SELECT id FROM users WHERE auth_user_id = public.current_auth_user_id()));
CREATE POLICY "Admins manage students" ON students FOR ALL USING (public.has_school_role(school_id, 'SCHOOL_ADMIN') OR public.has_school_role(school_id, 'MANAGER') OR public.is_super_admin());

CREATE POLICY "Members view guardians" ON guardians FOR SELECT USING (public.belongs_to_school(school_id));
CREATE POLICY "Members view student guardians" ON student_guardians FOR SELECT USING (public.belongs_to_school(school_id));

-- TEACHERS
CREATE POLICY "Members view teachers in school" ON teachers FOR SELECT USING (public.belongs_to_school(school_id));
CREATE POLICY "Admins manage teachers" ON teachers FOR ALL USING (public.has_school_role(school_id, 'SCHOOL_ADMIN') OR public.has_school_role(school_id, 'MANAGER') OR public.is_super_admin());

-- COURSES & TRACKS
CREATE POLICY "Members view courses" ON courses FOR SELECT USING (public.belongs_to_school(school_id));
CREATE POLICY "Admins manage courses" ON courses FOR ALL USING (public.has_school_role(school_id, 'SCHOOL_ADMIN') OR public.has_school_role(school_id, 'MANAGER'));
CREATE POLICY "Members view course modules" ON course_modules FOR SELECT USING (public.belongs_to_school(school_id));
CREATE POLICY "Members view learning tracks" ON learning_tracks FOR SELECT USING (public.belongs_to_school(school_id));
CREATE POLICY "Members view track modules" ON track_modules FOR SELECT USING (public.belongs_to_school(school_id));

-- CLASSES & ENROLLMENTS
CREATE POLICY "Members view classes" ON classes FOR SELECT USING (public.belongs_to_school(school_id));
CREATE POLICY "Admins manage classes" ON classes FOR ALL USING (public.has_school_role(school_id, 'SCHOOL_ADMIN') OR public.has_school_role(school_id, 'MANAGER'));
CREATE POLICY "Members view class schedules" ON class_schedules FOR SELECT USING (public.belongs_to_school(school_id));
CREATE POLICY "Members view enrollments" ON enrollments FOR SELECT USING (public.belongs_to_school(school_id));

-- LESSONS & PARTICIPANTS
CREATE POLICY "Admins view all lessons" ON lessons FOR SELECT USING (public.has_school_role(school_id, 'SCHOOL_ADMIN') OR public.has_school_role(school_id, 'MANAGER') OR public.is_super_admin());
CREATE POLICY "Teachers view assigned lessons" ON lessons FOR SELECT USING (public.is_teacher_for_lesson(id));
CREATE POLICY "Students view enrolled lessons" ON lessons FOR SELECT USING (public.is_student_for_lesson(id));
CREATE POLICY "Teachers update assigned lessons" ON lessons FOR UPDATE USING (public.is_teacher_for_lesson(id));
CREATE POLICY "Admins manage lessons" ON lessons FOR ALL USING (public.has_school_role(school_id, 'SCHOOL_ADMIN') OR public.has_school_role(school_id, 'MANAGER'));

CREATE POLICY "Members view lesson participants" ON lesson_participants FOR SELECT USING (public.belongs_to_school(school_id));
CREATE POLICY "Teachers manage lesson participants" ON lesson_participants FOR ALL USING (public.is_teacher_for_lesson(lesson_id) OR public.has_school_role(school_id, 'SCHOOL_ADMIN'));

-- LESSON RECORDS & MATERIALS
CREATE POLICY "Students and teachers view lesson records" ON lesson_records FOR SELECT USING (public.is_student_for_lesson(lesson_id) OR public.is_teacher_for_lesson(lesson_id) OR public.has_school_role(school_id, 'SCHOOL_ADMIN'));
CREATE POLICY "Teachers create lesson records" ON lesson_records FOR INSERT WITH CHECK (public.is_teacher_for_lesson(lesson_id) OR public.has_school_role(school_id, 'SCHOOL_ADMIN'));
CREATE POLICY "Teachers update lesson records" ON lesson_records FOR UPDATE USING (public.is_teacher_for_lesson(lesson_id) OR public.has_school_role(school_id, 'SCHOOL_ADMIN'));

CREATE POLICY "Students and teachers view lesson materials" ON lesson_materials FOR SELECT USING (public.is_student_for_lesson(lesson_id) OR public.is_teacher_for_lesson(lesson_id) OR public.has_school_role(school_id, 'SCHOOL_ADMIN'));
CREATE POLICY "Teachers insert lesson materials" ON lesson_materials FOR INSERT WITH CHECK (public.is_teacher_for_lesson(lesson_id) OR public.has_school_role(school_id, 'SCHOOL_ADMIN'));

-- VIDEOS (STRICT TENANT & LESSON ISOLATION)
CREATE POLICY "Authorized participants view videos" ON videos FOR SELECT USING (
  (lesson_id IS NOT NULL AND (public.is_student_for_lesson(lesson_id) OR public.is_teacher_for_lesson(lesson_id)))
  OR public.has_school_role(school_id, 'SCHOOL_ADMIN')
  OR public.is_super_admin()
);
CREATE POLICY "Teachers and admins insert videos" ON videos FOR INSERT WITH CHECK (
  (lesson_id IS NOT NULL AND public.is_teacher_for_lesson(lesson_id)) 
  OR public.has_school_role(school_id, 'SCHOOL_ADMIN')
);

-- CONTENTS & TARGETS
CREATE POLICY "Members view contents" ON contents FOR SELECT USING (public.belongs_to_school(school_id));
CREATE POLICY "Admins manage contents" ON contents FOR ALL USING (public.has_school_role(school_id, 'SCHOOL_ADMIN') OR public.has_school_role(school_id, 'MANAGER'));
CREATE POLICY "Members view content targets" ON content_targets FOR SELECT USING (public.belongs_to_school(school_id));

-- PROGRESS & ATTENDANCE
CREATE POLICY "Members view student progress" ON student_progress FOR SELECT USING (public.belongs_to_school(school_id));
CREATE POLICY "Students manage own progress" ON student_progress FOR ALL USING (
  student_id IN (SELECT id FROM students WHERE user_id IN (SELECT id FROM users WHERE auth_user_id = public.current_auth_user_id()))
);
CREATE POLICY "Members view attendance" ON attendance FOR SELECT USING (public.belongs_to_school(school_id));
CREATE POLICY "Teachers manage attendance" ON attendance FOR ALL USING (public.is_teacher_for_lesson(lesson_id) OR public.has_school_role(school_id, 'SCHOOL_ADMIN'));

-- ASSESSMENTS
CREATE POLICY "Members view assessments" ON assessments FOR SELECT USING (public.belongs_to_school(school_id));
CREATE POLICY "Members view assessment items" ON assessment_items FOR SELECT USING (public.belongs_to_school(school_id));
CREATE POLICY "Members view student assessments" ON student_assessments FOR SELECT USING (public.belongs_to_school(school_id));
CREATE POLICY "Teachers and admins manage student assessments" ON student_assessments FOR ALL USING (public.has_school_role(school_id, 'TEACHER') OR public.has_school_role(school_id, 'SCHOOL_ADMIN'));

-- LEADS, EVENTS, ANNOUNCEMENTS, NOTIFICATIONS
CREATE POLICY "Admins manage leads" ON leads FOR ALL USING (public.has_school_role(school_id, 'SCHOOL_ADMIN') OR public.has_school_role(school_id, 'MANAGER'));
CREATE POLICY "Public insert leads" ON leads FOR INSERT WITH CHECK (true);

CREATE POLICY "Members view events" ON events FOR SELECT USING (public.belongs_to_school(school_id));
CREATE POLICY "Members view announcements" ON announcements FOR SELECT USING (public.belongs_to_school(school_id));
CREATE POLICY "Users view own notifications" ON notifications FOR SELECT USING (user_id IN (SELECT id FROM users WHERE auth_user_id = public.current_auth_user_id()));
CREATE POLICY "Users update own notifications" ON notifications FOR UPDATE USING (user_id IN (SELECT id FROM users WHERE auth_user_id = public.current_auth_user_id()));

-- FINANCE & AUDIT LOGS
CREATE POLICY "Admins view subscriptions" ON subscriptions FOR SELECT USING (public.has_school_role(school_id, 'SCHOOL_ADMIN') OR public.is_super_admin());
CREATE POLICY "Admins view invoices" ON invoices FOR SELECT USING (public.has_school_role(school_id, 'SCHOOL_ADMIN') OR public.is_super_admin());
CREATE POLICY "Admins view payments" ON payments FOR SELECT USING (public.has_school_role(school_id, 'SCHOOL_ADMIN') OR public.is_super_admin());
CREATE POLICY "Admins view audit logs" ON audit_logs FOR SELECT USING (public.has_school_role(school_id, 'SCHOOL_ADMIN') OR public.is_super_admin());
