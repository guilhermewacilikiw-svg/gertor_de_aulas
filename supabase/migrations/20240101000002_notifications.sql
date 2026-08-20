-- Add gamification columns to students
ALTER TABLE students ADD COLUMN IF NOT EXISTS xp_points INTEGER DEFAULT 0;
ALTER TABLE students ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'system', 'lesson_completed', 'achievement', 'alert'
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    link VARCHAR(255),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Notifications RLS Policy: Users can only see their own notifications within their school context
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (
        auth.uid() = user_id AND 
        belongs_to_school(school_id)
    );

CREATE POLICY "Users can update their own notifications (mark as read)" ON notifications
    FOR UPDATE USING (
        auth.uid() = user_id AND 
        belongs_to_school(school_id)
    );

-- Enable Realtime for notifications
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Create function to handle lesson completion gamification & notification
CREATE OR REPLACE FUNCTION handle_lesson_completion()
RETURNS TRIGGER AS $$
DECLARE
    student_record RECORD;
    gained_xp INTEGER := 50; -- Base XP for attending a lesson
BEGIN
    -- Check if status changed to 'completed'
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        
        -- Loop through all students who attended (present) in this lesson
        FOR student_record IN 
            SELECT student_id 
            FROM attendance 
            WHERE lesson_id = NEW.id AND status = 'present'
        LOOP
            -- 1. Give XP
            UPDATE students 
            SET xp_points = xp_points + gained_xp,
                level = 1 + ((xp_points + gained_xp) / 500)
            WHERE id = student_record.student_id;

            -- 2. Notification
            INSERT INTO notifications (user_id, school_id, type, title, content, link)
            SELECT 
                sm.user_id, 
                NEW.school_id, 
                'lesson_completed',
                'Aula concluída com sucesso!',
                'O resumo da aula e materiais já estão disponíveis. Você ganhou +' || gained_xp || ' XP!',
                '/aluno/aulas/' || NEW.id
            FROM school_memberships sm
            WHERE sm.student_id = student_record.student_id
            LIMIT 1;

        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create Trigger
DROP TRIGGER IF EXISTS trigger_lesson_completion ON lessons;
CREATE TRIGGER trigger_lesson_completion
    AFTER UPDATE OF status ON lessons
    FOR EACH ROW
    EXECUTE FUNCTION handle_lesson_completion();
