-- Create user_content table for user-specific content
CREATE TABLE IF NOT EXISTS user_content (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    page_name VARCHAR(100) NOT NULL,
    section_name VARCHAR(100) NOT NULL,
    content_type VARCHAR(50) NOT NULL DEFAULT 'text',
    content_value TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, page_name, section_name)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_content_user_page ON user_content(user_id, page_name);
CREATE INDEX IF NOT EXISTS idx_user_content_page_section ON user_content(page_name, section_name);

-- Enable RLS
ALTER TABLE user_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own content" ON user_content
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own content" ON user_content
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own content" ON user_content
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own content" ON user_content
    FOR DELETE USING (auth.uid() = user_id);

-- Admin can view all content
CREATE POLICY "Admins can view all user content" ON user_content
    FOR ALL USING (true);

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE user_content;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_user_content_updated_at
    BEFORE UPDATE ON user_content
    FOR EACH ROW
    EXECUTE FUNCTION update_user_content_updated_at();





