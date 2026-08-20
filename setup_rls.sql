CREATE POLICY "Admins can manage courses"
ON courses
FOR ALL
USING (school_id IN (
  SELECT school_id FROM school_memberships WHERE user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()) AND role IN ('SCHOOL_ADMIN', 'MANAGER')
))
WITH CHECK (school_id IN (
  SELECT school_id FROM school_memberships WHERE user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()) AND role IN ('SCHOOL_ADMIN', 'MANAGER')
));

CREATE POLICY "Users can view courses of their school"
ON courses
FOR SELECT
USING (school_id IN (
  SELECT school_id FROM school_memberships WHERE user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
));

CREATE POLICY "Admins can manage classes"
ON classes
FOR ALL
USING (school_id IN (
  SELECT school_id FROM school_memberships WHERE user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()) AND role IN ('SCHOOL_ADMIN', 'MANAGER')
))
WITH CHECK (school_id IN (
  SELECT school_id FROM school_memberships WHERE user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()) AND role IN ('SCHOOL_ADMIN', 'MANAGER')
));

CREATE POLICY "Users can view classes of their school"
ON classes
FOR SELECT
USING (school_id IN (
  SELECT school_id FROM school_memberships WHERE user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
));
