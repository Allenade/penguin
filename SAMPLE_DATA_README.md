# Sample Data for PENGU Platform

This document explains how to add sample user data to populate your PENGU platform for testing and demonstration purposes.

## 📊 Sample Users Included

The sample data includes **10 diverse users** with realistic balance scenarios:

### 🐋 High-Value Users

- **crypto_whale@example.com** - $125,000 total balance
- **vip_trader@example.com** - $250,000 total balance

### 💼 Medium Users

- **trader_jane@example.com** - $37,500 total balance
- **balanced_portfolio@example.com** - $62,500 total balance
- **reward_collector@example.com** - $50,000 total balance

### 🆕 New Users

- **newbie_crypto@example.com** - $6,250 total balance (with welcome bonus)
- **fresh_start@example.com** - $0 total balance (new user)

### 🎯 Specialized Users

- **staking_master@example.com** - Heavy staking focus
- **small_investor@example.com** - Small balance user
- **unverified_user@example.com** - Unverified status

## 🚀 How to Add Sample Data

### Option 1: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `sample_data.sql`
4. Click **Run** to execute the script

### Option 2: Using Supabase CLI

```bash
# Run the sample data script
supabase db reset --linked
psql -h your-project-ref.supabase.co -U postgres -d postgres -f sample_data.sql
```

### Option 3: Direct Database Connection

```bash
# Connect to your database and run
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres" -f sample_data.sql
```

## 📈 What the Data Includes

### User Profiles

- **Realistic balances** across all cryptocurrencies
- **Different verification levels** (0-3)
- **Welcome bonus status** (claimed/not claimed)
- **Registration dates** spanning several months
- **Staking positions** with rewards

### Balance Distribution

- **PENGU Tokens**: 0 - 100,000
- **USDT Balance**: 0 - 50,000
- **SOL Balance**: 0 - 250
- **ETH Balance**: 0 - 50
- **BTC Balance**: 0 - 5
- **Staked PENGU**: 0 - 25,000
- **Staking Rewards**: 0 - 3,125

### Total Portfolio Values

- **Range**: $0 - $250,000
- **Average**: ~$50,000
- **Realistic market prices** used for calculations

## 🔧 Testing the User Management System

After adding the sample data:

1. **Go to Admin Panel** → **User Management**
2. **Click "All Users"** to see the complete list
3. **Search by email** to find specific users
4. **Click "Edit"** on any user to update their balances
5. **Test the update functionality** with different values

## 📧 Test Email Addresses

You can search for these specific users:

- `crypto_whale@example.com`
- `trader_jane@example.com`
- `newbie_crypto@example.com`
- `staking_master@example.com`
- `small_investor@example.com`
- `unverified_user@example.com`
- `reward_collector@example.com`
- `balanced_portfolio@example.com`
- `fresh_start@example.com`
- `vip_trader@example.com`

## ⚠️ Important Notes

- **This is test data** - don't use in production
- **UUIDs are generated** - each run creates new user IDs
- **Market prices are simplified** - real app would use live prices
- **Balances are realistic** but fictional
- **Staking rewards are calculated** based on 12.5% APY

## 🎯 Next Steps

After adding sample data:

1. Test the **User Management** interface
2. Verify **balance updates** work correctly
3. Check **user dashboard** reflects changes
4. Test **search functionality** with different emails
5. Verify **responsive design** on mobile devices

The sample data will give you a realistic view of how the system handles various user scenarios and balance levels!
