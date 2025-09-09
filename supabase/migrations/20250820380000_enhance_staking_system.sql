-- Enhance staking_settings table with admin controls
ALTER TABLE staking_settings 
ADD COLUMN IF NOT EXISTS lock_period_days INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS reward_frequency VARCHAR(20) DEFAULT 'daily' CHECK (reward_frequency IN ('daily', 'weekly', 'monthly')),
ADD COLUMN IF NOT EXISTS emergency_paused BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Create staking_controls table for system-wide controls
CREATE TABLE IF NOT EXISTS staking_controls (
  id SERIAL PRIMARY KEY,
  control_type VARCHAR(50) NOT NULL UNIQUE,
  is_enabled BOOLEAN DEFAULT TRUE,
  value TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default staking controls
INSERT INTO staking_controls (control_type, is_enabled, value, description) VALUES
  ('global_staking_enabled', TRUE, 'true', 'Enable/disable staking for all users'),
  ('emergency_mode', FALSE, 'false', 'Emergency pause all staking activities'),
  ('auto_rewards', TRUE, 'true', 'Automatic reward distribution'),
  ('maintenance_mode', FALSE, 'false', 'Maintenance mode - pause all operations')
ON CONFLICT (control_type) DO NOTHING;

-- Create staking_events table for tracking staking activities
CREATE TABLE IF NOT EXISTS staking_events (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('stake', 'unstake', 'reward', 'emergency_pause', 'admin_action')),
  crypto_symbol VARCHAR(10) NOT NULL,
  amount DECIMAL(20, 8),
  description TEXT,
  admin_user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE staking_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE staking_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for staking_controls (admin only)
CREATE POLICY "Authenticated users can manage staking controls" ON staking_controls
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for staking_events
CREATE POLICY "Users can view their own staking events" ON staking_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create staking events" ON staking_events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage staking events" ON staking_events
  FOR ALL USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_staking_events_user_id ON staking_events(user_id);
CREATE INDEX IF NOT EXISTS idx_staking_events_event_type ON staking_events(event_type);
CREATE INDEX IF NOT EXISTS idx_staking_events_created_at ON staking_events(created_at);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_staking_controls_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_staking_controls_updated_at 
  BEFORE UPDATE ON staking_controls 
  FOR EACH ROW 
  EXECUTE FUNCTION update_staking_controls_updated_at();








