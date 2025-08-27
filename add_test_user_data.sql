-- Add test data to user_profiles table
-- This will populate the balance columns with realistic data for testing

-- First, let's see what users exist
SELECT id, user_id, email, wallet_username FROM user_profiles;

-- Update existing users with realistic test data
UPDATE user_profiles 
SET 
    pengu_tokens = CASE 
        WHEN id = 1 THEN 1500.50
        WHEN id = 2 THEN 2300.75
        WHEN id = 3 THEN 890.25
        WHEN id = 4 THEN 3200.00
        WHEN id = 5 THEN 750.80
        WHEN id = 6 THEN 1800.30
        ELSE 1000.00
    END,
    usdt_balance = CASE 
        WHEN id = 1 THEN 2500.00
        WHEN id = 2 THEN 1800.50
        WHEN id = 3 THEN 3200.75
        WHEN id = 4 THEN 950.25
        WHEN id = 5 THEN 4100.00
        WHEN id = 6 THEN 1200.80
        ELSE 2000.00
    END,
    sol_balance = CASE 
        WHEN id = 1 THEN 15.5
        WHEN id = 2 THEN 8.75
        WHEN id = 3 THEN 22.25
        WHEN id = 4 THEN 5.00
        WHEN id = 5 THEN 35.80
        WHEN id = 6 THEN 12.30
        ELSE 10.00
    END,
    eth_balance = CASE 
        WHEN id = 1 THEN 2.5
        WHEN id = 2 THEN 1.8
        WHEN id = 3 THEN 3.2
        WHEN id = 4 THEN 0.95
        WHEN id = 5 THEN 4.1
        WHEN id = 6 THEN 1.2
        ELSE 2.0
    END,
    btc_balance = CASE 
        WHEN id = 1 THEN 0.05
        WHEN id = 2 THEN 0.03
        WHEN id = 3 THEN 0.08
        WHEN id = 4 THEN 0.02
        WHEN id = 5 THEN 0.12
        WHEN id = 6 THEN 0.04
        ELSE 0.06
    END,
    staked_pengu = CASE 
        WHEN id = 1 THEN 500.00
        WHEN id = 2 THEN 800.50
        WHEN id = 3 THEN 300.25
        WHEN id = 4 THEN 1200.00
        WHEN id = 5 THEN 250.80
        WHEN id = 6 THEN 600.30
        ELSE 400.00
    END,
    staking_rewards = CASE 
        WHEN id = 1 THEN 75.50
        WHEN id = 2 THEN 120.75
        WHEN id = 3 THEN 45.25
        WHEN id = 4 THEN 180.00
        WHEN id = 5 THEN 37.80
        WHEN id = 6 THEN 90.30
        ELSE 60.00
    END,
    total_investment = CASE 
        WHEN id = 1 THEN 5000.00
        WHEN id = 2 THEN 3500.50
        WHEN id = 3 THEN 6500.75
        WHEN id = 4 THEN 2000.25
        WHEN id = 5 THEN 8000.00
        WHEN id = 6 THEN 2500.80
        ELSE 4000.00
    END,
    total_balance = CASE 
        WHEN id = 1 THEN 7500.00
        WHEN id = 2 THEN 5300.50
        WHEN id = 3 THEN 9700.75
        WHEN id = 4 THEN 2950.25
        WHEN id = 5 THEN 12100.00
        WHEN id = 6 THEN 3700.80
        ELSE 6000.00
    END,
    is_verified = CASE 
        WHEN id IN (1, 3, 5) THEN TRUE
        ELSE FALSE
    END,
    welcome_bonus_claimed = CASE 
        WHEN id IN (1, 2, 4, 6) THEN TRUE
        ELSE FALSE
    END;

-- Verify the updates
SELECT 
    id, 
    email, 
    pengu_tokens, 
    usdt_balance, 
    total_balance, 
    is_verified, 
    welcome_bonus_claimed 
FROM user_profiles 
ORDER BY id;
