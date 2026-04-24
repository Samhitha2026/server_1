-- SQL for CityVoice Schema

-- Create the complaints table
CREATE TABLE IF NOT EXISTS public.complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    citizen_name TEXT NOT NULL,
    citizen_email TEXT NOT NULL,
    citizen_phone TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    authority_assigned TEXT,
    category TEXT,
    priority TEXT DEFAULT 'Medium',
    status TEXT DEFAULT 'Pending',
    media_urls TEXT[] DEFAULT '{}',
    updates JSONB DEFAULT '[]'::jsonb,
    user_id UUID REFERENCES auth.users(id) -- Optional: link to citizen account
);

-- Enable RLS
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Anyone can view (transparency requested)
CREATE POLICY "Public complaints are viewable by everyone" ON public.complaints
    FOR SELECT USING (true);

-- 2. Citizens can insert
CREATE POLICY "Citizens can insert complaints" ON public.complaints
    FOR INSERT WITH CHECK (true);

-- 3. Only authorities (or everyone for now in demo) can update
CREATE POLICY "Everyone can update for demo" ON public.complaints
    FOR UPDATE USING (true);
