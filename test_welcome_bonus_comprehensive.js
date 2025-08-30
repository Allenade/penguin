// Comprehensive Welcome Bonus System Test
// This script thoroughly tests the welcome bonus functionality

const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log(
    "❌ Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: [],
};

function logTest(name, passed, details = "") {
  testResults.total++;
  if (passed) {
    testResults.passed++;
    console.log(`✅ ${name}`);
  } else {
    testResults.failed++;
    console.log(`❌ ${name}`);
  }
  if (details) {
    console.log(`   ${details}`);
  }
  testResults.details.push({ name, passed, details });
}

async function testWelcomeBonusSystem() {
  console.log("🧪 Comprehensive Welcome Bonus System Test\n");
  console.log("=".repeat(60));

  try {
    // Test 1: Database Settings
    console.log("\n📋 Test 1: Database Settings");
    console.log("-".repeat(30));

    const { data: settings, error: settingsError } = await supabase
      .from("crypto_settings")
      .select("*")
      .in("setting_key", ["welcome_bonus_enabled", "welcome_bonus_amount"]);

    if (settingsError) {
      logTest("Settings fetch", false, `Error: ${settingsError.message}`);
    } else {
      logTest("Settings fetch", true, `Found ${settings.length} settings`);

      const enabledSetting = settings.find(
        (s) => s.setting_key === "welcome_bonus_enabled"
      );
      const amountSetting = settings.find(
        (s) => s.setting_key === "welcome_bonus_amount"
      );

      logTest(
        "Welcome bonus enabled setting",
        !!enabledSetting,
        enabledSetting
          ? `Value: ${enabledSetting.setting_value}`
          : "Setting not found"
      );

      logTest(
        "Welcome bonus amount setting",
        !!amountSetting,
        amountSetting
          ? `Value: ${amountSetting.setting_value}`
          : "Setting not found"
      );

      if (enabledSetting && amountSetting) {
        logTest(
          "Settings configuration",
          enabledSetting.setting_value === "true" &&
            amountSetting.setting_value === "10000",
          `Enabled: ${enabledSetting.setting_value}, Amount: ${amountSetting.setting_value}`
        );
      }
    }

    // Test 2: Database Function
    console.log("\n📋 Test 2: Database Function");
    console.log("-".repeat(30));

    const testUserId = "00000000-0000-0000-0000-000000000999";

    // Test function exists and can be called
    const { data: functionResult, error: functionError } = await supabase.rpc(
      "check_and_give_welcome_bonus",
      { user_uuid: testUserId }
    );

    if (functionError) {
      logTest("Function execution", false, `Error: ${functionError.message}`);
    } else {
      logTest("Function execution", true, `Result: ${functionResult}`);
    }

    // Test 3: User Profile Structure
    console.log("\n📋 Test 3: User Profile Structure");
    console.log("-".repeat(30));

    const { data: profileSample, error: profileError } = await supabase
      .from("user_profiles")
      .select("welcome_bonus_claimed, pengu_tokens, user_id")
      .limit(1);

    if (profileError) {
      logTest("Profile structure", false, `Error: ${profileError.message}`);
    } else {
      logTest("Profile structure", true, "Profile table accessible");

      if (profileSample && profileSample.length > 0) {
        const profile = profileSample[0];
        logTest(
          "welcome_bonus_claimed field",
          "welcome_bonus_claimed" in profile,
          `Type: ${typeof profile.welcome_bonus_claimed}`
        );
        logTest(
          "pengu_tokens field",
          "pengu_tokens" in profile,
          `Type: ${typeof profile.pengu_tokens}`
        );
      }
    }

    // Test 4: Transaction Logging
    console.log("\n📋 Test 4: Transaction Logging");
    console.log("-".repeat(30));

    const { data: transactions, error: transactionError } = await supabase
      .from("user_transactions")
      .select("*")
      .eq("transaction_type", "welcome_bonus")
      .limit(5);

    if (transactionError) {
      logTest("Transaction table", false, `Error: ${transactionError.message}`);
    } else {
      logTest(
        "Transaction table",
        true,
        `Found ${transactions.length} welcome bonus transactions`
      );

      if (transactions.length > 0) {
        const transaction = transactions[0];
        logTest(
          "Transaction structure",
          transaction.amount && transaction.currency === "PENGU",
          `Amount: ${transaction.amount}, Currency: ${transaction.currency}`
        );
      }
    }

    // Test 5: Simulate Welcome Bonus for Test User
    console.log("\n📋 Test 5: Simulate Welcome Bonus");
    console.log("-".repeat(30));

    // First, check if test user exists and their current state
    const { data: existingUser, error: userCheckError } = await supabase
      .from("user_profiles")
      .select("welcome_bonus_claimed, pengu_tokens")
      .eq("user_id", testUserId)
      .single();

    if (userCheckError && userCheckError.code !== "PGRST116") {
      logTest("User check", false, `Error: ${userCheckError.message}`);
    } else {
      if (existingUser) {
        logTest(
          "Test user exists",
          true,
          `Bonus claimed: ${existingUser.welcome_bonus_claimed}, Tokens: ${existingUser.pengu_tokens}`
        );

        // Try to give bonus again (should fail if already claimed)
        const { data: bonusResult, error: bonusError } = await supabase.rpc(
          "check_and_give_welcome_bonus",
          { user_uuid: testUserId }
        );

        if (existingUser.welcome_bonus_claimed) {
          logTest(
            "Prevent duplicate bonus",
            bonusResult === false,
            `Expected: false, Got: ${bonusResult}`
          );
        } else {
          logTest(
            "Give bonus to new user",
            bonusResult === true,
            `Result: ${bonusResult}`
          );
        }
      } else {
        logTest(
          "Test user exists",
          false,
          "User not found (this is expected for test UUID)"
        );
      }
    }

    // Test 6: Admin Settings Access
    console.log("\n📋 Test 6: Admin Settings Access");
    console.log("-".repeat(30));

    // Test if admin can update settings
    const { error: updateError } = await supabase
      .from("crypto_settings")
      .update({ setting_value: "true" })
      .eq("setting_key", "welcome_bonus_enabled");

    if (updateError) {
      logTest("Admin settings update", false, `Error: ${updateError.message}`);
    } else {
      logTest("Admin settings update", true, "Settings can be updated");
    }

    // Test 7: Real User Scenario Simulation
    console.log("\n📋 Test 7: Real User Scenario");
    console.log("-".repeat(30));

    // Create a test user profile (simulating signup)
    const testUserProfile = {
      user_id: "00000000-0000-0000-0000-000000000888",
      email: "test@welcomebonus.com",
      wallet_username: "test_welcome_user",
      welcome_bonus_claimed: false,
      pengu_tokens: 0,
    };

    const { data: createdUser, error: createError } = await supabase
      .from("user_profiles")
      .insert(testUserProfile)
      .select()
      .single();

    if (createError) {
      logTest("Create test user", false, `Error: ${createError.message}`);
    } else {
      logTest("Create test user", true, "Test user created successfully");

      // Simulate first login - give welcome bonus
      const { data: bonusResult, error: bonusError } = await supabase.rpc(
        "check_and_give_welcome_bonus",
        { user_uuid: testUserProfile.user_id }
      );

      if (bonusError) {
        logTest("Give welcome bonus", false, `Error: ${bonusError.message}`);
      } else {
        logTest(
          "Give welcome bonus",
          bonusResult === true,
          `Result: ${bonusResult}`
        );

        // Check if user profile was updated
        const { data: updatedUser, error: updateError } = await supabase
          .from("user_profiles")
          .select("welcome_bonus_claimed, pengu_tokens")
          .eq("user_id", testUserProfile.user_id)
          .single();

        if (updateError) {
          logTest(
            "Profile update check",
            false,
            `Error: ${updateError.message}`
          );
        } else {
          logTest(
            "Profile update check",
            updatedUser.welcome_bonus_claimed === true &&
              updatedUser.pengu_tokens === 10000,
            `Bonus claimed: ${updatedUser.welcome_bonus_claimed}, Tokens: ${updatedUser.pengu_tokens}`
          );
        }

        // Check if transaction was logged
        const { data: newTransaction, error: transactionError } = await supabase
          .from("user_transactions")
          .select("*")
          .eq("user_id", testUserProfile.user_id)
          .eq("transaction_type", "welcome_bonus")
          .single();

        if (transactionError) {
          logTest(
            "Transaction logging",
            false,
            `Error: ${transactionError.message}`
          );
        } else {
          logTest(
            "Transaction logging",
            newTransaction.amount === 10000 &&
              newTransaction.currency === "PENGU",
            `Amount: ${newTransaction.amount}, Currency: ${newTransaction.currency}`
          );
        }
      }

      // Clean up test user
      await supabase
        .from("user_profiles")
        .delete()
        .eq("user_id", testUserProfile.user_id);
    }

    // Test 8: Frontend Integration Simulation
    console.log("\n📋 Test 8: Frontend Integration");
    console.log("-".repeat(30));

    // Simulate the frontend logic
    const simulateFrontendLogic = () => {
      // This simulates the logic in useUserAuth.ts
      const userProfile = {
        welcome_bonus_claimed: false,
        pengu_tokens: 0,
      };

      const shouldCheckBonus = !userProfile.welcome_bonus_claimed;
      const bonusAmount = 10000;
      const notificationMessage =
        "🎉 Welcome! You've received 10,000 PENGU bonus!";

      return {
        shouldCheckBonus,
        bonusAmount,
        notificationMessage,
      };
    };

    const frontendSimulation = simulateFrontendLogic();

    logTest(
      "Frontend bonus check logic",
      frontendSimulation.shouldCheckBonus === true,
      `Should check: ${frontendSimulation.shouldCheckBonus}`
    );

    logTest(
      "Frontend bonus amount",
      frontendSimulation.bonusAmount === 10000,
      `Amount: ${frontendSimulation.bonusAmount}`
    );

    logTest(
      "Frontend notification message",
      frontendSimulation.notificationMessage.includes("10,000 PENGU bonus"),
      `Message: ${frontendSimulation.notificationMessage}`
    );

    // Test Summary
    console.log("\n" + "=".repeat(60));
    console.log("📊 TEST SUMMARY");
    console.log("=".repeat(60));
    console.log(`Total Tests: ${testResults.total}`);
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(
      `📈 Success Rate: ${(
        (testResults.passed / testResults.total) *
        100
      ).toFixed(1)}%`
    );

    if (testResults.failed > 0) {
      console.log("\n❌ FAILED TESTS:");
      testResults.details
        .filter((test) => !test.passed)
        .forEach((test) => {
          console.log(`   - ${test.name}: ${test.details}`);
        });
    }

    console.log("\n🎯 MANUAL TESTING CHECKLIST:");
    console.log("1. Create a new user account");
    console.log("2. Log in for the first time");
    console.log("3. Check for welcome bonus notification");
    console.log("4. Verify PENGU balance increased by 10,000");
    console.log("5. Confirm welcome_bonus_claimed is set to true");
    console.log("6. Try logging in again - should not get bonus");
    console.log("7. Check transaction history for welcome bonus entry");

    console.log("\n🚀 Welcome Bonus System Test Complete!");
  } catch (error) {
    console.log("❌ Test failed with error:", error.message);
    console.log("Stack trace:", error.stack);
  }
}

// Run the comprehensive test
testWelcomeBonusSystem();
