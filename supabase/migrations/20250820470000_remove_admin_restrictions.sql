-- Remove admin restrictions and allow public access to crypto_prices
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow admin access to crypto_prices" ON crypto_prices;
DROP POLICY IF EXISTS "Allow public read access to crypto_prices" ON crypto_prices;

-- Create simple public access policy for crypto_prices
CREATE POLICY "Allow public access to crypto_prices" ON crypto_prices
    FOR ALL USING (true);

-- Also remove admin restrictions from user_profiles for crypto price access
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON user_profiles;

-- Create simple public access policy for user_profiles
CREATE POLICY "Allow public access to user_profiles" ON user_profiles
    FOR ALL USING (true);

-- Remove admin restrictions from withdrawal_requests
DROP POLICY IF EXISTS "Admins can view all withdrawal requests" ON withdrawal_requests;
DROP POLICY IF EXISTS "Admins can manage all withdrawal requests" ON withdrawal_requests;

-- Create simple public access policy for withdrawal_requests
CREATE POLICY "Allow public access to withdrawal_requests" ON withdrawal_requests
    FOR ALL USING (true);





