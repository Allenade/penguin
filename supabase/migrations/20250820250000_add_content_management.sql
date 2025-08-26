-- Content Management System for PENGU
-- This allows admins to edit page content dynamically

-- Create table for page content
CREATE TABLE IF NOT EXISTS page_content (
    id SERIAL PRIMARY KEY,
    page_name TEXT NOT NULL, -- 'huddle', 'dashboard', 'home', etc.
    section_name TEXT NOT NULL, -- 'hero_title', 'welcome_text', 'adventure_button_1', etc.
    content_type TEXT NOT NULL, -- 'text', 'image', 'button', 'link'
    content_value TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(page_name, section_name)
);

-- Create table for content versions/history
CREATE TABLE IF NOT EXISTS content_versions (
    id SERIAL PRIMARY KEY,
    page_content_id INTEGER REFERENCES page_content(id) ON DELETE CASCADE,
    old_value TEXT,
    new_value TEXT,
    changed_by UUID REFERENCES auth.users(id),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_page_content_page_name ON page_content(page_name);
CREATE INDEX IF NOT EXISTS idx_page_content_section ON page_content(section_name);
CREATE INDEX IF NOT EXISTS idx_content_versions_page_content_id ON content_versions(page_content_id);

-- Enable Row Level Security
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_versions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for page_content
CREATE POLICY "Anyone can view page content" ON page_content
    FOR SELECT USING (TRUE);

CREATE POLICY "Only admins can insert page content" ON page_content
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

CREATE POLICY "Only admins can update page content" ON page_content
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

CREATE POLICY "Only admins can delete page content" ON page_content
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

-- RLS Policies for content_versions
CREATE POLICY "Anyone can view content versions" ON content_versions
    FOR SELECT USING (TRUE);

CREATE POLICY "Only admins can insert content versions" ON content_versions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_page_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_page_content_updated_at
    BEFORE UPDATE ON page_content
    FOR EACH ROW EXECUTE FUNCTION update_page_content_updated_at();

-- Function to log content changes
CREATE OR REPLACE FUNCTION log_content_change()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' AND OLD.content_value != NEW.content_value THEN
        INSERT INTO content_versions (page_content_id, old_value, new_value, changed_by)
        VALUES (NEW.id, OLD.content_value, NEW.content_value, auth.uid());
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for logging changes
CREATE TRIGGER log_content_changes
    AFTER UPDATE ON page_content
    FOR EACH ROW EXECUTE FUNCTION log_content_change();

-- Insert initial huddle page content
INSERT INTO page_content (page_name, section_name, content_type, content_value, display_order) VALUES
-- Hero Section
('huddle', 'hero_title', 'text', 'Join the Pudgy Penguins Adventure! 🐧✨', 1),
('huddle', 'hero_subtitle', 'text', 'Welcome to Pudgy Penguins Trading!', 2),
('huddle', 'hero_image', 'image', '/image/pugin.jpeg', 3),

-- How the Magic Works Section
('huddle', 'magic_title', 'text', 'How the Magic Works', 4),
('huddle', 'magic_step_1_title', 'text', 'Create an Account', 5),
('huddle', 'magic_step_1_desc', 'text', 'Sign up to get your personal wallet address linked to Pengu Stocks.', 6),
('huddle', 'magic_step_2_title', 'text', 'Start Your Journey (Minimum $500)', 7),
('huddle', 'magic_step_2_desc', 'text', 'Begin your adventure by depositing at least $500 (in ETH/BTC/USDT/SOL/PENGU). Your funds are used to acquire Pengu Stocks directly.', 8),

-- What Is Section
('huddle', 'what_is_title', 'text', 'What Is Pudgy Penguins?', 9),
('huddle', 'what_is_desc', 'text', 'Pudgy Penguins is a collection of 8,888 unique NFTs that live on the Ethereum blockchain. Each penguin has unique traits and characteristics that make them special.', 10),
('huddle', 'what_is_image', 'image', '/image/4imageslide.jpeg', 11),

-- Adventure Buttons
('huddle', 'adventure_button_1_text', 'text', 'Choose Your Adventure', 12),
('huddle', 'adventure_button_1_link', 'link', '#adventure', 13),
('huddle', 'adventure_button_2_text', 'text', 'Start Your Journey', 14),
('huddle', 'adventure_button_2_link', 'link', '#journey', 15),

-- Investment Section
('huddle', 'investment_title', 'text', 'Choose Your Investment Amount', 16),
('huddle', 'investment_desc', 'text', 'Select how much you want to invest in your penguin adventure:', 17),
('huddle', 'investment_amount_1', 'text', '$500', 18),
('huddle', 'investment_amount_2', 'text', '$1000', 19),
('huddle', 'investment_amount_3', 'text', '$2500', 20),
('huddle', 'investment_amount_4', 'text', '$5000', 21),
('huddle', 'investment_amount_5', 'text', '$10000', 22),

-- Wallet Address
('huddle', 'wallet_address', 'text', '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', 23),

-- Footer
('huddle', 'footer_text', 'text', 'Ready to start your penguin adventure? Click any amount above to begin!', 24)
ON CONFLICT (page_name, section_name) DO NOTHING;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
