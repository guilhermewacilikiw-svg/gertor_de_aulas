-- Função para criar um aluno ignorando o fluxo normal de signUp (usado por Administradores)
-- ATENÇÃO: Esta função deve ser executada no SQL Editor do seu projeto no Supabase.

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

CREATE OR REPLACE FUNCTION public.admin_create_student(
    p_email text,
    p_name text,
    p_password text,
    p_school_id uuid
) RETURNS json AS $$
DECLARE
    v_user_id uuid;
    v_public_user_id uuid;
BEGIN
    -- 1. Verifica se o usuário já existe na tabela auth.users
    IF EXISTS (SELECT 1 FROM auth.users WHERE email = p_email) THEN
        RETURN json_build_object('error', 'Já existe um usuário com este e-mail cadastrado na plataforma.');
    END IF;

    -- 2. Gera um ID para o novo usuário auth
    v_user_id := gen_random_uuid();

    -- 3. Insere diretamente na tabela auth.users (necessita SECURITY DEFINER)
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        v_user_id,
        'authenticated',
        'authenticated',
        p_email,
        extensions.crypt(p_password, extensions.gen_salt('bf'::text)),
        NOW(),
        '{"provider":"email","providers":["email"]}',
        json_build_object('name', p_name),
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
    );

    -- 4. O Trigger 'handle_new_auth_user' já deve ter criado o public.users correspondente.
    -- Vamos recuperar o ID do public.users
    SELECT id INTO v_public_user_id FROM public.users WHERE auth_user_id = v_user_id;

    -- Se o trigger não rodou rápido o suficiente ou não existe, podemos inserir manualmente:
    IF v_public_user_id IS NULL THEN
        INSERT INTO public.users (auth_user_id, name, email, status)
        VALUES (v_user_id, p_name, p_email, 'active')
        RETURNING id INTO v_public_user_id;
    END IF;

    -- 5. Vincular à escola (school_memberships)
    INSERT INTO public.school_memberships (school_id, user_id, role)
    VALUES (p_school_id, v_public_user_id, 'STUDENT');

    -- 6. Inserir no perfil específico de Aluno
    INSERT INTO public.students (user_id, school_id, name, email)
    VALUES (v_public_user_id, p_school_id, p_name, p_email);

    RETURN json_build_object('success', true, 'user_id', v_user_id);

EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions;
