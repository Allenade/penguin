-- Add Welcome Bonus Settings
-- This migration adds the necessary settings for the welcome bonus system

-- Insert welcome bonus settings into crypto_settings table
INSERT INTO crypto_settings (setting_key, setting_value, setting_type, description, is_editable) 
VALUES 
    ('welcome_bonus_enabled', 'true', 'boolean', 'Enable/disable welcome bonus for new users', true),
    ('welcome_bonus_amount', '10000', 'number', 'Amount of PENGU tokens to give as welcome bonus', true)
ON CONFLICT (setting_key) DO UPDATE SET
    setting_value = EXCLUDED.setting_value,
    description = EXCLUDED.description,
    updated_at = NOW();

-- Verify the settings were added
SELECT 
    setting_key, 
    setting_value, 
    description 
FROM crypto_settings 
WHERE setting_key LIKE 'welcome_bonus%';
