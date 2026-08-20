-- Migration: 20260815000006_module_contents.sql
-- Description: Creates a junction table to link contents (lessons/videos/pdfs) to course modules

CREATE TABLE IF NOT EXISTS public.module_contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_module_content UNIQUE(module_id, content_id)
);

-- Trigger for updated_at
CREATE TRIGGER trg_update_module_contents 
    BEFORE UPDATE ON public.module_contents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_module_contents_module_id ON public.module_contents(module_id);
CREATE INDEX IF NOT EXISTS idx_module_contents_school_id ON public.module_contents(school_id);
