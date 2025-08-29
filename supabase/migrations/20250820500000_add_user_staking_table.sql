-- Add user_staking table and sample data for admin staking management
-- This migration creates the user_staking table and populates it with sample data

-- Create user_staking table for tracking individual staking activities
CREATE TABLE IF NOT EXISTS user_staking (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    crypto_symbol TEXT NOT NULL DEFAULT 'PENGU',
    staked_amount DECIMAL(15,8) NOT NULL,
    rewards_earned DECIMAL(15,8) DEFAULT 0.00000000,
    apy_at_stake DECIMAL(5,2) NOT NULL,
    staked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unstaked_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'unstaked', 'force_unstaked')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_staking_user_id ON user_staking(user_id);
CREATE INDEX IF NOT EXISTS idx_user_staking_status ON user_staking(status);
CREATE INDEX IF NOT EXISTS idx_user_staking_crypto_symbol ON user_staking(crypto_symbol);
CREATE INDEX IF NOT EXISTS idx_user_staking_staked_at ON user_staking(staked_at);

-- Enable RLS on user_staking table
ALTER TABLE user_staking ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_staking
CREATE POLICY "Users can view own staking" ON user_staking
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own staking" ON user_staking
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own staking" ON user_staking
    FOR UPDATE USING (auth.uid() = user_id);

-- Admin can view all staking (for admin panel)
CREATE POLICY "Admins can view all staking" ON user_staking
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.user_id = auth.uid() 
            AND admin_users.is_active = true
        )
    );

-- Admin can update all staking (for admin panel)
CREATE POLICY "Admins can update all staking" ON user_staking
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.user_id = auth.uid() 
            AND admin_users.is_active = true
        )
    );

-- Insert sample user staking data
-- Note: These user_ids should match existing users in your auth.users table
-- You may need to adjust these UUIDs to match your actual users

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
-- Active stakes
(
    (SELECT user_id FROM user_profiles WHERE wallet_username = 'crypto_whale' LIMIT 1),
    'PENGU',
    10000.00000000,
    1250.00000000,
    12.50,
    '2024-01-15 10:30:00',
    'active',
    'High-value staker'
),
(
    (SELECT user_id FROM user_profiles WHERE wallet_username = 'trader_jane' LIMIT 1),
    'PENGU',
    5000.00000000,
    625.00000000,
    12.50,
    '2024-02-20 14:15:00',
    'active',
    'Medium staker'
),
(
    (SELECT user_id FROM user_profiles WHERE wallet_username = 'staking_master' LIMIT 1),
    'PENGU',
    15000.00000000,
    1875.00000000,
    12.50,
    '2024-01-25 16:20:00',
    'active',
    'Staking focused user'
),
(
    (SELECT user_id FROM user_profiles WHERE wallet_username = 'reward_collector' LIMIT 1),
    'PENGU',
    25000.00000000,
    3125.00000000,
    12.50,
    '2024-01-10 08:00:00',
    'active',
    'High rewards collector'
),
(
    (SELECT user_id FROM user_profiles WHERE wallet_username = 'balanced_portfolio' LIMIT 1),
    'PENGU',
    8000.00000000,
    1000.00000000,
    12.50,
    '2024-02-05 15:45:00',
    'active',
    'Balanced portfolio user'
),
(
    (SELECT user_id FROM user_profiles WHERE wallet_username = 'vip_trader' LIMIT 1),
    'PENGU',
    20000.00000000,
    2500.00000000,
    12.50,
    '2024-01-01 12:00:00',
    'active',
    'VIP trader'
),

-- Paused stakes
(
    (SELECT user_id FROM user_profiles WHERE wallet_username = 'small_investor' LIMIT 1),
    'PENGU',
    500.00000000,
    62.50000000,
    12.50,
    '2024-02-28 11:30:00',
    'paused',
    'Paused for investigation'
),

-- Unstaked positions
(
    (SELECT user_id FROM user_profiles WHERE wallet_username = 'newbie_crypto' LIMIT 1),
    'PENGU',
    1000.00000000,
    125.00000000,
    12.50,
    '2024-03-10 09:45:00',
    'unstaked',
    'Completed staking period'
);

-- Create function to update user_profiles staked_pengu and staking_rewards
CREATE OR REPLACE FUNCTION update_user_staking_totals()
RETURNS TRIGGER AS $$
BEGIN
    -- Update user_profiles with total staked and rewards
    UPDATE user_profiles 
    SET 
        staked_pengu = (
            SELECT COALESCE(SUM(staked_amount), 0)
            FROM user_staking 
            WHERE user_id = NEW.user_id 
            AND status = 'active'
        ),
        staking_rewards = (
            SELECT COALESCE(SUM(rewards_earned), 0)
            FROM user_staking 
            WHERE user_id = NEW.user_id
        ),
        updated_at = NOW()
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update user_profiles when user_staking changes
CREATE TRIGGER trigger_update_user_staking_totals
    AFTER INSERT OR UPDATE OR DELETE ON user_staking
    FOR EACH ROW
    EXECUTE FUNCTION update_user_staking_totals();
