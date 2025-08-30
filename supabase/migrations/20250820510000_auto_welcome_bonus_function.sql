-- Auto Welcome Bonus Function
-- This migration adds a function to automatically give welcome bonus to new users

-- Create function to automatically check and give welcome bonus
CREATE OR REPLACE FUNCTION check_and_give_welcome_bonus(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    bonus_amount DECIMAL(15,8);
    bonus_enabled BOOLEAN;
    already_claimed BOOLEAN;
    user_exists BOOLEAN;
BEGIN
    -- Check if user exists
    SELECT EXISTS(SELECT 1 FROM user_profiles WHERE user_id = user_uuid) INTO user_exists;
    
    IF NOT user_exists THEN
        RETURN FALSE;
    END IF;
    
    -- Check if welcome bonus is enabled
    SELECT setting_value::BOOLEAN INTO bonus_enabled 
    FROM crypto_settings 
    WHERE setting_key = 'welcome_bonus_enabled';
    
    IF NOT bonus_enabled THEN
        RETURN FALSE;
    END IF;
    
    -- Get bonus amount
    SELECT setting_value::DECIMAL INTO bonus_amount 
    FROM crypto_settings 
    WHERE setting_key = 'welcome_bonus_amount';
    
    -- Check if already claimed
    SELECT welcome_bonus_claimed INTO already_claimed 
    FROM user_profiles 
    WHERE user_id = user_uuid;
    
    IF already_claimed THEN
        RETURN FALSE;
    END IF;
    
    -- Update user balance and mark as claimed
    UPDATE user_profiles 
    SET 
        pengu_tokens = pengu_tokens + bonus_amount,
        welcome_bonus_claimed = TRUE,
        updated_at = NOW()
    WHERE user_id = user_uuid;
    
    -- Log the transaction
    INSERT INTO user_transactions (
        user_id, 
        transaction_type, 
        amount, 
        currency, 
        status, 
        description
    ) VALUES (
        user_uuid,
        'welcome_bonus',
        bonus_amount,
        'PENGU',
        'completed',
        'Welcome bonus automatically claimed'
    );
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION check_and_give_welcome_bonus(UUID) TO authenticated;
