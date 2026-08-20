-- Migration: Fix RLS Policies for course_modules and module_contents

-- 1. Enable RLS for module_contents
ALTER TABLE public.module_contents ENABLE ROW LEVEL SECURITY;

-- 2. Add policies to allow Admins/Managers to CREATE, UPDATE, DELETE course_modules
-- (SELECT was already added in a previous migration)
CREATE POLICY "Admins manage course modules" ON public.course_modules FOR ALL 
USING (public.has_school_role(school_id, 'SCHOOL_ADMIN') OR public.has_school_role(school_id, 'MANAGER'));

-- 3. Add policies for module_contents
CREATE POLICY "Members view module contents" ON public.module_contents FOR SELECT 
USING (public.belongs_to_school(school_id));

CREATE POLICY "Admins manage module contents" ON public.module_contents FOR ALL 
USING (public.has_school_role(school_id, 'SCHOOL_ADMIN') OR public.has_school_role(school_id, 'MANAGER'));
