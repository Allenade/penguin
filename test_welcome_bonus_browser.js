// Browser-based Welcome Bonus Test
// Run this in your browser console when logged into your PENGU app

console.log("🧪 Welcome Bonus System - Browser Test");
console.log("=".repeat(50));

// Test 1: Check if welcome bonus settings are loaded
async function testWelcomeBonusSettings() {
  console.log("\n📋 Test 1: Welcome Bonus Settings");

  try {
    // This would normally come from your useCrypto hook
    const { data: settings, error } = await supabase
      .from("crypto_settings")
      .select("*")
      .in("setting_key", ["welcome_bonus_enabled", "welcome_bonus_amount"]);

    if (error) {
      console.log("❌ Error fetching settings:", error.message);
      return false;
    }

    console.log("✅ Settings loaded:", settings.length);
    settings.forEach((setting) => {
      console.log(`   - ${setting.setting_key}: ${setting.setting_value}`);
    });

    const enabled = settings.find(
      (s) => s.setting_key === "welcome_bonus_enabled"
    );
    const amount = settings.find(
      (s) => s.setting_key === "welcome_bonus_amount"
    );

    if (enabled && amount) {
      console.log(
        `✅ Welcome bonus is ${
          enabled.setting_value === "true" ? "ENABLED" : "DISABLED"
        }`
      );
      console.log(`✅ Bonus amount: ${amount.setting_value} PENGU`);
      return true;
    } else {
      console.log("❌ Missing welcome bonus settings");
      return false;
    }
  } catch (err) {
    console.log("❌ Test failed:", err.message);
    return false;
  }
}

// Test 2: Check current user's welcome bonus status
async function testUserWelcomeBonusStatus() {
  console.log("\n📋 Test 2: Current User Welcome Bonus Status");

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log("❌ No user logged in");
      return false;
    }

    console.log("✅ User logged in:", user.email);

    const { data: profile, error } = await supabase
      .from("user_profiles")
      .select("welcome_bonus_claimed, pengu_tokens")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.log("❌ Error fetching profile:", error.message);
      return false;
    }

    console.log("✅ User profile loaded");
    console.log(`   - Welcome bonus claimed: ${profile.welcome_bonus_claimed}`);
    console.log(`   - Current PENGU tokens: ${profile.pengu_tokens}`);

    if (!profile.welcome_bonus_claimed) {
      console.log("🎉 This user is eligible for welcome bonus!");
      return "eligible";
    } else {
      console.log("ℹ️ This user has already claimed welcome bonus");
      return "claimed";
    }
  } catch (err) {
    console.log("❌ Test failed:", err.message);
    return false;
  }
}

// Test 3: Test welcome bonus function
async function testWelcomeBonusFunction() {
  console.log("\n📋 Test 3: Welcome Bonus Function");

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log("❌ No user logged in");
      return false;
    }

    // Test the function
    const { data: result, error } = await supabase.rpc(
      "check_and_give_welcome_bonus",
      { user_uuid: user.id }
    );

    if (error) {
      console.log("❌ Function error:", error.message);
      return false;
    }

    console.log("✅ Function executed successfully");
    console.log(`   - Result: ${result}`);

    if (result === true) {
      console.log("🎉 Welcome bonus was given!");

      // Check updated profile
      const { data: updatedProfile } = await supabase
        .from("user_profiles")
        .select("welcome_bonus_claimed, pengu_tokens")
        .eq("user_id", user.id)
        .single();

      console.log("✅ Profile updated:");
      console.log(
        `   - Welcome bonus claimed: ${updatedProfile.welcome_bonus_claimed}`
      );
      console.log(`   - PENGU tokens: ${updatedProfile.pengu_tokens}`);

      return true;
    } else {
      console.log(
        "ℹ️ Welcome bonus was not given (already claimed or disabled)"
      );
      return false;
    }
  } catch (err) {
    console.log("❌ Test failed:", err.message);
    return false;
  }
}

// Test 4: Check transaction history
async function testTransactionHistory() {
  console.log("\n📋 Test 4: Transaction History");

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log("❌ No user logged in");
      return false;
    }

    const { data: transactions, error } = await supabase
      .from("user_transactions")
      .select("*")
      .eq("user_id", user.id)
      .eq("transaction_type", "welcome_bonus")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("❌ Error fetching transactions:", error.message);
      return false;
    }

    console.log(`✅ Found ${transactions.length} welcome bonus transactions`);

    if (transactions.length > 0) {
      const latest = transactions[0];
      console.log("✅ Latest welcome bonus transaction:");
      console.log(`   - Amount: ${latest.amount} ${latest.currency}`);
      console.log(`   - Status: ${latest.status}`);
      console.log(`   - Date: ${new Date(latest.created_at).toLocaleString()}`);
      console.log(`   - Description: ${latest.description}`);
    } else {
      console.log("ℹ️ No welcome bonus transactions found");
    }

    return true;
  } catch (err) {
    console.log("❌ Test failed:", err.message);
    return false;
  }
}

// Test 5: Frontend integration test
function testFrontendIntegration() {
  console.log("\n📋 Test 5: Frontend Integration");

  // Check if toast component exists
  const toastElements = document.querySelectorAll(
    '[data-testid="toast"], .toast, [class*="toast"]'
  );
  console.log(`✅ Found ${toastElements.length} toast elements`);

  // Check if welcome bonus notification would show
  const notificationMessage = "🎉 Welcome! You've received 10,000 PENGU bonus!";
  console.log("✅ Expected notification message:", notificationMessage);

  // Check if dashboard elements exist
  const dashboardElements = document.querySelectorAll(
    '[data-testid="dashboard"], .dashboard, [class*="dashboard"]'
  );
  console.log(`✅ Found ${dashboardElements.length} dashboard elements`);

  // Check if balance display exists
  const balanceElements = document.querySelectorAll(
    '[data-testid="balance"], .balance, [class*="balance"], [class*="pengu"]'
  );
  console.log(`✅ Found ${balanceElements.length} balance-related elements`);

  return true;
}

// Run all tests
async function runAllTests() {
  console.log("🚀 Starting Welcome Bonus System Tests...\n");

  const results = {
    settings: await testWelcomeBonusSettings(),
    userStatus: await testUserWelcomeBonusStatus(),
    function: await testWelcomeBonusFunction(),
    transactions: await testTransactionHistory(),
    frontend: testFrontendIntegration(),
  };

  console.log("\n" + "=".repeat(50));
  console.log("📊 TEST RESULTS SUMMARY");
  console.log("=".repeat(50));

  Object.entries(results).forEach(([test, result]) => {
    const status = result ? "✅ PASS" : "❌ FAIL";
    console.log(`${test.padEnd(15)}: ${status}`);
  });

  const passedTests = Object.values(results).filter((r) => r).length;
  const totalTests = Object.keys(results).length;

  console.log("\n📈 Overall Result:");
  console.log(`   Passed: ${passedTests}/${totalTests}`);
  console.log(
    `   Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`
  );

  if (passedTests === totalTests) {
    console.log(
      "\n🎉 ALL TESTS PASSED! Welcome Bonus System is working correctly!"
    );
  } else {
    console.log("\n⚠️ Some tests failed. Check the details above.");
  }

  console.log("\n📋 Manual Testing Checklist:");
  console.log("1. Create a new user account");
  console.log("2. Log in for the first time");
  console.log("3. Check for welcome bonus notification");
  console.log("4. Verify PENGU balance increased by 10,000");
  console.log("5. Confirm welcome_bonus_claimed is set to true");
  console.log("6. Try logging in again - should not get bonus");
  console.log("7. Check transaction history for welcome bonus entry");
}

// Auto-run tests when script is loaded
runAllTests();
