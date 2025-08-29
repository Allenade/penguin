-- Add missing deposit addresses for BTC and SOL
INSERT INTO deposit_addresses (crypto_symbol, network, address, instructions, is_active, min_deposit, max_deposit, created_at, updated_at)
VALUES 
  ('BTC', 'mainnet', 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', 'Send BTC to this address. Minimum deposit: 0.001 BTC', true, 0.001, 10, NOW(), NOW()),
  ('SOL', 'mainnet', '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', 'Send SOL to this address. Minimum deposit: 0.01 SOL', true, 0.01, 1000, NOW(), NOW());

