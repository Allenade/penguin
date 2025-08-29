-- Create user_staking table and sample data for admin staking management
-- Run this script in your Supabase SQL Editor

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
-- First, let's get some existing user IDs from user_profiles
DO $$
DECLARE
    whale_user_id UUID;
    jane_user_id UUID;
    master_user_id UUID;
    collector_user_id UUID;
    portfolio_user_id UUID;
    vip_user_id UUID;
    investor_user_id UUID;
    newbie_user_id UUID;
BEGIN
    -- Get user IDs from existing user_profiles
    SELECT user_id INTO whale_user_id FROM user_profiles WHERE wallet_username = 'crypto_whale' LIMIT 1;
    SELECT user_id INTO jane_user_id FROM user_profiles WHERE wallet_username = 'trader_jane' LIMIT 1;
    SELECT user_id INTO master_user_id FROM user_profiles WHERE wallet_username = 'staking_master' LIMIT 1;
    SELECT user_id INTO collector_user_id FROM user_profiles WHERE wallet_username = 'reward_collector' LIMIT 1;
    SELECT user_id INTO portfolio_user_id FROM user_profiles WHERE wallet_username = 'balanced_portfolio' LIMIT 1;
    SELECT user_id INTO vip_user_id FROM user_profiles WHERE wallet_username = 'vip_trader' LIMIT 1;
    SELECT user_id INTO investor_user_id FROM user_profiles WHERE wallet_username = 'small_investor' LIMIT 1;
    SELECT user_id INTO newbie_user_id FROM user_profiles WHERE wallet_username = 'newbie_crypto' LIMIT 1;

    -- Insert sample staking data if users exist
    IF whale_user_id IS NOT NULL THEN
        INSERT INTO user_staking (user_id, crypto_symbol, staked_amount, rewards_earned, apy_at_stake, staked_at, status, admin_notes)
        VALUES (whale_user_id, 'PENGU', 10000.00000000, 1250.00000000, 12.50, '2024-01-15 10:30:00', 'active', 'High-value staker');
    END IF;

    IF jane_user_id IS NOT NULL THEN
        INSERT INTO user_staking (user_id, crypto_symbol, staked_amount, rewards_earned, apy_at_stake, staked_at, status, admin_notes)
        VALUES (jane_user_id, 'PENGU', 5000.00000000, 625.00000000, 12.50, '2024-02-20 14:15:00', 'active', 'Medium staker');
    END IF;

    IF master_user_id IS NOT NULL THEN
        INSERT INTO user_staking (user_id, crypto_symbol, staked_amount, rewards_earned, apy_at_stake, staked_at, status, admin_notes)
        VALUES (master_user_id, 'PENGU', 15000.00000000, 1875.00000000, 12.50, '2024-01-25 16:20:00', 'active', 'Staking focused user');
    END IF;

    IF collector_user_id IS NOT NULL THEN
        INSERT INTO user_staking (user_id, crypto_symbol, staked_amount, rewards_earned, apy_at_stake, staked_at, status, admin_notes)
        VALUES (collector_user_id, 'PENGU', 25000.00000000, 3125.00000000, 12.50, '2024-01-10 08:00:00', 'active', 'High rewards collector');
    END IF;

    IF portfolio_user_id IS NOT NULL THEN
        INSERT INTO user_staking (user_id, crypto_symbol, staked_amount, rewards_earned, apy_at_stake, staked_at, status, admin_notes)
        VALUES (portfolio_user_id, 'PENGU', 8000.00000000, 1000.00000000, 12.50, '2024-02-05 15:45:00', 'active', 'Balanced portfolio user');
    END IF;

    IF vip_user_id IS NOT NULL THEN
        INSERT INTO user_staking (user_id, crypto_symbol, staked_amount, rewards_earned, apy_at_stake, staked_at, status, admin_notes)
        VALUES (vip_user_id, 'PENGU', 20000.00000000, 2500.00000000, 12.50, '2024-01-01 12:00:00', 'active', 'VIP trader');
    END IF;

    IF investor_user_id IS NOT NULL THEN
        INSERT INTO user_staking (user_id, crypto_symbol, staked_amount, rewards_earned, apy_at_stake, staked_at, status, admin_notes)
        VALUES (investor_user_id, 'PENGU', 500.00000000, 62.50000000, 12.50, '2024-02-28 11:30:00', 'paused', 'Paused for investigation');
    END IF;

    IF newbie_user_id IS NOT NULL THEN
        INSERT INTO user_staking (user_id, crypto_symbol, staked_amount, rewards_earned, apy_at_stake, staked_at, status, admin_notes)
        VALUES (newbie_user_id, 'PENGU', 1000.00000000, 125.00000000, 12.50, '2024-03-10 09:45:00', 'unstaked', 'Completed staking period');
    END IF;
END $$;

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

-- Verify the table was created and has data
SELECT 
    'user_staking table created successfully' as status,
    COUNT(*) as total_records,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_stakes,
    COUNT(CASE WHEN status = 'paused' THEN 1 END) as paused_stakes,
    COUNT(CASE WHEN status = 'unstaked' THEN 1 END) as unstaked_stakes
FROM user_staking;
