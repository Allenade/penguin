-- Update withdrawal addresses with proper wallet addresses
UPDATE withdrawal_addresses 
SET 
  address = '0x1234567890123456789012345678901234567890',
  is_active = true,
  is_automated = false,
  daily_limit = 100000.0
WHERE crypto_symbol = 'PENGU';

UPDATE withdrawal_addresses 
SET 
  address = '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
  is_active = true,
  is_automated = false,
  daily_limit = 1000.0
WHERE crypto_symbol = 'SOL';

UPDATE withdrawal_addresses 
SET 
  address = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  is_active = true,
  is_automated = false,
  daily_limit = 100.0
WHERE crypto_symbol = 'ETH';

UPDATE withdrawal_addresses 
SET 
  address = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  is_active = true,
  is_automated = false,
  daily_limit = 10.0
WHERE crypto_symbol = 'BTC';

UPDATE withdrawal_addresses 
SET 
  address = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  is_active = true,
  is_automated = false,
  daily_limit = 100000.0
WHERE crypto_symbol = 'USDT';
