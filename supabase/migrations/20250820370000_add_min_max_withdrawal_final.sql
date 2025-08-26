-- Add min_withdrawal and max_withdrawal columns to withdrawal_addresses table
ALTER TABLE withdrawal_addresses 
ADD COLUMN IF NOT EXISTS min_withdrawal DECIMAL(20, 8) DEFAULT 0,
ADD COLUMN IF NOT EXISTS max_withdrawal DECIMAL(20, 8) DEFAULT 999999;

-- Update existing records with default values
UPDATE withdrawal_addresses 
SET 
  min_withdrawal = 0,
  max_withdrawal = 999999
WHERE min_withdrawal IS NULL OR max_withdrawal IS NULL;

-- Verify the columns were added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'withdrawal_addresses' 
AND column_name IN ('min_withdrawal', 'max_withdrawal');

