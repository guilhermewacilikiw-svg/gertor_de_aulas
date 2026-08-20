-- Libera a segurança das tabelas de Conteúdos para administradores da escola

-- 1. Permissões básicas do Postgres
GRANT ALL ON TABLE public.contents TO authenticated, service_role;

-- 2. Limpar políticas antigas caso já existam para não dar erro
DROP POLICY IF EXISTS "Members view contents" ON public.contents;
DROP POLICY IF EXISTS "Admins manage contents" ON public.contents;

-- 3. Habilitar o RLS
ALTER TABLE public.contents ENABLE ROW LEVEL SECURITY;

-- 4. Criar as políticas de SELECT (visualização) para todos os membros da escola
CREATE POLICY "Members view contents" ON public.contents FOR SELECT USING (public.belongs_to_school(school_id));

-- 5. Criar as políticas de INSERT/UPDATE/DELETE (edição) apenas para Diretores e Gerentes
CREATE POLICY "Admins manage contents" ON public.contents FOR ALL USING (public.has_school_role(school_id, 'SCHOOL_ADMIN') OR public.has_school_role(school_id, 'MANAGER'));
