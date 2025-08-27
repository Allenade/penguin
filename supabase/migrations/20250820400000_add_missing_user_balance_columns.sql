-- Add missing balance columns to user_profiles table
-- This migration adds the cryptocurrency balance columns that the admin panel expects

ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS usdt_balance DECIMAL(15,8) DEFAULT 0.00000000,
ADD COLUMN IF NOT EXISTS sol_balance DECIMAL(15,8) DEFAULT 0.00000000,
ADD COLUMN IF NOT EXISTS eth_balance DECIMAL(15,8) DEFAULT 0.00000000,
ADD COLUMN IF NOT EXISTS btc_balance DECIMAL(15,8) DEFAULT 0.00000000,
ADD COLUMN IF NOT EXISTS staked_pengu DECIMAL(15,8) DEFAULT 0.00000000,
ADD COLUMN IF NOT EXISTS staking_rewards DECIMAL(15,8) DEFAULT 0.00000000,
ADD COLUMN IF NOT EXISTS welcome_bonus_claimed BOOLEAN DEFAULT FALSE;

-- Update existing records to have default values
UPDATE user_profiles 
SET 
    usdt_balance = 0.00000000,
    sol_balance = 0.00000000,
    eth_balance = 0.00000000,
    btc_balance = 0.00000000,
    staked_pengu = 0.00000000,
    staking_rewards = 0.00000000,
    welcome_bonus_claimed = FALSE
WHERE usdt_balance IS NULL 
   OR sol_balance IS NULL 
   OR eth_balance IS NULL 
   OR btc_balance IS NULL 
   OR staked_pengu IS NULL 
   OR staking_rewards IS NULL 
   OR welcome_bonus_claimed IS NULL;
