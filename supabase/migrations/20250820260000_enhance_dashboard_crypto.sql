-- Enhance Dashboard with Comprehensive Cryptocurrency Functionality
-- This migration adds support for multiple cryptocurrencies, staking, and admin management

-- Add new columns to user_profiles for multi-crypto support
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS sol_balance DECIMAL(15,8) DEFAULT 0.00000000,
ADD COLUMN IF NOT EXISTS eth_balance DECIMAL(15,8) DEFAULT 0.00000000,
ADD COLUMN IF NOT EXISTS btc_balance DECIMAL(15,8) DEFAULT 0.00000000,
ADD COLUMN IF NOT EXISTS usdt_balance DECIMAL(15,8) DEFAULT 0.00000000,
ADD COLUMN IF NOT EXISTS staked_pengu DECIMAL(15,8) DEFAULT 0.00000000,
ADD COLUMN IF NOT EXISTS staking_rewards DECIMAL(15,8) DEFAULT 0.00000000,
ADD COLUMN IF NOT EXISTS last_stake_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS welcome_bonus_claimed BOOLEAN DEFAULT FALSE;

-- Create crypto_settings table for admin-configurable settings
CREATE TABLE IF NOT EXISTS crypto_settings (
    id SERIAL PRIMARY KEY,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    setting_type TEXT DEFAULT 'text', -- 'text', 'number', 'boolean', 'json'
    description TEXT,
    is_editable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create deposit_addresses table for admin-managed addresses
CREATE TABLE IF NOT EXISTS deposit_addresses (
    id SERIAL PRIMARY KEY,
    crypto_symbol TEXT NOT NULL, -- 'PENGU', 'SOL', 'ETH', 'BTC', 'USDT'
    network TEXT NOT NULL, -- 'mainnet', 'testnet', 'polygon', etc.
    address TEXT NOT NULL,
    qr_code_url TEXT,
    instructions TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    min_deposit DECIMAL(15,8) DEFAULT 0.00000000,
    max_deposit DECIMAL(15,8) DEFAULT 999999.99999999,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create staking_settings table for admin-configurable staking
CREATE TABLE IF NOT EXISTS staking_settings (
    id SERIAL PRIMARY KEY,
    crypto_symbol TEXT UNIQUE NOT NULL, -- 'PENGU'
    apy_percentage DECIMAL(5,2) NOT NULL, -- Annual Percentage Yield
    min_stake_amount DECIMAL(15,8) NOT NULL,
    max_stake_amount DECIMAL(15,8) NOT NULL,
    lock_period_days INTEGER DEFAULT 0, -- 0 = no lock period
    early_unstake_penalty DECIMAL(5,2) DEFAULT 0.00, -- Penalty percentage
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create withdrawal_limits table for admin-configurable limits
CREATE TABLE IF NOT EXISTS withdrawal_limits (
    id SERIAL PRIMARY KEY,
    crypto_symbol TEXT UNIQUE NOT NULL,
    min_withdrawal DECIMAL(15,8) NOT NULL,
    max_withdrawal DECIMAL(15,8) NOT NULL,
    daily_limit DECIMAL(15,8) NOT NULL,
    monthly_limit DECIMAL(15,8) NOT NULL,
    withdrawal_fee DECIMAL(15,8) DEFAULT 0.00000000,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create crypto_assets table for admin-managed asset information
CREATE TABLE IF NOT EXISTS crypto_assets (
    id SERIAL PRIMARY KEY,
    symbol TEXT UNIQUE NOT NULL, -- 'PENGU', 'SOL', 'ETH', 'BTC', 'USDT'
    name TEXT NOT NULL, -- 'Pengu Token', 'Solana', 'Ethereum', 'Bitcoin', 'Tether'
    logo_url TEXT,
    color_hex TEXT DEFAULT '#000000',
    decimals INTEGER DEFAULT 8,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_staking table for tracking staking activities
CREATE TABLE IF NOT EXISTS user_staking (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    crypto_symbol TEXT NOT NULL,
    staked_amount DECIMAL(15,8) NOT NULL,
    rewards_earned DECIMAL(15,8) DEFAULT 0.00000000,
    apy_at_stake DECIMAL(5,2) NOT NULL,
    staked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unstaked_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'active', -- 'active', 'unstaked', 'pending'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_balance_adjustments table for tracking admin balance changes
CREATE TABLE IF NOT EXISTS admin_balance_adjustments (
    id SERIAL PRIMARY KEY,
    admin_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    target_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    crypto_symbol TEXT NOT NULL,
    adjustment_type TEXT NOT NULL, -- 'add', 'subtract', 'set'
    amount DECIMAL(15,8) NOT NULL,
    previous_balance DECIMAL(15,8) NOT NULL,
    new_balance DECIMAL(15,8) NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default crypto settings
INSERT INTO crypto_settings (setting_key, setting_value, setting_type, description) VALUES
('welcome_bonus_amount', '5000', 'number', 'Welcome bonus amount in PENGU tokens'),
('welcome_bonus_enabled', 'true', 'boolean', 'Whether welcome bonus is enabled'),
('staking_enabled', 'true', 'boolean', 'Whether staking is enabled'),
('deposit_enabled', 'true', 'boolean', 'Whether deposits are enabled'),
('withdrawal_enabled', 'true', 'boolean', 'Whether withdrawals are enabled'),
('nft_collection_enabled', 'true', 'boolean', 'Whether NFT collection is enabled');

-- Insert default deposit addresses (replace with actual addresses)
INSERT INTO deposit_addresses (crypto_symbol, network, address, instructions, min_deposit, max_deposit, is_active) VALUES
('PENGU', 'mainnet', '0x1234567890123456789012345678901234567890', 'Send PENGU tokens to this address. Minimum deposit: 1 PENGU', 1.0, 1000000.0, true),
('SOL', 'mainnet', '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', 'Send SOL to this address. Minimum deposit: 0.01 SOL', 0.01, 1000.0, true),
('ETH', 'mainnet', '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', 'Send ETH to this address. Minimum deposit: 0.001 ETH', 0.001, 100.0, true),
('BTC', 'mainnet', 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', 'Send BTC to this address. Minimum deposit: 0.0001 BTC', 0.0001, 10.0, true),
('USDT', 'mainnet', '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', 'Send USDT to this address. Minimum deposit: 1 USDT', 1.0, 100000.0, true);

-- Insert default staking settings
INSERT INTO staking_settings (crypto_symbol, apy_percentage, min_stake_amount, max_stake_amount, lock_period_days) VALUES
('PENGU', 12.50, 100.00000000, 1000000.00000000, 30);

-- Insert default withdrawal limits
INSERT INTO withdrawal_limits (crypto_symbol, min_withdrawal, max_withdrawal, daily_limit, monthly_limit) VALUES
('PENGU', 10000.00000000, 1000000.00000000, 50000.00000000, 500000.00000000),
('SOL', 1.00000000, 1000.00000000, 100.00000000, 1000.00000000),
('ETH', 0.1, 100.00000000, 10.00000000, 100.00000000),
('BTC', 0.003, 10.00000000, 1.00000000, 10.00000000),
('USDT', 10.00000000, 100000.00000000, 1000.00000000, 10000.00000000);

-- Insert default crypto assets
INSERT INTO crypto_assets (symbol, name, logo_url, color_hex, decimals, display_order) VALUES
('PENGU', 'Pengu Token', '/images/crypto/pengu.png', '#FF6B35', 8, 1),
('SOL', 'Solana', '/images/crypto/sol.png', '#9945FF', 9, 2),
('ETH', 'Ethereum', '/images/crypto/eth.png', '#627EEA', 18, 3),
('BTC', 'Bitcoin', '/images/crypto/btc.png', '#F7931A', 8, 4),
('USDT', 'Tether', '/images/crypto/usdt.png', '#26A17B', 6, 5);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_deposit_addresses_symbol ON deposit_addresses(crypto_symbol);
CREATE INDEX IF NOT EXISTS idx_user_staking_user_id ON user_staking(user_id);
CREATE INDEX IF NOT EXISTS idx_user_staking_symbol ON user_staking(crypto_symbol);
CREATE INDEX IF NOT EXISTS idx_admin_balance_adjustments_target_user ON admin_balance_adjustments(target_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_balance_adjustments_admin_user ON admin_balance_adjustments(admin_user_id);

-- Enable Row Level Security
ALTER TABLE crypto_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposit_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE staking_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawal_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE crypto_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_staking ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_balance_adjustments ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for crypto_settings (admin only)
CREATE POLICY "Admins can manage crypto settings" ON crypto_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

-- Create RLS Policies for deposit_addresses (readable by all, editable by admin)
CREATE POLICY "Anyone can view deposit addresses" ON deposit_addresses
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage deposit addresses" ON deposit_addresses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

-- Create RLS Policies for staking_settings (readable by all, editable by admin)
CREATE POLICY "Anyone can view staking settings" ON staking_settings
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage staking settings" ON staking_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

-- Create RLS Policies for withdrawal_limits (readable by all, editable by admin)
CREATE POLICY "Anyone can view withdrawal limits" ON withdrawal_limits
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage withdrawal limits" ON withdrawal_limits
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

-- Create RLS Policies for crypto_assets (readable by all, editable by admin)
CREATE POLICY "Anyone can view crypto assets" ON crypto_assets
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage crypto assets" ON crypto_assets
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

-- Create RLS Policies for user_staking
CREATE POLICY "Users can view own staking" ON user_staking
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own staking" ON user_staking
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all staking" ON user_staking
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

-- Create RLS Policies for admin_balance_adjustments (admin only)
CREATE POLICY "Admins can view balance adjustments" ON admin_balance_adjustments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

CREATE POLICY "Admins can create balance adjustments" ON admin_balance_adjustments
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

-- Create triggers for updated_at
CREATE TRIGGER update_crypto_settings_updated_at
    BEFORE UPDATE ON crypto_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deposit_addresses_updated_at
    BEFORE UPDATE ON deposit_addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staking_settings_updated_at
    BEFORE UPDATE ON staking_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_withdrawal_limits_updated_at
    BEFORE UPDATE ON withdrawal_limits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crypto_assets_updated_at
    BEFORE UPDATE ON crypto_assets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_staking_updated_at
    BEFORE UPDATE ON user_staking
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to claim welcome bonus
CREATE OR REPLACE FUNCTION claim_welcome_bonus(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    bonus_amount DECIMAL(15,8);
    bonus_enabled BOOLEAN;
    already_claimed BOOLEAN;
BEGIN
    -- Check if welcome bonus is enabled
    SELECT setting_value::BOOLEAN INTO bonus_enabled 
    FROM crypto_settings 
    WHERE setting_key = 'welcome_bonus_enabled';
    
    IF NOT bonus_enabled THEN
        RETURN FALSE;
    END IF;
    
    -- Get bonus amount
    SELECT setting_value::DECIMAL INTO bonus_amount 
    FROM crypto_settings 
    WHERE setting_key = 'welcome_bonus_amount';
    
    -- Check if already claimed
    SELECT welcome_bonus_claimed INTO already_claimed 
    FROM user_profiles 
    WHERE user_id = user_uuid;
    
    IF already_claimed THEN
        RETURN FALSE;
    END IF;
    
    -- Update user balance and mark as claimed
    UPDATE user_profiles 
    SET 
        pengu_tokens = pengu_tokens + bonus_amount,
        welcome_bonus_claimed = TRUE,
        updated_at = NOW()
    WHERE user_id = user_uuid;
    
    -- Log the transaction
    INSERT INTO user_transactions (
        user_id, 
        transaction_type, 
        amount, 
        currency, 
        status, 
        description
    ) VALUES (
        user_uuid,
        'welcome_bonus',
        bonus_amount,
        'PENGU',
        'completed',
        'Welcome bonus claimed'
    );
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to calculate staking rewards
CREATE OR REPLACE FUNCTION calculate_staking_rewards(user_uuid UUID)
RETURNS DECIMAL(15,8) AS $$
DECLARE
    total_rewards DECIMAL(15,8) := 0;
    staking_record RECORD;
BEGIN
    FOR staking_record IN 
        SELECT * FROM user_staking 
        WHERE user_id = user_uuid AND status = 'active'
    LOOP
        -- Calculate rewards based on time staked and APY
        total_rewards := total_rewards + (
            staking_record.staked_amount * 
            (staking_record.apy_at_stake / 100) * 
            EXTRACT(EPOCH FROM (NOW() - staking_record.staked_at)) / (365 * 24 * 3600)
        );
    END LOOP;
    
    RETURN total_rewards;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
