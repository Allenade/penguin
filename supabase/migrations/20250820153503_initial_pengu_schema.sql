-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE,
    full_name VARCHAR(255),
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_level INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wallets table
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    wallet_type VARCHAR(50) NOT NULL, -- 'metamask', 'phantom', 'solflare', etc.
    wallet_address VARCHAR(255) NOT NULL,
    wallet_name VARCHAR(100),
    is_connected BOOLEAN DEFAULT FALSE,
    last_connected_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, wallet_address)
);

-- Create tokens table
CREATE TABLE tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    symbol VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    contract_address VARCHAR(255),
    network VARCHAR(50) NOT NULL, -- 'ethereum', 'solana', 'polygon', etc.
    decimals INTEGER DEFAULT 18,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create balances table
CREATE TABLE balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_id UUID REFERENCES tokens(id) ON DELETE CASCADE,
    wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
    balance DECIMAL(30, 18) DEFAULT 0,
    locked_balance DECIMAL(30, 18) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, token_id, wallet_id)
);

-- Create transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
    token_id UUID REFERENCES tokens(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL, -- 'deposit', 'withdrawal', 'stake', 'unstake', 'claim'
    amount DECIMAL(30, 18) NOT NULL,
    fee DECIMAL(30, 18) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'cancelled'
    tx_hash VARCHAR(255),
    block_number BIGINT,
    network VARCHAR(50),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create staking table
CREATE TABLE staking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_id UUID REFERENCES tokens(id) ON DELETE CASCADE,
    wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
    amount DECIMAL(30, 18) NOT NULL,
    apy DECIMAL(10, 4) NOT NULL,
    lock_period_days INTEGER DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'completed', 'cancelled'
    rewards_earned DECIMAL(30, 18) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create airdrops table
CREATE TABLE airdrops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    token_id UUID REFERENCES tokens(id) ON DELETE CASCADE,
    amount_per_user DECIMAL(30, 18) NOT NULL,
    total_amount DECIMAL(30, 18) NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    eligibility_criteria JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_airdrops table (many-to-many relationship)
CREATE TABLE user_airdrops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    airdrop_id UUID REFERENCES airdrops(id) ON DELETE CASCADE,
    amount_claimed DECIMAL(30, 18) NOT NULL,
    claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    tx_hash VARCHAR(255),
    status VARCHAR(50) DEFAULT 'claimed', -- 'claimed', 'pending', 'failed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, airdrop_id)
);

-- Create support_tickets table
CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'technical', 'account', 'billing', 'general', 'bug'
    priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    status VARCHAR(50) DEFAULT 'open', -- 'open', 'in_progress', 'resolved', 'closed'
    assigned_to UUID REFERENCES users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create verification_requests table
CREATE TABLE verification_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    verification_type VARCHAR(50) NOT NULL, -- 'identity', 'wallet', 'kyc'
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    documents JSONB,
    rejection_reason TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create beta_access table
CREATE TABLE beta_access (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    feature_name VARCHAR(100) NOT NULL,
    access_level VARCHAR(50) DEFAULT 'basic', -- 'basic', 'premium', 'vip'
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default tokens
INSERT INTO tokens (symbol, name, network, decimals, logo_url) VALUES
('PENGU', 'PENGU Token', 'ethereum', 18, '/image/pugin.jpeg'),
('USDT', 'Tether USD', 'ethereum', 6, '/image/usdt.png'),
('ETH', 'Ethereum', 'ethereum', 18, '/image/eth.png'),
('BTC', 'Bitcoin', 'bitcoin', 8, '/image/btc.png'),
('SOL', 'Solana', 'solana', 9, '/image/sol.png');

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_wallets_user_id ON wallets(user_id);
CREATE INDEX idx_wallets_address ON wallets(wallet_address);
CREATE INDEX idx_balances_user_id ON balances(user_id);
CREATE INDEX idx_balances_token_id ON balances(token_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_staking_user_id ON staking(user_id);
CREATE INDEX idx_staking_status ON staking(status);
CREATE INDEX idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_verification_requests_user_id ON verification_requests(user_id);
CREATE INDEX idx_beta_access_user_id ON beta_access(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE staking ENABLE ROW LEVEL SECURITY;
ALTER TABLE airdrops ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_airdrops ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE beta_access ENABLE ROW LEVEL SECURITY;



-- Create RLS policies
-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Wallets policies
CREATE POLICY "Users can view own wallets" ON wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own wallets" ON wallets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own wallets" ON wallets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own wallets" ON wallets FOR DELETE USING (auth.uid() = user_id);

-- Balances policies
CREATE POLICY "Users can view own balances" ON balances FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own balances" ON balances FOR UPDATE USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Staking policies
CREATE POLICY "Users can view own staking" ON staking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own staking" ON staking FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own staking" ON staking FOR UPDATE USING (auth.uid() = user_id);

-- Airdrops policies (users can view all active airdrops)
CREATE POLICY "Users can view active airdrops" ON airdrops FOR SELECT USING (is_active = true);

-- User airdrops policies
CREATE POLICY "Users can view own airdrop claims" ON user_airdrops FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own airdrop claims" ON user_airdrops FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Support tickets policies
CREATE POLICY "Users can view own support tickets" ON support_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own support tickets" ON support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own support tickets" ON support_tickets FOR UPDATE USING (auth.uid() = user_id);

-- Verification requests policies
CREATE POLICY "Users can view own verification requests" ON verification_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own verification requests" ON verification_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Beta access policies
CREATE POLICY "Users can view own beta access" ON beta_access FOR SELECT USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_balances_updated_at BEFORE UPDATE ON balances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_staking_updated_at BEFORE UPDATE ON staking FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_verification_requests_updated_at BEFORE UPDATE ON verification_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
