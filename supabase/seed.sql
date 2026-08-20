-- Seed: supabase/seed.sql
-- Development Seed Data for Wackoda SaaS Multi-Tenant Platform

-- Clean slate data
TRUNCATE schools, school_units, school_settings, school_branding, school_limits,
         users, school_memberships, students, guardians, student_guardians, teachers,
         courses, course_modules, learning_tracks, track_modules, classes, class_schedules,
         enrollments, lessons, lesson_participants, lesson_records, contents, videos,
         lesson_materials, content_targets, student_progress, attendance, assessments,
         assessment_items, student_assessments, leads, events, announcements, notifications,
         subscriptions, invoices, payments, audit_logs CASCADE;

-- 1. ESCOLA A (Escola Harmonia)
INSERT INTO schools (id, name, legal_name, document, email, phone, status)
VALUES ('11111111-1111-1111-1111-111111111111', 'Escola Harmonia', 'Escola de Música Harmonia LTDA', '12.345.678/0001-90', 'contato@harmonia.com.br', '(11) 98765-4321', 'active');

INSERT INTO school_units (id, school_id, name, address, phone)
VALUES ('11111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111111', 'Unidade Central', 'Rua das Flores, 123 - São Paulo/SP', '(11) 98765-4321');

INSERT INTO school_settings (school_id, timezone, locale, currency)
VALUES ('11111111-1111-1111-1111-111111111111', 'America/Sao_Paulo', 'pt-BR', 'BRL');

INSERT INTO school_branding (school_id, app_name, primary_color, secondary_color)
VALUES ('11111111-1111-1111-1111-111111111111', 'Harmonia Music', '#4F46E5', '#06B6D4');

INSERT INTO school_limits (school_id, max_students, max_teachers, storage_limit_mb, video_limit_mb, ai_credits)
VALUES ('11111111-1111-1111-1111-111111111111', 200, 20, 50000, 200000, 1000);

-- 2. ESCOLA B (Escola Ritmo)
INSERT INTO schools (id, name, legal_name, document, email, phone, status)
VALUES ('22222222-2222-2222-2222-222222222222', 'Escola Ritmo', 'Escola de Dança Ritmo LTDA', '98.765.432/0001-10', 'contato@ritmo.com.br', '(21) 99876-5432', 'active');

INSERT INTO school_units (id, school_id, name, address, phone)
VALUES ('22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222222', 'Unidade Copacabana', 'Av. Atlântica, 456 - Rio de Janeiro/RJ', '(21) 99876-5432');

INSERT INTO school_settings (school_id, timezone, locale, currency)
VALUES ('22222222-2222-2222-2222-222222222222', 'America/Sao_Paulo', 'pt-BR', 'BRL');

INSERT INTO school_branding (school_id, app_name, primary_color, secondary_color)
VALUES ('22222222-2222-2222-2222-222222222222', 'Ritmo Dance Studio', '#E11D48', '#F59E0B');

INSERT INTO school_limits (school_id, max_students, max_teachers, storage_limit_mb, video_limit_mb, ai_credits)
VALUES ('22222222-2222-2222-2222-222222222222', 150, 15, 30000, 100000, 500);


-- 3. USUÁRIOS ESCOLA A
-- Admin Harmonia
INSERT INTO users (id, auth_user_id, name, email, phone)
VALUES ('10000000-0000-0000-0000-000000000001', 'a1111111-1111-1111-1111-000000000000', 'Admin Harmonia', 'admin@harmonia.com.br', '(11) 91111-0000');

INSERT INTO school_memberships (school_id, user_id, role)
VALUES ('11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000001', 'SCHOOL_ADMIN');

-- Professor Carlos (Violão)
INSERT INTO users (id, auth_user_id, name, email, phone)
VALUES ('10000000-0000-0000-0000-000000000002', 'a1111111-1111-1111-1111-111111111111', 'Carlos Silva', 'carlos@harmonia.com.br', '(11) 91111-1111');

INSERT INTO school_memberships (school_id, user_id, role)
VALUES ('11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000002', 'TEACHER');

INSERT INTO teachers (id, school_id, user_id, specialty, bio)
VALUES ('10000000-0000-0000-0000-100000000001', '11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000002', 'Violão e Guitarra', 'Especialista em violão popular e teoria musical com 10 anos de experiência.');

-- Aluno João
INSERT INTO users (id, auth_user_id, name, email, phone)
VALUES ('10000000-0000-0000-0000-000000000003', 'a1111111-1111-1111-1111-222222222222', 'João Pedro', 'joao@harmonia.com.br', '(11) 91111-2222');

INSERT INTO school_memberships (school_id, user_id, role)
VALUES ('11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000003', 'STUDENT');

INSERT INTO students (id, school_id, user_id, student_code, name, email, phone)
VALUES ('10000000-0000-0000-0000-200000000001', '11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000003', 'MAT-101', 'João Pedro', 'joao@harmonia.com.br', '(11) 91111-2222');

-- Aluna Maria
INSERT INTO users (id, auth_user_id, name, email, phone)
VALUES ('10000000-0000-0000-0000-000000000004', 'a1111111-1111-1111-1111-333333333333', 'Maria Oliveira', 'maria@harmonia.com.br', '(11) 91111-3333');

INSERT INTO school_memberships (school_id, user_id, role)
VALUES ('11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000004', 'STUDENT');

INSERT INTO students (id, school_id, user_id, student_code, name, email, phone)
VALUES ('10000000-0000-0000-0000-200000000002', '11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000004', 'MAT-102', 'Maria Oliveira', 'maria@harmonia.com.br', '(11) 91111-3333');


-- 4. USUÁRIOS ESCOLA B
-- Admin Ritmo
INSERT INTO users (id, auth_user_id, name, email, phone)
VALUES ('20000000-0000-0000-0000-000000000001', 'b2222222-2222-2222-2222-000000000000', 'Admin Ritmo', 'admin@ritmo.com.br', '(21) 92222-0000');

INSERT INTO school_memberships (school_id, user_id, role)
VALUES ('22222222-2222-2222-2222-222222222222', '20000000-0000-0000-0000-000000000001', 'SCHOOL_ADMIN');

-- Professora Ana (Dança)
INSERT INTO users (id, auth_user_id, name, email, phone)
VALUES ('20000000-0000-0000-0000-000000000002', 'b2222222-2222-2222-2222-111111111111', 'Ana Costa', 'ana@ritmo.com.br', '(21) 92222-1111');

INSERT INTO school_memberships (school_id, user_id, role)
VALUES ('22222222-2222-2222-2222-222222222222', '20000000-0000-0000-0000-000000000002', 'TEACHER');

INSERT INTO teachers (id, school_id, user_id, specialty, bio)
VALUES ('20000000-0000-0000-0000-100000000001', '22222222-2222-2222-2222-222222222222', '20000000-0000-0000-0000-000000000002', 'Dança Contemporânea e Jazz', 'Coreógrafa e professora de dança com formação internacional.');

-- Aluno Pedro
INSERT INTO users (id, auth_user_id, name, email, phone)
VALUES ('20000000-0000-0000-0000-000000000003', 'b2222222-2222-2222-2222-222222222222', 'Pedro Santos', 'pedro@ritmo.com.br', '(21) 92222-2222');

INSERT INTO school_memberships (school_id, user_id, role)
VALUES ('22222222-2222-2222-2222-222222222222', '20000000-0000-0000-0000-000000000003', 'STUDENT');

INSERT INTO students (id, school_id, user_id, student_code, name, email, phone)
VALUES ('20000000-0000-0000-0000-200000000001', '22222222-2222-2222-2222-222222222222', '20000000-0000-0000-0000-000000000003', 'MAT-201', 'Pedro Santos', 'pedro@ritmo.com.br', '(21) 92222-2222');


-- 5. CURSOS E TURMAS - ESCOLA A
INSERT INTO courses (id, school_id, name, description, category, level)
VALUES ('10000000-0000-0000-0000-300000000001', '11111111-1111-1111-1111-111111111111', 'Violão Básico', 'Curso prático para iniciantes aprenderem acordes, ritmos e primeiras músicas.', 'Música', 'Iniciante');

INSERT INTO course_modules (id, school_id, course_id, title, description, order_index)
VALUES 
('10000000-0000-0000-0000-310000000001', '11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-300000000001', 'Módulo 1: Conhecendo o Instrumento', 'Postura, afinação e primeiros dedos.', 1),
('10000000-0000-0000-0000-310000000002', '11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-300000000001', 'Módulo 2: Acordes Maiores e Menores', 'Troca de acordes e digitação.', 2);

INSERT INTO classes (id, school_id, course_id, teacher_id, unit_id, name, level, capacity)
VALUES ('10000000-0000-0000-0000-400000000001', '11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-300000000001', '10000000-0000-0000-0000-100000000001', '11111111-1111-1111-1111-111111111101', 'Turma Violão A', 'Iniciante', 10);

INSERT INTO enrollments (school_id, student_id, course_id, class_id, start_date, status)
VALUES 
('11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-200000000001', '10000000-0000-0000-0000-300000000001', '10000000-0000-0000-0000-400000000001', '2026-08-01', 'active'),
('11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-200000000002', '10000000-0000-0000-0000-300000000001', '10000000-0000-0000-0000-400000000001', '2026-08-01', 'active');


-- 6. CURSOS E TURMAS - ESCOLA B
INSERT INTO courses (id, school_id, name, description, category, level)
VALUES ('20000000-0000-0000-0000-300000000001', '22222222-2222-2222-2222-222222222222', 'Dança Básica', 'Curso introdutório de ritmo, consciência corporal e coordenação.', 'Dança', 'Iniciante');

INSERT INTO classes (id, school_id, course_id, teacher_id, unit_id, name, level, capacity)
VALUES ('20000000-0000-0000-0000-400000000001', '22222222-2222-2222-2222-222222222222', '20000000-0000-0000-0000-300000000001', '20000000-0000-0000-0000-100000000001', '22222222-2222-2222-2222-222222222201', 'Turma Dança A', 'Iniciante', 15);

INSERT INTO enrollments (school_id, student_id, course_id, class_id, start_date, status)
VALUES ('22222222-2222-2222-2222-222222222222', '20000000-0000-0000-0000-200000000001', '20000000-0000-0000-0000-300000000001', '20000000-0000-0000-0000-400000000001', '2026-08-01', 'active');


-- 7. AULAS E REGISTROS DE AULA - ESCOLA A
INSERT INTO lessons (id, school_id, class_id, teacher_id, scheduled_start, scheduled_end, actual_start, actual_end, status, topic, completed_at)
VALUES 
('10000000-0000-0000-0000-500000000001', '11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-400000000001', '10000000-0000-0000-0000-100000000001', '2026-08-10 14:00:00-03', '2026-08-10 15:00:00-03', '2026-08-10 14:02:00-03', '2026-08-10 15:00:00-03', 'completed', 'Acordes Maiores (C, D, G) e Batida Pop', '2026-08-10 15:05:00-03'),
('10000000-0000-0000-0000-500000000002', '11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-400000000001', '10000000-0000-0000-0000-100000000001', '2026-08-17 14:00:00-03', '2026-08-17 15:00:00-03', NULL, NULL, 'scheduled', 'Troca F → C e Exercícios de Ritmo', NULL);

INSERT INTO lesson_participants (school_id, lesson_id, student_id, attendance_status)
VALUES 
('11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-500000000001', '10000000-0000-0000-0000-200000000001', 'present'),
('11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-500000000001', '10000000-0000-0000-0000-200000000002', 'present');

INSERT INTO lesson_records (school_id, lesson_id, teacher_id, summary, topics, teacher_notes, practice_instructions)
VALUES ('11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-500000000001', '10000000-0000-0000-0000-100000000001', 
'Hoje estudamos os acordes C, D e G e aplicamos na batida pop básica.', 
ARRAY['Acordes C, D, G', 'Batida Pop Básica', 'Postura de mão esquerda'], 
'Turma muito engajada. João dominou a troca rapidamente.', 
'Praticar a troca C -> G por 10 minutos todos os dias.');

INSERT INTO videos (id, school_id, lesson_id, title, storage_path, duration, processing_status, visibility)
VALUES ('10000000-0000-0000-0000-600000000001', '11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-500000000001', 'Demonstração Troca de Acordes C e G', 'school/11111111-1111-1111-1111-111111111111/lessons/10000000-0000-0000-0000-500000000001/videos/aula_acordes.mp4', 180, 'ready', 'students');


-- 8. AULAS E REGISTROS DE AULA - ESCOLA B
INSERT INTO lessons (id, school_id, class_id, teacher_id, scheduled_start, scheduled_end, actual_start, actual_end, status, topic, completed_at)
VALUES ('20000000-0000-0000-0000-500000000001', '22222222-2222-2222-2222-222222222222', '20000000-0000-0000-0000-400000000001', '20000000-0000-0000-0000-100000000001', '2026-08-11 16:00:00-03', '2026-08-11 17:00:00-03', '2026-08-11 16:00:00-03', '2026-08-11 17:00:00-03', 'completed', 'Postura Básica e Sequência de Alongamento', '2026-08-11 17:05:00-03');

INSERT INTO videos (id, school_id, lesson_id, title, storage_path, duration, processing_status, visibility)
VALUES ('20000000-0000-0000-0000-600000000001', '22222222-2222-2222-2222-222222222222', '20000000-0000-0000-0000-500000000001', 'Alongamento Inicial Copacabana', 'school/22222222-2222-2222-2222-222222222222/lessons/20000000-0000-0000-0000-500000000001/videos/alongamento.mp4', 240, 'ready', 'students');
