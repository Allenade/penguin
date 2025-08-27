-- Fix numeric precision for user_profiles table
-- Increase precision to handle larger values

ALTER TABLE user_profiles 
ALTER COLUMN pengu_tokens TYPE DECIMAL(20,8),
ALTER COLUMN usdt_balance TYPE DECIMAL(20,8),
ALTER COLUMN sol_balance TYPE DECIMAL(20,8),
ALTER COLUMN eth_balance TYPE DECIMAL(20,8),
ALTER COLUMN btc_balance TYPE DECIMAL(20,8),
ALTER COLUMN staked_pengu TYPE DECIMAL(20,8),
ALTER COLUMN staking_rewards TYPE DECIMAL(20,8),
ALTER COLUMN total_investment TYPE DECIMAL(20,8),
ALTER COLUMN total_balance TYPE DECIMAL(20,8);

-- Update existing records to ensure they fit within new constraints
UPDATE user_profiles SET
  pengu_tokens = LEAST(pengu_tokens, 999999999999.99999999),
  usdt_balance = LEAST(usdt_balance, 999999999999.99999999),
  sol_balance = LEAST(sol_balance, 999999999999.99999999),
  eth_balance = LEAST(eth_balance, 999999999999.99999999),
  btc_balance = LEAST(btc_balance, 999999999999.99999999),
  staked_pengu = LEAST(staked_pengu, 999999999999.99999999),
  staking_rewards = LEAST(staking_rewards, 999999999999.99999999),
  total_investment = LEAST(total_investment, 999999999999.99999999),
  total_balance = LEAST(total_balance, 999999999999.99999999);
