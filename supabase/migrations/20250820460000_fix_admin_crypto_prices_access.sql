-- Fix admin access to crypto_prices table
-- Create admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Enable RLS on admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin_users
CREATE POLICY "Admins can manage admin_users" ON admin_users
    FOR ALL USING (auth.uid() = user_id);

-- Drop existing crypto_prices policies
DROP POLICY IF EXISTS "Allow admin access to crypto_prices" ON crypto_prices;
DROP POLICY IF EXISTS "Allow public read access to crypto_prices" ON crypto_prices;

-- Create simpler admin policy for crypto_prices
CREATE POLICY "Allow admin access to crypto_prices" ON crypto_prices
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

-- Create public read policy for crypto_prices
CREATE POLICY "Allow public read access to crypto_prices" ON crypto_prices
    FOR SELECT USING (true);

-- Add unique constraint to existing admin_users table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'admin_users_user_id_key' 
        AND table_name = 'admin_users'
    ) THEN
        ALTER TABLE admin_users ADD CONSTRAINT admin_users_user_id_key UNIQUE (user_id);
    END IF;
END $$;

-- Insert admin user (replace with your actual admin user ID)
-- You'll need to replace 'admin@example.com' with your actual admin email
INSERT INTO admin_users (user_id, email, is_active)
VALUES (
    (SELECT id FROM auth.users WHERE email = 'admin@example.com' LIMIT 1),
    'admin@example.com',
    TRUE
) ON CONFLICT (user_id) DO NOTHING;
