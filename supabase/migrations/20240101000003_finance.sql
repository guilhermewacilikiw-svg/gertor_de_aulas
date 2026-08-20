-- Phase 5: Financial Tracking (No Gateways)

-- Plans Table: The subscription plans a school offers to its students
CREATE TABLE IF NOT EXISTS plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    billing_cycle VARCHAR(50) DEFAULT 'monthly', -- 'monthly', 'quarterly', 'yearly'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student Plans: Linking students to a specific plan
CREATE TABLE IF NOT EXISTS student_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE RESTRICT,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'canceled'
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, plan_id)
);

-- Invoices: The actual monthly charges (mensalidades)
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES plans(id) ON DELETE SET NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'overdue', 'canceled'
    due_date DATE NOT NULL,
    payment_date DATE,
    reference_month VARCHAR(7), -- e.g., '2024-01'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Plans
CREATE POLICY "Users can view plans of their school" ON plans
    FOR SELECT USING (belongs_to_school(school_id));
CREATE POLICY "Admins can manage plans" ON plans
    FOR ALL USING (has_school_role(school_id, 'admin'));

-- RLS Policies for Student Plans
CREATE POLICY "Users can view student plans of their school" ON student_plans
    FOR SELECT USING (belongs_to_school(school_id));
CREATE POLICY "Admins can manage student plans" ON student_plans
    FOR ALL USING (has_school_role(school_id, 'admin'));

-- RLS Policies for Invoices
-- Admin can do everything
CREATE POLICY "Admins can manage invoices" ON invoices
    FOR ALL USING (has_school_role(school_id, 'admin'));

-- Students can ONLY view their OWN invoices
CREATE POLICY "Students can view their own invoices" ON invoices
    FOR SELECT USING (
        belongs_to_school(school_id) AND
        student_id IN (
            SELECT student_id 
            FROM school_memberships 
            WHERE user_id = auth.uid() AND school_id = invoices.school_id
        )
    );
