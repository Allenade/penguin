-- Fix withdrawal addresses - ensure they exist and are accessible
-- This migration ensures withdrawal addresses are properly set up

-- First, let's check if withdrawal addresses exist and insert them if they don't
-- Remove any existing addresses first to avoid duplicates
DELETE FROM withdrawal_addresses WHERE crypto_symbol IN ('PENGU', 'SOL', 'ETH', 'BTC', 'USDT');

-- Insert withdrawal addresses
INSERT INTO withdrawal_addresses (crypto_symbol, network, address, is_automated, daily_limit, is_active) VALUES
('PENGU', 'mainnet', '0x1234567890123456789012345678901234567890', FALSE, 100000.00000000, TRUE),
('SOL', 'mainnet', '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', FALSE, 1000.00000000, TRUE),
('ETH', 'mainnet', '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', FALSE, 100.00000000, TRUE),
('BTC', 'mainnet', 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', FALSE, 10.00000000, TRUE),
('USDT', 'mainnet', '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', FALSE, 100000.00000000, TRUE);

-- Update RLS policies to ensure withdrawal addresses are readable by all authenticated users
DROP POLICY IF EXISTS "Admins can manage withdrawal addresses" ON withdrawal_addresses;

CREATE POLICY "Anyone can view withdrawal addresses" ON withdrawal_addresses
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage withdrawal addresses" ON withdrawal_addresses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

-- Ensure withdrawal limits exist
-- Remove any existing limits first to avoid duplicates
DELETE FROM withdrawal_limits WHERE crypto_symbol IN ('PENGU', 'SOL', 'ETH', 'BTC', 'USDT');

INSERT INTO withdrawal_limits (crypto_symbol, min_withdrawal, max_withdrawal, daily_limit, monthly_limit, withdrawal_fee, is_active) VALUES
('PENGU', 10000.00000000, 1000000.00000000, 50000.00000000, 500000.00000000, 0.00000000, TRUE),
('SOL', 1.00000000, 1000.00000000, 100.00000000, 1000.00000000, 0.00000000, TRUE),
('ETH', 0.1, 100.00000000, 10.00000000, 100.00000000, 0.00000000, TRUE),
('BTC', 0.003, 10.00000000, 1.00000000, 10.00000000, 0.00000000, TRUE),
('USDT', 10.00000000, 100000.00000000, 1000.00000000, 10000.00000000, 0.00000000, TRUE);
