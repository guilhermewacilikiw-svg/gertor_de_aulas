-- Migration: 20260901000000_saas_plans_and_limits.sql
-- Description: Plans model, subscription status, trial control, and school limits

-- 1. Create Plans Table
CREATE TABLE IF NOT EXISTS public.plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    price_monthly NUMERIC(10,2) NOT NULL,
    price_yearly NUMERIC(10,2) NOT NULL,
    max_students INTEGER NOT NULL, -- -1 for unlimited
    max_teachers INTEGER NOT NULL, -- -1 for unlimited
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Add SaaS subscription columns to schools table if not present
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='plan_id') THEN
        ALTER TABLE public.schools ADD COLUMN plan_id UUID REFERENCES public.plans(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='subscription_status') THEN
        ALTER TABLE public.schools ADD COLUMN subscription_status TEXT NOT NULL DEFAULT 'trialing';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='trial_ends_at') THEN
        ALTER TABLE public.schools ADD COLUMN trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='current_period_start') THEN
        ALTER TABLE public.schools ADD COLUMN current_period_start TIMESTAMPTZ DEFAULT NOW();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='current_period_end') THEN
        ALTER TABLE public.schools ADD COLUMN current_period_end TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='gateway_customer_id') THEN
        ALTER TABLE public.schools ADD COLUMN gateway_customer_id TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='gateway_subscription_id') THEN
        ALTER TABLE public.schools ADD COLUMN gateway_subscription_id TEXT;
    END IF;
END $$;

-- 3. Seed Base Plans
INSERT INTO public.plans (code, name, description, price_monthly, price_yearly, max_students, max_teachers, features)
VALUES 
    (
        'solo', 
        'Solo (Garage)', 
        'Ideal para professores autônomos e estúdios particulares iniciando suas aulas.', 
        59.00, 
        588.00, 
        30, 
        1, 
        '["Até 30 alunos", "1 Professor / Admin", "Agenda inteligente e grade de horários", "Diário de classe e chamadas", "Controle financeiro básico"]'::jsonb
    ),
    (
        'stage', 
        'Stage (Pro)', 
        'Para escolas de música consolidadas com múltiplos professores e alta rotatividade.', 
        169.00, 
        1668.00, 
        150, 
        8, 
        '["Até 150 alunos", "Até 8 professores", "Múltiplos horários e participantes por turma", "Gamificação completa (Níveis e XP)", "Gestão de faturas e boletos", "Upload ilimitado de conteúdos e partituras", "Relatórios de desempenho"]'::jsonb
    ),
    (
        'festival', 
        'Festival (Arena)', 
        'Para grandes conservatórios, franquias e redes com alto volume de alunos.', 
        349.00, 
        3468.00, 
        -1, 
        -1, 
        '["Alunos ilimitados", "Professores ilimitados", "Multi-unidades e filiais", "Branding customizado da escola", "Exportação de dados e relatórios contábeis", "Suporte prioritário via WhatsApp"]'::jsonb
    )
ON CONFLICT (code) DO UPDATE 
SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    price_monthly = EXCLUDED.price_monthly,
    price_yearly = EXCLUDED.price_yearly,
    max_students = EXCLUDED.max_students,
    max_teachers = EXCLUDED.max_teachers,
    features = EXCLUDED.features;

-- 4. Assign default Stage plan and Active status to any existing school
UPDATE public.schools 
SET 
    plan_id = (SELECT id FROM public.plans WHERE code = 'stage' LIMIT 1),
    subscription_status = 'active',
    trial_ends_at = NOW() + INTERVAL '30 days',
    current_period_end = NOW() + INTERVAL '30 days'
WHERE plan_id IS NULL;

-- 5. RLS Policies for Plans
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to active plans" 
ON public.plans FOR SELECT 
USING (is_active = true);

GRANT ALL ON TABLE public.plans TO authenticated;
GRANT SELECT ON TABLE public.plans TO anon;
GRANT ALL ON TABLE public.plans TO service_role;
