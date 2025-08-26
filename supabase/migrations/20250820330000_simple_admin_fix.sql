-- Simple fix: Allow normal authenticated users to manage wallet addresses
-- This removes the admin_users requirement and makes it work with normal login

-- Update RLS policies for deposit_addresses to allow any authenticated user
DROP POLICY IF EXISTS "Admins can manage deposit addresses" ON deposit_addresses;
DROP POLICY IF EXISTS "Anyone authenticated can manage deposit addresses" ON deposit_addresses;

-- Create simple policy: any authenticated user can manage deposit addresses
CREATE POLICY "Authenticated users can manage deposit addresses" ON deposit_addresses
    FOR ALL USING (auth.role() = 'authenticated');

-- Update RLS policies for withdrawal_addresses to allow any authenticated user  
DROP POLICY IF EXISTS "Admins can manage withdrawal_addresses" ON withdrawal_addresses;
DROP POLICY IF EXISTS "Anyone authenticated can manage withdrawal_addresses" ON withdrawal_addresses;

-- Create simple policy: any authenticated user can manage withdrawal addresses
CREATE POLICY "Authenticated users can manage withdrawal_addresses" ON withdrawal_addresses
    FOR ALL USING (auth.role() = 'authenticated');

