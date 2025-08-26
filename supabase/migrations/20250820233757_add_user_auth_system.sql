-- Enable Supabase Auth
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create auth_profiles table to extend Supabase auth.users
CREATE TABLE auth_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE,
    full_name VARCHAR(255),
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_level INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO auth_profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_auth_profiles_updated_at
    BEFORE UPDATE ON auth_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on auth_profiles
ALTER TABLE auth_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for auth_profiles
CREATE POLICY "Users can view own profile" ON auth_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON auth_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Create indexes for better performance
CREATE INDEX idx_auth_profiles_email ON auth_profiles(email);
CREATE INDEX idx_auth_profiles_username ON auth_profiles(username);

-- Note: Test users can be created manually in Supabase Auth dashboard if needed
