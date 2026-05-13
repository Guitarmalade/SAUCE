-- Initial schema for SAUCE

-- Enable the "uuid-ossp" extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users (Profiles) Table
-- This will store extended profile information linking to auth.users
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('STUDENT', 'TEACHER')),
    instrument TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Practice Logs Table
CREATE TABLE IF NOT EXISTS public.practice_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    what_practiced TEXT NOT NULL,
    feel_rating INTEGER CHECK (feel_rating BETWEEN 1 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Curriculum Units Table
CREATE TABLE IF NOT EXISTS public.curriculum_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Curriculum Skills Table
CREATE TABLE IF NOT EXISTS public.curriculum_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID NOT NULL REFERENCES public.curriculum_units(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Student Skill Progress Table
CREATE TABLE IF NOT EXISTS public.student_skill_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.curriculum_skills(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    completed_by_teacher UUID REFERENCES public.users(id),
    UNIQUE(student_id, skill_id)
);

-- Assignments Table
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    instructions TEXT,
    bpm_target INTEGER,
    due_date DATE,
    status TEXT NOT NULL DEFAULT 'Not Started' CHECK (status IN ('Not Started', 'In Progress', 'Ready for Review', 'Complete')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Assignment Feedback Table
CREATE TABLE IF NOT EXISTS public.assignment_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    feedback_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Student Milestones Table
CREATE TABLE IF NOT EXISTS public.student_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL REFERENCES public.curriculum_units(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(student_id, unit_id)
);

-- Today's Focus Table (Optional - for the pinned exercise feature)
CREATE TABLE IF NOT EXISTS public.todays_focus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    exercise_title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Turn on Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculum_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculum_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_skill_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todays_focus ENABLE ROW LEVEL SECURITY;

-- Note: RLS Policies need to be configured based on application requirements.
-- For now, allowing all operations for authenticated users as a starting point.
-- (In production, you'd restrict this so students only see their own data)
CREATE POLICY "Allow authenticated full access" ON public.users FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access" ON public.practice_logs FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access" ON public.curriculum_units FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access" ON public.curriculum_skills FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access" ON public.student_skill_progress FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access" ON public.assignments FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access" ON public.assignment_feedback FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access" ON public.student_milestones FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access" ON public.todays_focus FOR ALL TO authenticated USING (true);

-- Trigger to automatically create a user profile when a new auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email, role)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'name', 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'role', 'STUDENT')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
