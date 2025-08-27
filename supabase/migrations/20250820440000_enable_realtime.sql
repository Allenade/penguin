-- Enable real-time subscriptions for user_profiles table
-- This allows admin changes to be reflected in real-time on user dashboard

-- Enable real-time for user_profiles table
ALTER PUBLICATION supabase_realtime ADD TABLE user_profiles;

-- Enable real-time for withdrawal_requests table (for admin withdrawal management)
ALTER PUBLICATION supabase_realtime ADD TABLE withdrawal_requests;

-- Enable real-time for deposit_addresses table (for admin wallet management)
ALTER PUBLICATION supabase_realtime ADD TABLE deposit_addresses;

-- Enable real-time for withdrawal_addresses table (for admin wallet management)
ALTER PUBLICATION supabase_realtime ADD TABLE withdrawal_addresses;
