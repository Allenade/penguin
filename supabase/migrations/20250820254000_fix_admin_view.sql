-- Fix admin viewing of key phrases
-- Drop the restrictive policy
DROP POLICY IF EXISTS "Only admins can view key phrases" ON key_phrases;

-- Create a policy that allows authenticated users to view (admin will be authenticated)
CREATE POLICY "Authenticated users can view key phrases" ON key_phrases
    FOR SELECT USING (auth.role() = 'authenticated');
