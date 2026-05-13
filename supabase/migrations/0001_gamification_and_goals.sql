-- Gamification and Personalized Roadmaps Schema Expansion

-- Add Gamification columns to Users
ALTER TABLE public.users
ADD COLUMN xp_points INTEGER DEFAULT 0 NOT NULL,
ADD COLUMN current_level INTEGER DEFAULT 1 NOT NULL;

-- Student Goals Table
CREATE TABLE IF NOT EXISTS public.student_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target_date DATE,
    status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Completed', 'Archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Personalized Roadmaps Table
-- A roadmap is a sequence of steps specifically tailored to achieve a goal
CREATE TABLE IF NOT EXISTS public.personalized_roadmaps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_id UUID NOT NULL REFERENCES public.student_goals(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Roadmap Steps Table
CREATE TABLE IF NOT EXISTS public.roadmap_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    roadmap_id UUID NOT NULL REFERENCES public.personalized_roadmaps(id) ON DELETE CASCADE,
    curriculum_skill_id UUID REFERENCES public.curriculum_skills(id) ON DELETE SET NULL, -- Optional link to core curriculum
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT,
    tab_url TEXT,
    order_index INTEGER NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE NOT NULL,
    xp_reward INTEGER DEFAULT 50 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Badges Table
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    xp_value INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Student Badges Table (Which students earned which badges)
CREATE TABLE IF NOT EXISTS public.student_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(student_id, badge_id)
);

-- Update Assignments to support media
ALTER TABLE public.assignments
ADD COLUMN video_url TEXT,
ADD COLUMN tab_url TEXT;

-- Enable RLS
ALTER TABLE public.student_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personalized_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_badges ENABLE ROW LEVEL SECURITY;

-- Base Policies (In production these should be restricted)
CREATE POLICY "Allow authenticated full access" ON public.student_goals FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access" ON public.personalized_roadmaps FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access" ON public.roadmap_steps FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access" ON public.badges FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access" ON public.student_badges FOR ALL TO authenticated USING (true);
