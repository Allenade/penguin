-- Add icon_url column to deposit_addresses table
ALTER TABLE deposit_addresses 
ADD COLUMN IF NOT EXISTS icon_url TEXT;

-- Add icon_url column to withdrawal_addresses table
ALTER TABLE withdrawal_addresses 
ADD COLUMN IF NOT EXISTS icon_url TEXT;

-- Add some default icon URLs for existing crypto addresses
UPDATE deposit_addresses 
SET icon_url = 'https://cryptologos.cc/logos/pengu-pengu-logo.png'
WHERE crypto_symbol = 'PENGU' AND icon_url IS NULL;

UPDATE deposit_addresses 
SET icon_url = 'https://cryptologos.cc/logos/solana-sol-logo.png'
WHERE crypto_symbol = 'SOL' AND icon_url IS NULL;

UPDATE deposit_addresses 
SET icon_url = 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
WHERE crypto_symbol = 'ETH' AND icon_url IS NULL;

UPDATE deposit_addresses 
SET icon_url = 'https://cryptologos.cc/logos/bitcoin-btc-logo.png'
WHERE crypto_symbol = 'BTC' AND icon_url IS NULL;

UPDATE deposit_addresses 
SET icon_url = 'https://cryptologos.cc/logos/tether-usdt-logo.png'
WHERE crypto_symbol = 'USDT' AND icon_url IS NULL;

-- Update withdrawal addresses with same icons
UPDATE withdrawal_addresses 
SET icon_url = 'https://cryptologos.cc/logos/pengu-pengu-logo.png'
WHERE crypto_symbol = 'PENGU' AND icon_url IS NULL;

UPDATE withdrawal_addresses 
SET icon_url = 'https://cryptologos.cc/logos/solana-sol-logo.png'
WHERE crypto_symbol = 'SOL' AND icon_url IS NULL;

UPDATE withdrawal_addresses 
SET icon_url = 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
WHERE crypto_symbol = 'ETH' AND icon_url IS NULL;

UPDATE withdrawal_addresses 
SET icon_url = 'https://cryptologos.cc/logos/bitcoin-btc-logo.png'
WHERE crypto_symbol = 'BTC' AND icon_url IS NULL;

UPDATE withdrawal_addresses 
SET icon_url = 'https://cryptologos.cc/logos/tether-usdt-logo.png'
WHERE crypto_symbol = 'USDT' AND icon_url IS NULL;
