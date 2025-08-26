-- Update icon_url column to handle larger base64 strings
ALTER TABLE deposit_addresses 
ALTER COLUMN icon_url TYPE TEXT;

ALTER TABLE withdrawal_addresses 
ALTER COLUMN icon_url TYPE TEXT;

-- Add a comment to explain the column usage
COMMENT ON COLUMN deposit_addresses.icon_url IS 'Base64 encoded image data or URL for crypto icon';
COMMENT ON COLUMN withdrawal_addresses.icon_url IS 'Base64 encoded image data or URL for crypto icon';
