-- Simple user_staking table setup
-- Run this in Supabase SQL Editor

-- Create user_staking table
CREATE TABLE IF NOT EXISTS user_staking (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    crypto_symbol TEXT NOT NULL DEFAULT 'PENGU',
    staked_amount DECIMAL(15,8) NOT NULL,
    rewards_earned DECIMAL(15,8) DEFAULT 0.00000000,
    apy_at_stake DECIMAL(5,2) NOT NULL,
    staked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unstaked_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'active',
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create basic indexes
CREATE INDEX IF NOT EXISTS idx_user_staking_user_id ON user_staking(user_id);
CREATE INDEX IF NOT EXISTS idx_user_staking_status ON user_staking(status);

-- Temporarily disable RLS for testing
ALTER TABLE user_staking DISABLE ROW LEVEL SECURITY;

-- Insert some test data using random UUIDs (we'll update these later)
INSERT INTO user_staking (
    user_id,
    crypto_symbol,
    staked_amount,
    rewards_earned,
    apy_at_stake,
    staked_at,
    status,
    admin_notes
) VALUES 
-- Test data with placeholder UUIDs
(
    '00000000-0000-0000-0000-000000000001',
    'PENGU',
    10000.00000000,
    1250.00000000,
    12.50,
    '2024-01-15 10:30:00',
    'active',
    'Test user 1'
),
(
    '00000000-0000-0000-0000-000000000002',
    'PENGU',
    5000.00000000,
    625.00000000,
    12.50,
    '2024-02-20 14:15:00',
    'active',
    'Test user 2'
),
(
    '00000000-0000-0000-0000-000000000003',
    'PENGU',
    15000.00000000,
    1875.00000000,
    12.50,
    '2024-01-25 16:20:00',
    'active',
    'Test user 3'
),
(
    '00000000-0000-0000-0000-000000000004',
    'PENGU',
    25000.00000000,
    3125.00000000,
    12.50,
    '2024-01-10 08:00:00',
    'active',
    'Test user 4'
),
(
    '00000000-0000-0000-0000-000000000005',
    'PENGU',
    500.00000000,
    62.50000000,
    12.50,
    '2024-02-28 11:30:00',
    'paused',
    'Paused test user'
);

-- Verify the table was created
SELECT 
    'user_staking table created successfully' as status,
    COUNT(*) as total_records,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_stakes,
    COUNT(CASE WHEN status = 'paused' THEN 1 END) as paused_stakes
FROM user_staking;
