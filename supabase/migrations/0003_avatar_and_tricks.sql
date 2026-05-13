-- Phase 3: Guitar Avatar System & Bag O' Tricks

-- 1. Student Avatars Table
-- Stores the student's ideal archetype and their Current vs Ideal skill levels across the 5 core elements
CREATE TABLE IF NOT EXISTS public.student_avatars (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    archetype TEXT NOT NULL, -- e.g., 'The Groove Master', 'The Blues Architect'
    
    -- Current Abilities (1-10)
    current_fretboard INTEGER CHECK (current_fretboard >= 1 AND current_fretboard <= 10),
    current_rhythm INTEGER CHECK (current_rhythm >= 1 AND current_rhythm <= 10),
    current_technique INTEGER CHECK (current_technique >= 1 AND current_technique <= 10),
    current_theory INTEGER CHECK (current_theory >= 1 AND current_theory <= 10),
    current_repertoire INTEGER CHECK (current_repertoire >= 1 AND current_repertoire <= 10),
    
    -- Ideal Abilities (1-10)
    ideal_fretboard INTEGER CHECK (ideal_fretboard >= 1 AND ideal_fretboard <= 10),
    ideal_rhythm INTEGER CHECK (ideal_rhythm >= 1 AND ideal_rhythm <= 10),
    ideal_technique INTEGER CHECK (ideal_technique >= 1 AND ideal_technique <= 10),
    ideal_theory INTEGER CHECK (ideal_theory >= 1 AND ideal_theory <= 10),
    ideal_repertoire INTEGER CHECK (ideal_repertoire >= 1 AND ideal_repertoire <= 10),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id) -- One active avatar profile per user
);

-- Enable RLS for student_avatars
ALTER TABLE public.student_avatars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own avatar" 
    ON public.student_avatars FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own avatar" 
    ON public.student_avatars FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own avatar" 
    ON public.student_avatars FOR UPDATE 
    USING (auth.uid() = user_id);

-- 2. Bag O' Tricks Table
-- Stores the specific techniques, licks, and concepts the student is collecting/stealing
CREATE TABLE IF NOT EXISTS public.bag_o_tricks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Lead', 'Rhythm')),
    title TEXT NOT NULL,
    description TEXT,
    source_inspiration TEXT, -- e.g., "Stolen from SRV Texas Flood"
    mastery_status TEXT DEFAULT 'Learning' CHECK (mastery_status IN ('Learning', 'Assimilated', 'Utilizing', 'Mastered')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for bag_o_tricks
ALTER TABLE public.bag_o_tricks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tricks" 
    ON public.bag_o_tricks FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tricks" 
    ON public.bag_o_tricks FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tricks" 
    ON public.bag_o_tricks FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tricks" 
    ON public.bag_o_tricks FOR DELETE 
    USING (auth.uid() = user_id);
