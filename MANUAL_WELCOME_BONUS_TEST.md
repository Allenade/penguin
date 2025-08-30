# Manual Welcome Bonus Testing Guide

## 🧪 Step-by-Step Testing Instructions

### Prerequisites

- Your PENGU application is running (`npm run dev`)
- Supabase database is connected
- You have access to create new user accounts

---

## 📋 Test Scenario 1: New User Welcome Bonus

### Step 1: Create a New User Account

1. **Open your application** in the browser
2. **Go to the signup page** (usually `/auth` or similar)
3. **Create a new account** with:
   - Email: `test.welcome.bonus@example.com`
   - Password: `TestPassword123!`
   - Username: `test_welcome_user`

### Step 2: First Login (Should Trigger Welcome Bonus)

1. **Log in** with the newly created account
2. **Navigate to the dashboard** (`/dashboard`)
3. **Look for the welcome bonus notification**:
   - Should see: "🎉 Welcome! You've received 10,000 PENGU bonus!"
   - Notification should appear as a toast/modal

### Step 3: Verify Balance Update

1. **Check your PENGU balance** on the dashboard
2. **Should show 10,000 PENGU** (or your current balance + 10,000)
3. **Balance should update immediately** after login

### Step 4: Verify Database State

1. **Open Supabase Dashboard**
2. **Go to Table Editor** → `user_profiles`
3. **Find your test user** by email
4. **Verify these fields**:
   - `welcome_bonus_claimed`: `true`
   - `pengu_tokens`: `10000` (or previous amount + 10000)

### Step 5: Check Transaction Log

1. **Go to Table Editor** → `user_transactions`
2. **Find the welcome bonus transaction** for your user
3. **Verify transaction details**:
   - `transaction_type`: `welcome_bonus`
   - `amount`: `10000`
   - `currency`: `PENGU`
   - `status`: `completed`

---

## 📋 Test Scenario 2: Existing User (No Bonus)

### Step 1: Log Out and Log Back In

1. **Log out** of the test account
2. **Log back in** with the same account
3. **Navigate to dashboard**

### Step 2: Verify No Bonus Given

1. **Should NOT see** the welcome bonus notification
2. **Should see**: "Welcome back, [username]!" instead
3. **Balance should remain the same** (no additional 10,000 PENGU)

### Step 3: Verify Database State Unchanged

1. **Check `user_profiles`** table again
2. **`welcome_bonus_claimed` should still be `true`**
3. **`pengu_tokens` should be the same** as before

---

## 📋 Test Scenario 3: Admin Settings Control

### Step 1: Disable Welcome Bonus

1. **Open Supabase Dashboard**
2. **Go to SQL Editor**
3. **Run this query**:
   ```sql
   UPDATE crypto_settings
   SET setting_value = 'false'
   WHERE setting_key = 'welcome_bonus_enabled';
   ```

### Step 2: Test with New User

1. **Create another test account** with different email
2. **Log in for the first time**
3. **Should NOT receive welcome bonus**
4. **Should NOT see welcome bonus notification**

### Step 3: Re-enable Welcome Bonus

1. **Run this query** in SQL Editor:
   ```sql
   UPDATE crypto_settings
   SET setting_value = 'true'
   WHERE setting_key = 'welcome_bonus_enabled';
   ```

---

## 📋 Test Scenario 4: Change Bonus Amount

### Step 1: Modify Bonus Amount

1. **In Supabase SQL Editor**, run:
   ```sql
   UPDATE crypto_settings
   SET setting_value = '5000'
   WHERE setting_key = 'welcome_bonus_amount';
   ```

### Step 2: Test New Amount

1. **Create another test account**
2. **Log in for the first time**
3. **Should receive 5,000 PENGU** instead of 10,000
4. **Notification should show**: "🎉 Welcome! You've received 5,000 PENGU bonus!"

### Step 3: Reset to Original Amount

1. **Run this query**:
   ```sql
   UPDATE crypto_settings
   SET setting_value = '10000'
   WHERE setting_key = 'welcome_bonus_amount';
   ```

---

## ✅ Expected Results

### ✅ Success Indicators

- [ ] New users get welcome bonus on first login
- [ ] Welcome bonus notification appears
- [ ] PENGU balance increases by correct amount
- [ ] `welcome_bonus_claimed` is set to `true`
- [ ] Transaction is logged in database
- [ ] Existing users don't get bonus again
- [ ] Admin can disable/enable the feature
- [ ] Admin can change bonus amount

### ❌ Failure Indicators

- [ ] No welcome bonus given to new users
- [ ] Welcome bonus given to existing users
- [ ] Balance doesn't update
- [ ] No notification appears
- [ ] Database state not updated
- [ ] No transaction logged
- [ ] Admin settings don't work

---

## 🔧 Troubleshooting

### If Welcome Bonus Not Given

1. **Check database settings**:

   ```sql
   SELECT * FROM crypto_settings WHERE setting_key LIKE 'welcome_bonus%';
   ```

2. **Check user profile**:

   ```sql
   SELECT welcome_bonus_claimed, pengu_tokens
   FROM user_profiles
   WHERE email = 'your-test-email@example.com';
   ```

3. **Check database function**:
   ```sql
   SELECT check_and_give_welcome_bonus('your-user-id');
   ```

### If Notification Not Showing

1. **Check browser console** for JavaScript errors
2. **Verify toast component** is working
3. **Check user authentication state**

### If Balance Not Updating

1. **Check real-time subscriptions** are working
2. **Verify user profile refresh** is called
3. **Check database permissions** for the function

---

## 📊 Test Results Template

```
Test Date: _______________
Tester: _________________

✅ Test Scenario 1: New User Welcome Bonus
- [ ] Welcome bonus notification appeared
- [ ] PENGU balance increased by 10,000
- [ ] Database state updated correctly
- [ ] Transaction logged

✅ Test Scenario 2: Existing User (No Bonus)
- [ ] No welcome bonus notification
- [ ] Balance remained unchanged
- [ ] Database state unchanged

✅ Test Scenario 3: Admin Settings Control
- [ ] Welcome bonus disabled correctly
- [ ] Welcome bonus re-enabled correctly

✅ Test Scenario 4: Change Bonus Amount
- [ ] Bonus amount changed to 5,000
- [ ] New users received 5,000 PENGU
- [ ] Amount reset to 10,000

Overall Result: PASS / FAIL
Notes: ________________________________
```

---

## 🚀 Next Steps

After successful testing:

1. **Clean up test accounts** if needed
2. **Reset any changed settings** to defaults
3. **Document any issues** found
4. **Deploy to production** if all tests pass

The welcome bonus system should now be fully functional! 🎉
