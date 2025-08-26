-- Add Withdrawal Addresses and Withdrawal Requests System
-- This migration adds proper withdrawal management with platform-controlled addresses

-- Create withdrawal_addresses table for platform-controlled withdrawal addresses
CREATE TABLE IF NOT EXISTS withdrawal_addresses (
    id SERIAL PRIMARY KEY,
    crypto_symbol TEXT NOT NULL, -- 'PENGU', 'SOL', 'ETH', 'BTC', 'USDT'
    network TEXT NOT NULL, -- 'mainnet', 'testnet', 'polygon', etc.
    address TEXT NOT NULL,
    private_key_encrypted TEXT, -- Encrypted private key for automated withdrawals
    is_active BOOLEAN DEFAULT TRUE,
    is_automated BOOLEAN DEFAULT FALSE, -- Whether withdrawals are automated or manual
    daily_limit DECIMAL(15,8) DEFAULT 999999.99999999,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create withdrawal_requests table for tracking withdrawal requests
CREATE TABLE IF NOT EXISTS withdrawal_requests (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    crypto_symbol TEXT NOT NULL,
    amount DECIMAL(15,8) NOT NULL,
    user_address TEXT NOT NULL, -- User's destination address
    platform_address TEXT NOT NULL, -- Platform's source address
    withdrawal_fee DECIMAL(15,8) DEFAULT 0.00000000,
    net_amount DECIMAL(15,8) NOT NULL, -- amount - withdrawal_fee
    status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed', 'cancelled'
    transaction_hash TEXT, -- Blockchain transaction hash
    admin_notes TEXT,
    processed_by UUID REFERENCES auth.users(id), -- Admin who processed the withdrawal
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_withdrawal_addresses_crypto_symbol ON withdrawal_addresses(crypto_symbol);
CREATE INDEX IF NOT EXISTS idx_withdrawal_addresses_active ON withdrawal_addresses(is_active);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_user_id ON withdrawal_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_status ON withdrawal_requests(status);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_created_at ON withdrawal_requests(created_at);

-- Enable Row Level Security
ALTER TABLE withdrawal_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for withdrawal_addresses
CREATE POLICY "Admins can manage withdrawal addresses" ON withdrawal_addresses
    FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for withdrawal_requests
CREATE POLICY "Users can view their own withdrawal requests" ON withdrawal_requests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create withdrawal requests" ON withdrawal_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all withdrawal requests" ON withdrawal_requests
    FOR ALL USING (auth.role() = 'authenticated');

-- Add updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_withdrawal_addresses_updated_at 
    BEFORE UPDATE ON withdrawal_addresses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_withdrawal_requests_updated_at 
    BEFORE UPDATE ON withdrawal_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default withdrawal addresses (these should be replaced with real addresses)
INSERT INTO withdrawal_addresses (crypto_symbol, network, address, is_automated, daily_limit) VALUES
('PENGU', 'mainnet', '0x1234567890123456789012345678901234567890', FALSE, 100000.00000000),
('SOL', 'mainnet', '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', FALSE, 1000.00000000),
('ETH', 'mainnet', '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', FALSE, 100.00000000),
('BTC', 'mainnet', 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', FALSE, 10.00000000),
('USDT', 'mainnet', '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', FALSE, 100000.00000000)
ON CONFLICT DO NOTHING;

-- Create function to create withdrawal request
CREATE OR REPLACE FUNCTION create_withdrawal_request(
    p_user_id UUID,
    p_crypto_symbol TEXT,
    p_amount DECIMAL,
    p_user_address TEXT
)
RETURNS INTEGER AS $$
DECLARE
    v_withdrawal_address TEXT;
    v_withdrawal_fee DECIMAL;
    v_net_amount DECIMAL;
    v_request_id INTEGER;
BEGIN
    -- Get platform withdrawal address
    SELECT address INTO v_withdrawal_address
    FROM withdrawal_addresses
    WHERE crypto_symbol = p_crypto_symbol AND is_active = TRUE
    LIMIT 1;
    
    IF v_withdrawal_address IS NULL THEN
        RAISE EXCEPTION 'No active withdrawal address found for %', p_crypto_symbol;
    END IF;
    
    -- Get withdrawal fee
    SELECT withdrawal_fee INTO v_withdrawal_fee
    FROM withdrawal_limits
    WHERE crypto_symbol = p_crypto_symbol AND is_active = TRUE;
    
    v_withdrawal_fee := COALESCE(v_withdrawal_fee, 0);
    v_net_amount := p_amount - v_withdrawal_fee;
    
    -- Create withdrawal request
    INSERT INTO withdrawal_requests (
        user_id, crypto_symbol, amount, user_address, platform_address,
        withdrawal_fee, net_amount, status
    ) VALUES (
        p_user_id, p_crypto_symbol, p_amount, p_user_address, v_withdrawal_address,
        v_withdrawal_fee, v_net_amount, 'pending'
    ) RETURNING id INTO v_request_id;
    
    RETURN v_request_id;
END;
$$ LANGUAGE plpgsql;
