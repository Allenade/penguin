# 🧪 PENGU Staking System - Manual Test Checklist

## 📋 Pre-Test Setup

- [ ] Run the `simple_user_staking_setup.sql` script in Supabase SQL Editor
- [ ] Ensure your Next.js development server is running (`npm run dev`)
- [ ] Have admin and user accounts ready for testing

---

## 👨‍💼 Admin Staking Management Tests

### **Test 1: Admin Page Load**

- [ ] Navigate to `http://localhost:3000/admin/staking`
- [ ] Verify the page loads without errors
- [ ] Check that "Staking Management" is highlighted in the sidebar
- [ ] Confirm all 4 tabs are visible: Settings, Active Staking, Rewards, System Controls

### **Test 2: Active Staking Tab**

- [ ] Click on "Active Staking" tab
- [ ] Verify analytics cards show:
  - [ ] Total Staked: [amount] PENGU
  - [ ] Active Users: [number]
  - [ ] Total Rewards: [amount] PENGU
  - [ ] Active Stakes: [number]
- [ ] Check that the table displays user staking data
- [ ] Verify table columns: User, Staked Amount, **DRI** (not APY), Rewards, Status, Staked Date, Actions

### **Test 3: Search and Filter**

- [ ] Test search functionality by entering a user ID
- [ ] Test status filter dropdown (All Status, Active, Paused, Unstaked, Force Unstaked)
- [ ] Verify filtered results display correctly

### **Test 4: Admin Actions**

- [ ] Click the Edit button (pencil icon) on a stake
- [ ] Verify the edit modal opens with user details
- [ ] Test editing staked amount and DRI rate
- [ ] Save changes and verify they appear in the table
- [ ] Test Pause/Resume functionality
- [ ] Test Adjust Rewards functionality
- [ ] Test Force Unstake (with confirmation)

### **Test 5: Rewards Tab**

- [ ] Click on "Rewards" tab
- [ ] Verify rewards analytics display correctly
- [ ] Check "Top Rewards Earners" section
- [ ] Verify "Recent Reward Activities" section

### **Test 6: System Controls Tab**

- [ ] Click on "System Controls" tab
- [ ] Verify emergency controls are visible
- [ ] Check system status indicators
- [ ] Verify system information displays correctly

---

## 👤 User Staking Dashboard Tests

### **Test 7: User Dashboard Load**

- [ ] Navigate to `http://localhost:3000/dashboard/staking`
- [ ] Verify the page loads without errors
- [ ] Check that "Staking" is highlighted in the sidebar

### **Test 8: Staking Stats Display**

- [ ] Verify staking stats cards show:
  - [ ] **DIR**: [percentage]% (not APY)
  - [ ] Total Staked: [amount] PENGU
  - [ ] Rewards Earned: [amount] PENGU

### **Test 9: Staking Modal**

- [ ] Click "Stake PENGU" button
- [ ] Verify the staking modal opens
- [ ] Check that the modal shows:
  - [ ] Amount input field
  - [ ] Available balance display
  - [ ] Min/Max limits
  - [ ] **DIR**: [percentage]% (not APY)
- [ ] Test input validation (try invalid amounts)
- [ ] Test staking with valid amount

### **Test 10: Active Staking Display**

- [ ] If user has active stakes, verify they display correctly
- [ ] Check that each stake shows:
  - [ ] Staked amount
  - [ ] Staking date
  - [ ] **DIR**: [percentage]% (not APY)
  - [ ] Rewards earned
  - [ ] Unstake button

---

## 🔄 Integration Tests

### **Test 11: Admin-User Data Flow**

- [ ] Create a test stake as a user
- [ ] Switch to admin panel and verify the stake appears
- [ ] Modify the stake as admin (change amount or DRI)
- [ ] Switch back to user dashboard and verify changes appear
- [ ] Test real-time updates (refresh page if needed)

### **Test 12: Terminology Consistency**

- [ ] Verify all instances show "DRI" or "DIR" instead of "APY":
  - [ ] Admin table headers
  - [ ] Admin edit forms
  - [ ] User dashboard stats
  - [ ] User staking modal
  - [ ] Staking section components

### **Test 13: Error Handling**

- [ ] Test staking with insufficient balance
- [ ] Test staking below minimum amount
- [ ] Test staking above maximum amount
- [ ] Verify appropriate error messages display
- [ ] Test network error handling (disconnect internet temporarily)

---

## 📊 Test Results Summary

### **Pass/Fail Tracking**

- [ ] **Admin Tests**: \_\_\_/6 passed
- [ ] **User Tests**: \_\_\_/4 passed
- [ ] **Integration Tests**: \_\_\_/3 passed
- [ ] **Overall**: \_\_\_/13 passed

### **Issues Found**

- [ ] Issue 1: ******\_\_\_\_******
- [ ] Issue 2: ******\_\_\_\_******
- [ ] Issue 3: ******\_\_\_\_******

### **Notes**

- [ ] Any additional observations or recommendations
- [ ] Performance notes
- [ ] UI/UX feedback

---

## 🎯 Success Criteria

**✅ System is working correctly if:**

- [ ] All admin functions work (view, edit, pause, resume, force unstake)
- [ ] All user functions work (view stats, stake, unstake)
- [ ] Data flows correctly between admin and user interfaces
- [ ] All "APY" references have been changed to "DRI"/"DIR"
- [ ] Error handling works appropriately
- [ ] Real-time updates function correctly

**❌ System needs fixes if:**

- [ ] Any admin or user functions fail
- [ ] Data doesn't sync between interfaces
- [ ] "APY" terminology still appears anywhere
- [ ] Error messages don't display properly
- [ ] Performance issues occur

---

## 🚀 Next Steps After Testing

1. **If all tests pass**: System is ready for production
2. **If some tests fail**: Fix issues and re-test
3. **Document any findings** for future reference
4. **Consider performance optimization** if needed
5. **Plan user acceptance testing** with real users
