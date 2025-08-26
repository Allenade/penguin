# Database Setup Guide for PENGU User Authentication

## Overview

This guide will help you set up the complete database schema for the PENGU user authentication system in Supabase.

## Prerequisites

- Supabase project created
- Access to Supabase Dashboard
- SQL Editor access

## Step 1: Run the Database Schema

1. **Open Supabase Dashboard**

   - Go to your Supabase project dashboard
   - Navigate to the "SQL Editor" section

2. **Run the Schema Script**

   - Copy the contents of `database_schema.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute the script

3. **Verify Tables Created**
   - Go to "Table Editor" in Supabase
   - You should see the following tables:
     - `user_profiles`
     - `user_transactions`
     - `user_investments`
     - `user_sessions`
     - `admin_users`

## Step 2: Update Supabase Types (Optional but Recommended)

After running the schema, you can generate updated TypeScript types:

1. **Install Supabase CLI** (if not already installed):

   ```bash
   npm install -g supabase
   ```

2. **Generate Types**:

   ```bash
   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts
   ```

3. **Update Supabase Client**:
   - Replace the existing Supabase client with the typed version
   - This will provide better TypeScript support

## Step 3: Test the Authentication System

1. **Test User Registration**:

   - Go to your app
   - Try to register a new user
   - Check if the user profile is created automatically

2. **Test User Login**:

   - Try logging in with the created user
   - Verify the authentication works

3. **Test Protected Routes**:
   - Try accessing `/huddle` and `/dashboard` without authentication
   - Verify they redirect to login
   - Try accessing them after authentication
   - Verify they work properly

## Database Schema Details

### Tables Created:

#### `user_profiles`

- Stores user profile information
- Automatically created when user signs up
- Contains wallet username, investment data, verification status

#### `user_transactions`

- Tracks all user transactions
- Supports deposits, withdrawals, investments, dividends
- Includes status tracking and reference IDs

#### `user_investments`

- Manages user investment portfolios
- Tracks PENGU tokens, current values, investment types
- Supports different investment categories

#### `user_sessions`

- Tracks user login sessions
- Includes IP addresses and user agents
- Supports session management and security

#### `admin_users`

- Separate table for admin users
- Different from regular user authentication
- Supports role-based permissions

### Security Features:

#### Row Level Security (RLS)

- All tables have RLS enabled
- Users can only access their own data
- Admins have appropriate permissions

#### Automatic Triggers

- User profiles created automatically on signup
- Updated timestamps maintained automatically
- Data integrity enforced

## Troubleshooting

### Common Issues:

1. **"Table doesn't exist" errors**:

   - Make sure you ran the schema script completely
   - Check if all tables were created in Table Editor

2. **Authentication errors**:

   - Verify Supabase auth is enabled
   - Check if email confirmations are configured properly

3. **RLS Policy errors**:

   - Ensure all policies were created
   - Check if user is properly authenticated

4. **TypeScript errors**:
   - Generate updated types after schema changes
   - Update your Supabase client configuration

### Next Steps:

1. **Customize the Schema**:

   - Modify tables based on your specific needs
   - Add additional fields or tables as required

2. **Add Real Data**:

   - Replace mock data with real database queries
   - Implement proper error handling

3. **Enhance Security**:

   - Add additional RLS policies if needed
   - Implement audit logging

4. **Performance Optimization**:
   - Add database indexes for frequently queried fields
   - Optimize queries for better performance

## Support

If you encounter any issues:

1. Check the Supabase documentation
2. Review the error logs in Supabase Dashboard
3. Verify all SQL commands executed successfully
4. Test with a fresh database if needed

## Current Status

✅ **Authentication System**: Working with mock data
✅ **Protected Routes**: Implemented
✅ **User Registration**: Working
✅ **User Login**: Working
🔄 **Database Integration**: Ready to implement
🔄 **Real Data**: Ready to connect

Once you run the database schema, the system will be fully functional with real data persistence!
