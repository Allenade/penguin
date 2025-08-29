-- Create crypto_prices table for admin-managed cryptocurrency prices
CREATE TABLE IF NOT EXISTS crypto_prices (
    id SERIAL PRIMARY KEY,
    btc_price DECIMAL(20,8) DEFAULT 45000.00000000,
    eth_price DECIMAL(20,8) DEFAULT 3000.00000000,
    sol_price DECIMAL(20,8) DEFAULT 100.00000000,
    pengu_price DECIMAL(20,8) DEFAULT 0.50000000,
    usdt_price DECIMAL(20,8) DEFAULT 1.00000000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default prices
INSERT INTO crypto_prices (id, btc_price, eth_price, sol_price, pengu_price, usdt_price) 
VALUES (1, 45000.00000000, 3000.00000000, 100.00000000, 0.50000000, 1.00000000)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE crypto_prices ENABLE ROW LEVEL SECURITY;

-- Create policy to allow admin access
CREATE POLICY "Allow admin access to crypto_prices" ON crypto_prices
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.user_id = auth.uid()
        )
    );

-- Create policy to allow public read access (for user dashboard)
CREATE POLICY "Allow public read access to crypto_prices" ON crypto_prices
    FOR SELECT USING (true);

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE crypto_prices;

