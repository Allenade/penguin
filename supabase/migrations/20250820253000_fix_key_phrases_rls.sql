-- Fix RLS policy for key_phrases table
-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can insert key phrases" ON key_phrases;
DROP POLICY IF EXISTS "Only admins can view key phrases" ON key_phrases;

-- Create new policies that work properly
CREATE POLICY "Anyone can insert key phrases" ON key_phrases
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Only admins can view key phrases" ON key_phrases
    FOR SELECT USING (auth.role() = 'authenticated');
