-- Migration: Add is_highlighted to assessment_items and update RLS policies for teachers
ALTER TABLE assessment_items ADD COLUMN IF NOT EXISTS is_highlighted BOOLEAN DEFAULT false;

DROP POLICY IF EXISTS "Teachers and admins manage assessments" ON assessments;
CREATE POLICY "Teachers and admins manage assessments" ON assessments
  FOR ALL USING (
    has_school_role(school_id, 'TEACHER'::user_role) OR
    has_school_role(school_id, 'SCHOOL_ADMIN'::user_role) OR
    has_school_role(school_id, 'MANAGER'::user_role)
  ) WITH CHECK (
    has_school_role(school_id, 'TEACHER'::user_role) OR
    has_school_role(school_id, 'SCHOOL_ADMIN'::user_role) OR
    has_school_role(school_id, 'MANAGER'::user_role)
  );

DROP POLICY IF EXISTS "Teachers and admins manage assessment items" ON assessment_items;
CREATE POLICY "Teachers and admins manage assessment items" ON assessment_items
  FOR ALL USING (
    has_school_role(school_id, 'TEACHER'::user_role) OR
    has_school_role(school_id, 'SCHOOL_ADMIN'::user_role) OR
    has_school_role(school_id, 'MANAGER'::user_role)
  ) WITH CHECK (
    has_school_role(school_id, 'TEACHER'::user_role) OR
    has_school_role(school_id, 'SCHOOL_ADMIN'::user_role) OR
    has_school_role(school_id, 'MANAGER'::user_role)
  );
