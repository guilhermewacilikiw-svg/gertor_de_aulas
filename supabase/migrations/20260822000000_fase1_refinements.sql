-- Migration: 20260822000000_fase1_refinements.sql
-- Description: FASE 1 refinements (CPF, teacher_modules, lesson to module link, student_finances)

-- 1. ADD CPF TO STUDENTS AND TEACHERS
ALTER TABLE students ADD COLUMN IF NOT EXISTS cpf VARCHAR(14);
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS cpf VARCHAR(14);

-- 2. TEACHER MODULES (Disciplines/Specialties mapping)
CREATE TABLE IF NOT EXISTS teacher_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_teacher_module UNIQUE(teacher_id, module_id)
);

CREATE INDEX IF NOT EXISTS idx_teacher_modules_teacher_id ON teacher_modules(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_modules_school_id ON teacher_modules(school_id);

-- 3. LINK LESSONS DIRECTLY TO MODULES
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS module_id UUID REFERENCES course_modules(id) ON DELETE SET NULL;

-- 4. ENHANCE LESSON_PARTICIPANTS
ALTER TABLE lesson_participants ADD COLUMN IF NOT EXISTS progress_status TEXT DEFAULT 'pending' CHECK (progress_status IN ('pending', 'in_progress', 'completed'));
ALTER TABLE lesson_participants ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- 5. STUDENT FINANCES
CREATE TABLE IF NOT EXISTS student_finances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    plan_name TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    due_day INT NOT NULL CHECK (due_day BETWEEN 1 AND 31),
    payment_method TEXT NOT NULL DEFAULT 'boleto' CHECK (payment_method IN ('credit_card', 'boleto', 'pix', 'cash')),
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_student_finance UNIQUE(student_id)
);

CREATE TABLE IF NOT EXISTS student_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    finance_id UUID NOT NULL REFERENCES student_finances(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL,
    due_date DATE NOT NULL,
    status payment_status NOT NULL DEFAULT 'pending',
    payment_method TEXT NOT NULL CHECK (payment_method IN ('credit_card', 'boleto', 'pix', 'cash')),
    boleto_url TEXT,
    barcode TEXT,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Triggers for student finances
CREATE TRIGGER trg_update_student_finances BEFORE UPDATE ON student_finances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_update_student_invoices BEFORE UPDATE ON student_invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. RLS FOR NEW TABLES
ALTER TABLE teacher_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_finances ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_invoices ENABLE ROW LEVEL SECURITY;

-- RLS: School admins can do anything in their school
CREATE POLICY "Admins can manage teacher_modules" ON teacher_modules FOR ALL USING (
    school_id IN (SELECT school_id FROM school_memberships WHERE user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()) AND role IN ('SUPER_ADMIN', 'SCHOOL_ADMIN', 'MANAGER'))
);

CREATE POLICY "Admins can manage student_finances" ON student_finances FOR ALL USING (
    school_id IN (SELECT school_id FROM school_memberships WHERE user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()) AND role IN ('SUPER_ADMIN', 'SCHOOL_ADMIN', 'MANAGER'))
);

CREATE POLICY "Admins can manage student_invoices" ON student_invoices FOR ALL USING (
    school_id IN (SELECT school_id FROM school_memberships WHERE user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()) AND role IN ('SUPER_ADMIN', 'SCHOOL_ADMIN', 'MANAGER'))
);

-- RLS: Students can READ their own finances
CREATE POLICY "Students can read their finances" ON student_finances FOR SELECT USING (
    student_id IN (SELECT id FROM students WHERE user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()))
);

CREATE POLICY "Students can read their invoices" ON student_invoices FOR SELECT USING (
    student_id IN (SELECT id FROM students WHERE user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()))
);

-- RLS: Teachers can READ their own modules
CREATE POLICY "Teachers can read their modules" ON teacher_modules FOR SELECT USING (
    teacher_id IN (SELECT id FROM teachers WHERE user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()))
);
