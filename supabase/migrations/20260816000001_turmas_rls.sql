-- Libera a segurança das tabelas de Horários e Matrículas para administradores da escola

-- 1. Permissões básicas do Postgres para as tabelas (caso precisem)
GRANT ALL ON TABLE public.class_schedules TO authenticated, service_role;
GRANT ALL ON TABLE public.enrollments TO authenticated, service_role;

-- 2. Limpar políticas antigas caso já existam para não dar erro
DROP POLICY IF EXISTS "Members view class schedules" ON public.class_schedules;
DROP POLICY IF EXISTS "Admins manage class schedules" ON public.class_schedules;
DROP POLICY IF EXISTS "Members view enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Admins manage enrollments" ON public.enrollments;

-- 3. Habilitar o RLS
ALTER TABLE public.class_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- 4. Criar as políticas de SELECT (visualização) para todos os membros da escola
CREATE POLICY "Members view class schedules" ON public.class_schedules FOR SELECT USING (public.belongs_to_school(school_id));
CREATE POLICY "Members view enrollments" ON public.enrollments FOR SELECT USING (public.belongs_to_school(school_id));

-- 5. Criar as políticas de INSERT/UPDATE/DELETE (edição) apenas para Diretores e Gerentes
CREATE POLICY "Admins manage class schedules" ON public.class_schedules FOR ALL USING (public.has_school_role(school_id, 'SCHOOL_ADMIN') OR public.has_school_role(school_id, 'MANAGER'));
CREATE POLICY "Admins manage enrollments" ON public.enrollments FOR ALL USING (public.has_school_role(school_id, 'SCHOOL_ADMIN') OR public.has_school_role(school_id, 'MANAGER'));
