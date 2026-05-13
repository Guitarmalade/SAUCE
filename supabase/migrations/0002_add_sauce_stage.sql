-- Add SAUCE stage to practice logs
ALTER TABLE public.practice_logs
ADD COLUMN IF NOT EXISTS sauce_stage TEXT CHECK (sauce_stage IN ('Study (Steal)', 'Assimilate', 'Utilize', 'Compose', 'Elevate'));
