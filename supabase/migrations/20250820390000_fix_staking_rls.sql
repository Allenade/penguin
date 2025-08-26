-- Fix RLS policies for staking_settings table
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can manage staking settings" ON staking_settings;

-- Create new policy to allow authenticated users to manage staking settings
CREATE POLICY "Authenticated users can manage staking settings" ON staking_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- Also ensure the table has RLS enabled
ALTER TABLE staking_settings ENABLE ROW LEVEL SECURITY;

-- Verify the policy was created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'staking_settings';

