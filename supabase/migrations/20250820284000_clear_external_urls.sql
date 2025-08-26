-- Clear external URLs that are causing 403 errors
-- Replace them with null so the system falls back to emoji icons

UPDATE deposit_addresses 
SET icon_url = NULL 
WHERE icon_url LIKE 'https://%' OR icon_url LIKE 'http://%';

UPDATE withdrawal_addresses 
SET icon_url = NULL 
WHERE icon_url LIKE 'https://%' OR icon_url LIKE 'http://%';

-- Verify the changes
SELECT crypto_symbol, icon_url FROM deposit_addresses;
SELECT crypto_symbol, icon_url FROM withdrawal_addresses;
