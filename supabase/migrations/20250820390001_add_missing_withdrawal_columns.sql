-- Add missing withdrawal columns to withdrawal_addresses table
-- This migration adds the min_withdrawal and max_withdrawal columns that are needed by the admin panel

ALTER TABLE withdrawal_addresses 
ADD COLUMN IF NOT EXISTS min_withdrawal DECIMAL(15,8) DEFAULT 0.00000000,
ADD COLUMN IF NOT EXISTS max_withdrawal DECIMAL(15,8) DEFAULT 999999.99999999;

-- Update existing records with default values
UPDATE withdrawal_addresses 
SET 
    min_withdrawal = 0.00000000,
    max_withdrawal = 999999.99999999
WHERE min_withdrawal IS NULL OR max_withdrawal IS NULL;

-- Add comments to document the columns
COMMENT ON COLUMN withdrawal_addresses.min_withdrawal IS 'Minimum withdrawal amount for this cryptocurrency';
COMMENT ON COLUMN withdrawal_addresses.max_withdrawal IS 'Maximum withdrawal amount for this cryptocurrency';
