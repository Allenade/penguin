"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface CryptoAsset {
  id: number;
  symbol: string;
  name: string;
  logo_url: string;
  color_hex: string;
  decimals: number;
  is_active: boolean;
  display_order: number;
}

interface DepositAddress {
  id: number;
  crypto_symbol: string;
  network: string;
  address: string;
  qr_code_url: string | null;
  instructions: string;
  is_active: boolean;
  min_deposit: number;
  max_deposit: number;
  icon_url?: string;
}

interface StakingSettings {
  id: number;
  crypto_symbol: string;
  apy_percentage: number;
  min_stake_amount: number;
  max_stake_amount: number;
  lock_period_days: number;
  early_unstake_penalty: number;
  is_active: boolean;
}

interface WithdrawalLimits {
  id: number;
  crypto_symbol: string;
  min_withdrawal: number;
  max_withdrawal: number;
  daily_limit: number;
  monthly_limit: number;
  withdrawal_fee: number;
  is_active: boolean;
}

interface WithdrawalAddress {
  id: number;
  crypto_symbol: string;
  network: string;
  address: string;
  is_active: boolean;
  is_automated: boolean;
  daily_limit: number;
  icon_url?: string;
  min_withdrawal: number;
  max_withdrawal: number;
}

interface WithdrawalRequest {
  id: number;
  user_id: string;
  crypto_symbol: string;
  amount: number;
  user_address: string;
  platform_address: string;
  withdrawal_fee: number;
  net_amount: number;
  status: string;
  transaction_hash: string | null;
  admin_notes: string | null;
  processed_by: string | null;
  processed_at: string | null;
  created_at: string;
  updated_at: string;
}

interface UserStaking {
  id: number;
  user_id: string;
  crypto_symbol: string;
  staked_amount: number;
  rewards_earned: number;
  apy_at_stake: number;
  staked_at: string;
  unstaked_at: string | null;
  status: string;
}

interface CryptoSettings {
  id: number;
  setting_key: string;
  setting_value: string;
  setting_type: string;
  description: string;
  is_editable: boolean;
}

export function useCrypto() {
  const [assets, setAssets] = useState<CryptoAsset[]>([]);
  const [depositAddresses, setDepositAddresses] = useState<DepositAddress[]>(
    []
  );
  const [stakingSettings, setStakingSettings] = useState<StakingSettings[]>([]);
  const [withdrawalLimits, setWithdrawalLimits] = useState<WithdrawalLimits[]>(
    []
  );
  const [withdrawalAddresses, setWithdrawalAddresses] = useState<
    WithdrawalAddress[]
  >([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<
    WithdrawalRequest[]
  >([]);
  const [userStaking, setUserStaking] = useState<UserStaking[]>([]);
  const [settings, setSettings] = useState<CryptoSettings[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<number>(Date.now());

  // Fetch all crypto data
  const fetchCryptoData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("Fetching crypto data...");

      // Fetch all data in parallel
      const [
        { data: assetsData, error: assetsError },
        { data: addressesData, error: addressesError },
        { data: stakingData, error: stakingError },
        { data: limitsData, error: limitsError },
        { data: withdrawalAddressesData, error: withdrawalAddressesError },
        { data: settingsData, error: settingsError },
      ] = await Promise.all([
        (supabase as any)
          .from("crypto_assets")
          .select("*")
          .order("display_order"),
        (supabase as any)
          .from("deposit_addresses")
          .select("*")
          .eq("is_active", true),
        (supabase as any)
          .from("staking_settings")
          .select("*")
          .eq("is_active", true),
        (supabase as any)
          .from("withdrawal_limits")
          .select("*")
          .eq("is_active", true),
        (supabase as any)
          .from("withdrawal_addresses")
          .select("*")
          .eq("is_active", true),
        (supabase as any).from("crypto_settings").select("*"),
      ]);

      console.log("Crypto data fetched:", {
        assets: assetsData?.length || 0,
        addresses: addressesData?.length || 0,
        staking: stakingData?.length || 0,
        limits: limitsData?.length || 0,
        withdrawalAddresses: withdrawalAddressesData?.length || 0,
        settings: settingsData?.length || 0,
      });

      if (assetsError) throw assetsError;
      if (addressesError) throw addressesError;
      if (stakingError) throw stakingError;
      if (limitsError) throw limitsError;
      if (withdrawalAddressesError) throw withdrawalAddressesError;
      if (settingsError) throw settingsError;

      // Update all state with new data
      setAssets(assetsData || []);
      setDepositAddresses(addressesData || []);
      setStakingSettings(stakingData || []);
      setWithdrawalLimits(limitsData || []);
      setWithdrawalAddresses(withdrawalAddressesData || []);
      setSettings(settingsData || []);

      // Update refresh timestamp to trigger re-renders
      setLastRefresh(Date.now());

      console.log("✅ Crypto data state updated");
    } catch (err) {
      console.error("Error fetching crypto data:", err);
      setError("Failed to load crypto data");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user staking data
  const fetchUserStaking = async (userId: string) => {
    try {
      const { data, error } = await (supabase as any)
        .from("user_staking")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUserStaking(data || []);
    } catch (err) {
      console.error("Error fetching user staking:", err);
    }
  };

  // Claim welcome bonus
  const claimWelcomeBonus = async (userId: string) => {
    try {
      const { data, error } = await (supabase as any).rpc(
        "claim_welcome_bonus",
        { user_uuid: userId }
      );

      if (error) throw error;
      return { success: data };
    } catch (err) {
      console.error("Error claiming welcome bonus:", err);
      return { success: false, error: err };
    }
  };

  // Stake tokens
  const stakeTokens = async (
    userId: string,
    cryptoSymbol: string,
    amount: number
  ) => {
    try {
      // Get staking settings
      const stakingSetting = stakingSettings.find(
        (s) => s.crypto_symbol === cryptoSymbol
      );
      if (!stakingSetting) {
        throw new Error("Staking not available for this token");
      }

      if (amount < stakingSetting.min_stake_amount) {
        throw new Error(
          `Minimum stake amount is ${stakingSetting.min_stake_amount}`
        );
      }

      if (amount > stakingSetting.max_stake_amount) {
        throw new Error(
          `Maximum stake amount is ${stakingSetting.max_stake_amount}`
        );
      }

      // Create staking record
      const { data, error } = await (supabase as any)
        .from("user_staking")
        .insert({
          user_id: userId,
          crypto_symbol: cryptoSymbol,
          staked_amount: amount,
          apy_at_stake: stakingSetting.apy_percentage,
          status: "active",
        })
        .select()
        .single();

      if (error) throw error;

      // Update user balance (subtract staked amount)
      const { error: balanceError } = await (supabase as any)
        .from("user_profiles")
        .update({
          [`${cryptoSymbol.toLowerCase()}_balance`]: (supabase as any).rpc(
            "subtract_balance",
            {
              user_uuid: userId,
              crypto_symbol: cryptoSymbol,
              amount: amount,
            }
          ),
        })
        .eq("user_id", userId);

      if (balanceError) throw balanceError;

      // Refresh user staking data
      await fetchUserStaking(userId);

      return { success: true, data };
    } catch (err) {
      console.error("Error staking tokens:", err);
      return { success: false, error: err };
    }
  };

  // Unstake tokens
  const unstakeTokens = async (stakingId: number, userId: string) => {
    try {
      const stakingRecord = userStaking.find((s) => s.id === stakingId);
      if (!stakingRecord) {
        throw new Error("Staking record not found");
      }

      // Calculate rewards
      const { data: rewards, error: rewardsError } = await (
        supabase as any
      ).rpc("calculate_staking_rewards", { user_uuid: userId });

      if (rewardsError) throw rewardsError;

      // Update staking record
      const { error } = await (supabase as any)
        .from("user_staking")
        .update({
          status: "unstaked",
          unstaked_at: new Date().toISOString(),
          rewards_earned: rewards,
        })
        .eq("id", stakingId);

      if (error) throw error;

      // Add back to user balance (staked amount + rewards)
      const totalAmount = stakingRecord.staked_amount + rewards;
      const { error: balanceError } = await (supabase as any)
        .from("user_profiles")
        .update({
          [`${stakingRecord.crypto_symbol.toLowerCase()}_balance`]: (
            supabase as any
          ).rpc("add_balance", {
            user_uuid: userId,
            crypto_symbol: stakingRecord.crypto_symbol,
            amount: totalAmount,
          }),
        })
        .eq("user_id", userId);

      if (balanceError) throw balanceError;

      // Refresh user staking data
      await fetchUserStaking(userId);

      return { success: true };
    } catch (err) {
      console.error("Error unstaking tokens:", err);
      return { success: false, error: err };
    }
  };

  // Get deposit address for a specific crypto
  const getDepositAddress = (cryptoSymbol: string): DepositAddress | null => {
    return (
      depositAddresses.find((addr) => addr.crypto_symbol === cryptoSymbol) ||
      null
    );
  };

  // Get withdrawal limits for a specific crypto
  const getWithdrawalLimits = (
    cryptoSymbol: string
  ): WithdrawalLimits | null => {
    return (
      withdrawalLimits.find((limit) => limit.crypto_symbol === cryptoSymbol) ||
      null
    );
  };

  // Get staking settings for a specific crypto
  const getStakingSettings = (cryptoSymbol: string): StakingSettings | null => {
    return (
      stakingSettings.find(
        (setting) => setting.crypto_symbol === cryptoSymbol
      ) || null
    );
  };

  // Get setting value
  const getSetting = (key: string): string | null => {
    const setting = settings.find((s) => s.setting_key === key);
    return setting ? setting.setting_value : null;
  };

  // Check if welcome bonus is enabled
  const isWelcomeBonusEnabled = (): boolean => {
    return getSetting("welcome_bonus_enabled") === "true";
  };

  // Get welcome bonus amount
  const getWelcomeBonusAmount = (): number => {
    const amount = getSetting("welcome_bonus_amount");
    return amount ? parseFloat(amount) : 0;
  };

  // Get withdrawal address for a specific crypto
  const getWithdrawalAddress = (
    cryptoSymbol: string
  ): WithdrawalAddress | null => {
    return (
      withdrawalAddresses.find((addr) => addr.crypto_symbol === cryptoSymbol) ||
      null
    );
  };

  // Create withdrawal request
  const createWithdrawalRequest = async (
    userId: string,
    cryptoSymbol: string,
    amount: number,
    userAddress: string
  ): Promise<{ success: boolean; requestId?: number; error?: string }> => {
    try {
      // Validate inputs
      if (!userId || !cryptoSymbol || !amount || !userAddress) {
        return {
          success: false,
          error: "Missing required parameters",
        };
      }

      if (amount <= 0) {
        return {
          success: false,
          error: "Amount must be greater than 0",
        };
      }

      // Check if withdrawal address exists
      const withdrawalAddress = getWithdrawalAddress(cryptoSymbol);
      if (!withdrawalAddress) {
        return {
          success: false,
          error: `No withdrawal address available for ${cryptoSymbol}`,
        };
      }

      const { data, error } = await (supabase as any).rpc(
        "create_withdrawal_request",
        {
          p_user_id: userId,
          p_crypto_symbol: cryptoSymbol,
          p_amount: amount,
          p_user_address: userAddress,
        }
      );

      if (error) {
        console.error("Database error creating withdrawal request:", error);
        return {
          success: false,
          error: error.message || "Database error occurred",
        };
      }

      return { success: true, requestId: data };
    } catch (err) {
      console.error("Error creating withdrawal request:", err);
      return {
        success: false,
        error: (err as Error).message || "Unknown error occurred",
      };
    }
  };

  // Refresh user balances (to be called after operations that affect balances)
  const refreshUserBalances = async (userId: string) => {
    try {
      const { data, error } = await (supabase as any)
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Error refreshing user balances:", error);
        return false;
      }

      // Note: This function doesn't update local state directly
      // The calling component should refresh its own user profile data
      return true;
    } catch (err) {
      console.error("Error refreshing user balances:", err);
      return false;
    }
  };

  // Fetch user withdrawal requests
  const fetchUserWithdrawalRequests = async (userId: string) => {
    try {
      console.log("Fetching withdrawal requests for user:", userId);

      const { data, error } = await (supabase as any)
        .from("withdrawal_requests")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching withdrawal requests:", error);
        throw error;
      }

      console.log("Withdrawal requests fetched:", data?.length || 0);

      // Force state update to trigger re-render
      setWithdrawalRequests(data || []);

      // Update refresh timestamp
      setLastRefresh(Date.now());

      console.log("✅ Withdrawal requests state updated");
    } catch (err) {
      console.error("Error fetching withdrawal requests:", err);
    }
  };

  // Fetch all withdrawal requests (for admin)
  const fetchAllWithdrawalRequests = async () => {
    try {
      console.log("Fetching all withdrawal requests for admin");

      const { data, error } = await (supabase as any)
        .from("withdrawal_requests")
        .select(
          `
          *,
          user_profiles!inner(
            user_id,
            email,
            first_name,
            last_name
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching all withdrawal requests:", error);
        throw error;
      }

      console.log("All withdrawal requests fetched:", data?.length || 0);
      return data || [];
    } catch (err) {
      console.error("Error fetching all withdrawal requests:", err);
      return [];
    }
  };

  // Update withdrawal request status (for admin)
  const updateWithdrawalRequestStatus = async (
    requestId: number,
    status: "pending" | "approved" | "rejected" | "processing" | "completed",
    adminNotes?: string,
    transactionHash?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (adminNotes !== undefined) {
        updateData.admin_notes = adminNotes;
      }

      if (transactionHash !== undefined) {
        updateData.transaction_hash = transactionHash;
      }

      const { error } = await (supabase as any)
        .from("withdrawal_requests")
        .update(updateData)
        .eq("id", requestId);

      if (error) {
        console.error("Error updating withdrawal request:", error);
        return {
          success: false,
          error: error.message || "Failed to update withdrawal request",
        };
      }

      console.log("✅ Withdrawal request status updated successfully");
      return { success: true };
    } catch (err) {
      console.error("Error updating withdrawal request status:", err);
      return {
        success: false,
        error: (err as Error).message || "Unknown error occurred",
      };
    }
  };

  // Staking Management Functions (for admin)
  const createStakingSettings = async (settingsData: {
    crypto_symbol: string;
    apy_percentage: number;
    min_stake_amount: number;
    max_stake_amount: number;
    lock_period_days: number;
    reward_frequency: string;
    is_active: boolean;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await (supabase as any)
        .from("staking_settings")
        .insert(settingsData);

      if (error) {
        console.error("Error creating staking settings:", error);
        return {
          success: false,
          error: error.message || "Failed to create staking settings",
        };
      }

      console.log("✅ Staking settings created successfully");
      await fetchCryptoData(); // Refresh data
      return { success: true };
    } catch (err) {
      console.error("Error creating staking settings:", err);
      return {
        success: false,
        error: (err as Error).message || "Unknown error occurred",
      };
    }
  };

  const updateStakingSettings = async (
    settingsId: number,
    settingsData: {
      crypto_symbol: string;
      apy_percentage: number;
      min_stake_amount: number;
      max_stake_amount: number;
      lock_period_days: number;
      reward_frequency: string;
      is_active: boolean;
    }
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await (supabase as any)
        .from("staking_settings")
        .update(settingsData)
        .eq("id", settingsId);

      if (error) {
        console.error("Error updating staking settings:", error);
        return {
          success: false,
          error: error.message || "Failed to update staking settings",
        };
      }

      console.log("✅ Staking settings updated successfully");
      await fetchCryptoData(); // Refresh data
      return { success: true };
    } catch (err) {
      console.error("Error updating staking settings:", err);
      return {
        success: false,
        error: (err as Error).message || "Unknown error occurred",
      };
    }
  };

  const toggleStakingControl = async (
    controlType: string,
    isEnabled: boolean
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await (supabase as any)
        .from("staking_controls")
        .update({ is_enabled: isEnabled, value: isEnabled.toString() })
        .eq("control_type", controlType);

      if (error) {
        console.error("Error toggling staking control:", error);
        return {
          success: false,
          error: error.message || "Failed to toggle staking control",
        };
      }

      console.log("✅ Staking control toggled successfully");
      return { success: true };
    } catch (err) {
      console.error("Error toggling staking control:", err);
      return {
        success: false,
        error: (err as Error).message || "Unknown error occurred",
      };
    }
  };

  useEffect(() => {
    fetchCryptoData();
  }, []);

  return {
    assets,
    depositAddresses,
    stakingSettings,
    withdrawalLimits,
    withdrawalAddresses,
    withdrawalRequests,
    userStaking,
    settings,
    isLoading,
    error,
    lastRefresh, // Add this to help components detect data changes
    fetchCryptoData,
    fetchUserStaking,
    fetchUserWithdrawalRequests,
    fetchAllWithdrawalRequests,
    updateWithdrawalRequestStatus,
    claimWelcomeBonus,
    stakeTokens,
    unstakeTokens,
    getDepositAddress,
    getWithdrawalAddress,
    getWithdrawalLimits,
    getStakingSettings,
    getSetting,
    isWelcomeBonusEnabled,
    getWelcomeBonusAmount,
    createWithdrawalRequest,
    refreshUserBalances,
    // Staking management functions
    createStakingSettings,
    updateStakingSettings,
    toggleStakingControl,
  };
}
