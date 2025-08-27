-- Add current user as admin to access all users
-- Replace 'your-user-id-here' with your actual user ID from auth.users table

-- First, let's see what users exist
SELECT id, email FROM auth.users;

-- Then add the current user as admin (replace the UUID with your actual user ID)
INSERT INTO admin_users (user_id, email, role, is_active)
VALUES (
    'your-user-id-here', -- Replace this with your actual user ID
    'your-email@example.com', -- Replace with your email
    'admin',
    TRUE
)
ON CONFLICT (user_id) DO UPDATE SET
    is_active = TRUE,
    updated_at = NOW();

-- Verify the admin user was added
SELECT * FROM admin_users;
