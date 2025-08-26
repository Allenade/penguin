-- Simple Sample User Data for PENGU Platform
-- This script adds realistic test users with various balance scenarios

-- Insert sample users into user_profiles table
INSERT INTO user_profiles (
    user_id,
    email,
    wallet_username,
    pengu_tokens,
    usdt_balance,
    sol_balance,
    eth_balance,
    btc_balance,
    staked_pengu,
    staking_rewards,
    total_investment,
    total_balance,
    welcome_bonus_claimed,
    is_verified,
    verification_level,
    created_at,
    updated_at
) VALUES 
-- High-value user
(
    gen_random_uuid(),
    'crypto_whale@example.com',
    'crypto_whale',
    50000.00,
    25000.00,
    150.00,
    25.00,
    2.50,
    10000.00,
    1250.00,
    100000.00,
    125000.00,
    true,
    true,
    3,
    '2024-01-15 10:30:00',
    NOW()
),

-- Medium user
(
    gen_random_uuid(),
    'trader_jane@example.com',
    'trader_jane',
    15000.00,
    8000.00,
    45.00,
    8.50,
    0.85,
    5000.00,
    625.00,
    30000.00,
    37500.00,
    true,
    true,
    2,
    '2024-02-20 14:15:00',
    NOW()
),

-- New user with welcome bonus
(
    gen_random_uuid(),
    'newbie_crypto@example.com',
    'newbie_crypto',
    5000.00,
    1000.00,
    5.00,
    1.00,
    0.10,
    1000.00,
    125.00,
    5000.00,
    6250.00,
    true,
    false,
    1,
    '2024-03-10 09:45:00',
    NOW()
),

-- Staking focused user
(
    gen_random_uuid(),
    'staking_master@example.com',
    'staking_master',
    8000.00,
    2000.00,
    10.00,
    2.00,
    0.20,
    15000.00,
    1875.00,
    20000.00,
    25000.00,
    true,
    true,
    2,
    '2024-01-25 16:20:00',
    NOW()
),

-- Small balance user
(
    gen_random_uuid(),
    'small_investor@example.com',
    'small_investor',
    1000.00,
    500.00,
    2.00,
    0.50,
    0.05,
    500.00,
    62.50,
    1500.00,
    1875.00,
    true,
    true,
    1,
    '2024-02-28 11:30:00',
    NOW()
),

-- Unverified user
(
    gen_random_uuid(),
    'unverified_user@example.com',
    'unverified_user',
    2000.00,
    1000.00,
    3.00,
    0.75,
    0.08,
    0.00,
    0.00,
    3000.00,
    3750.00,
    false,
    false,
    0,
    '2024-03-15 13:00:00',
    NOW()
),

-- High staking rewards user
(
    gen_random_uuid(),
    'reward_collector@example.com',
    'reward_collector',
    12000.00,
    6000.00,
    30.00,
    6.00,
    0.60,
    25000.00,
    3125.00,
    40000.00,
    50000.00,
    true,
    true,
    3,
    '2024-01-10 08:00:00',
    NOW()
),

-- Balanced portfolio user
(
    gen_random_uuid(),
    'balanced_portfolio@example.com',
    'balanced_portfolio',
    20000.00,
    12000.00,
    60.00,
    12.00,
    1.20,
    8000.00,
    1000.00,
    50000.00,
    62500.00,
    true,
    true,
    2,
    '2024-02-05 15:45:00',
    NOW()
),

-- New user without bonus
(
    gen_random_uuid(),
    'fresh_start@example.com',
    'fresh_start',
    0.00,
    0.00,
    0.00,
    0.00,
    0.00,
    0.00,
    0.00,
    0.00,
    0.00,
    false,
    false,
    0,
    '2024-03-20 10:00:00',
    NOW()
),

-- VIP user
(
    gen_random_uuid(),
    'vip_trader@example.com',
    'vip_trader',
    100000.00,
    50000.00,
    250.00,
    50.00,
    5.00,
    20000.00,
    2500.00,
    200000.00,
    250000.00,
    true,
    true,
    3,
    '2024-01-01 12:00:00',
    NOW()
);
