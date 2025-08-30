// Test Welcome Bonus System
// This script tests the welcome bonus functionality

const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client (you'll need to add your own credentials)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log(
    "❌ Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testWelcomeBonusSystem() {
  console.log("🧪 Testing Welcome Bonus System...\n");

  try {
    // Test 1: Check if welcome bonus settings exist
    console.log("1. Checking welcome bonus settings...");
    const { data: settings, error: settingsError } = await supabase
      .from("crypto_settings")
      .select("*")
      .in("setting_key", ["welcome_bonus_enabled", "welcome_bonus_amount"]);

    if (settingsError) {
      console.log("❌ Error fetching settings:", settingsError.message);
      return;
    }

    console.log("✅ Settings found:", settings.length);
    settings.forEach((setting) => {
      console.log(`   - ${setting.setting_key}: ${setting.setting_value}`);
    });

    // Test 2: Check if the auto welcome bonus function exists
    console.log("\n2. Testing auto welcome bonus function...");
    const testUserId = "00000000-0000-0000-0000-000000000999"; // Test UUID

    const { data: functionResult, error: functionError } = await supabase.rpc(
      "check_and_give_welcome_bonus",
      { user_uuid: testUserId }
    );

    if (functionError) {
      console.log("❌ Function error:", functionError.message);
    } else {
      console.log("✅ Function executed successfully");
      console.log("   - Result:", functionResult);
    }

    // Test 3: Check user profiles structure
    console.log("\n3. Checking user profiles structure...");
    const { data: profileSample, error: profileError } = await supabase
      .from("user_profiles")
      .select("welcome_bonus_claimed, pengu_tokens")
      .limit(1);

    if (profileError) {
      console.log("❌ Error fetching profile:", profileError.message);
    } else {
      console.log("✅ Profile structure is correct");
      console.log("   - welcome_bonus_claimed field exists");
      console.log("   - pengu_tokens field exists");
    }

    console.log("\n🎉 Welcome Bonus System Test Complete!");
    console.log("\n📋 Manual Testing Instructions:");
    console.log("1. Create a new user account");
    console.log("2. Log in for the first time");
    console.log("3. Check if you see the welcome bonus notification");
    console.log("4. Verify your PENGU balance increased by 10,000");
    console.log("5. Check that welcome_bonus_claimed is set to true");
  } catch (error) {
    console.log("❌ Test failed:", error.message);
  }
}

// Run the test
testWelcomeBonusSystem();
