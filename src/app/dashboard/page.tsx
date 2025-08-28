"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Toast from "@/components/Toast";
import { useUserAuth } from "@/lib/hooks/useUserAuth";
import { useCrypto } from "@/lib/hooks/useCrypto";
import WelcomeBonus from "@/components/WelcomeBonus";
import { useRouter } from "next/navigation";

import { Wallet, Plus, Minus, CheckCircle, Lock, X } from "lucide-react";

export default function DashboardPage() {
  const [showStakingModal, setShowStakingModal] = useState(false);
  const [stakeAmount, setStakeAmount] = useState("");
  const [isStaking, setIsStaking] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const { user, userProfile, refreshUserProfile } = useUserAuth();
  const router = useRouter();
  const {
    isLoading: cryptoLoading,
    fetchUserStaking,
    claimWelcomeBonus,
    stakeTokens,

    getStakingSettings,
    isWelcomeBonusEnabled,
    getWelcomeBonusAmount,
  } = useCrypto();

  // Show welcome toast when user is loaded
  useEffect(() => {
    if (user && userProfile) {
      setToast({
        show: true,
        message: `Welcome back, ${userProfile.wallet_username}!`,
        type: "success",
      });
    }
  }, [user, userProfile]);

  // Fetch user staking data when user is available
  useEffect(() => {
    if (user?.id) {
      fetchUserStaking(user.id);
    }
  }, [user?.id, fetchUserStaking]);

  // Periodic refresh of user profile to catch admin updates
  useEffect(() => {
    if (!user?.id) return;

    const interval = setInterval(() => {
      refreshUserProfile();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [user?.id, refreshUserProfile]);

  const handleClaimWelcomeBonus = async () => {
    if (!user?.id) return { success: false };
    return await claimWelcomeBonus(user.id);
  };

  const handleStake = async (amount: number) => {
    if (!user?.id) return { success: false };
    return await stakeTokens(user.id, "PENGU", amount);
  };

  const handleStakeSubmit = async () => {
    const amount = parseFloat(stakeAmount);
    if (!amount || amount <= 0) {
      setToast({
        show: true,
        message: "Please enter a valid amount",
        type: "error",
      });
      return;
    }

    if (amount > (userProfile?.pengu_tokens || 0)) {
      setToast({
        show: true,
        message: "Insufficient PENGU balance",
        type: "error",
      });
      return;
    }

    const stakingSetting = getStakingSettings("PENGU");
    if (stakingSetting) {
      if (amount < stakingSetting.min_stake_amount) {
        setToast({
          show: true,
          message: `Minimum stake amount is ${stakingSetting.min_stake_amount} PENGU`,
          type: "error",
        });
        return;
      }

      if (amount > stakingSetting.max_stake_amount) {
        setToast({
          show: true,
          message: `Maximum stake amount is ${stakingSetting.max_stake_amount} PENGU`,
          type: "error",
        });
        return;
      }
    }

    setIsStaking(true);
    const result = await handleStake(amount);
    setIsStaking(false);

    if (result.success) {
      setToast({
        show: true,
        message: `Successfully staked ${amount} PENGU`,
        type: "success",
      });
      setStakeAmount("");
      setShowStakingModal(false);
    } else {
      setToast({
        show: true,
        message: "Failed to stake tokens. Please try again.",
        type: "error",
      });
    }
  };

  if (cryptoLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Welcome Bonus - Only show if enabled and not claimed */}
      {isWelcomeBonusEnabled() && !userProfile?.welcome_bonus_claimed && (
        <div>
          <WelcomeBonus
            isEnabled={isWelcomeBonusEnabled()}
            amount={getWelcomeBonusAmount()}
            isClaimed={userProfile?.welcome_bonus_claimed || false}
            onClaim={handleClaimWelcomeBonus}
          />
        </div>
      )}

      {/* Staking Modal */}
      {showStakingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Stake PENGU</h3>
              <button
                onClick={() => setShowStakingModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount to Stake
                </label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  min={getStakingSettings("PENGU")?.min_stake_amount || 0}
                  max={Math.min(
                    userProfile?.pengu_tokens || 0,
                    getStakingSettings("PENGU")?.max_stake_amount || 0
                  )}
                  step="0.01"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Available: {(userProfile?.pengu_tokens || 0).toFixed(2)} PENGU
                </p>
                {getStakingSettings("PENGU") && (
                  <p className="text-xs text-gray-400">
                    Min: {getStakingSettings("PENGU")?.min_stake_amount} PENGU |
                    Max: {getStakingSettings("PENGU")?.max_stake_amount} PENGU |
                    APY: {getStakingSettings("PENGU")?.apy_percentage}%
                  </p>
                )}
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={handleStakeSubmit}
                  disabled={isStaking || !stakeAmount}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isStaking ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Lock className="h-4 w-4 mr-2" />
                  )}
                  Stake
                </Button>
                <Button
                  onClick={() => setShowStakingModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Row - Balance and Crypto */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Total Balance */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Balance</p>
                <p className="text-xl lg:text-2xl font-bold">
                  ${(userProfile?.total_balance || 0).toFixed(2)}
                </p>
              </div>
            </div>
            <Button className="bg-green-500 hover:bg-green-600 text-white px-3 lg:px-4 py-2 rounded-lg text-sm font-medium">
              Live
            </Button>
          </div>
        </div>

        {/* Cryptocurrency Balances */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="space-y-4">
            {/* Bitcoin (BTC) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm lg:text-base">
                    Bitcoin
                  </span>
                  <span className="text-gray-400 text-xs lg:text-sm">BTC</span>
                  <span className="text-base lg:text-lg font-bold">
                    {(userProfile?.btc_balance || 0).toFixed(8)}
                  </span>
                </div>
              </div>
              <div className="flex space-x-1 lg:space-x-2">
                <Button
                  onClick={() => router.push("/dashboard/deposit")}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-2 lg:px-3 py-1 rounded text-xs lg:text-sm"
                >
                  Deposit
                </Button>
                <Button
                  onClick={() => router.push("/dashboard/withdraw")}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-2 lg:px-3 py-1 rounded text-xs lg:text-sm"
                >
                  Withdraw
                </Button>
              </div>
            </div>

            {/* Ethereum (ETH) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm lg:text-base">
                    Ethereum
                  </span>
                  <span className="text-gray-400 text-xs lg:text-sm">ETH</span>
                  <span className="text-base lg:text-lg font-bold">
                    {(userProfile?.eth_balance || 0).toFixed(8)}
                  </span>
                </div>
              </div>
              <div className="flex space-x-1 lg:space-x-2">
                <Button
                  onClick={() => router.push("/dashboard/deposit")}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-2 lg:px-3 py-1 rounded text-xs lg:text-sm"
                >
                  Deposit
                </Button>
                <Button
                  onClick={() => router.push("/dashboard/withdraw")}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-2 lg:px-3 py-1 rounded text-xs lg:text-sm"
                >
                  Withdraw
                </Button>
              </div>
            </div>

            {/* Solana (SOL) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm lg:text-base">
                    Solana
                  </span>
                  <span className="text-gray-400 text-xs lg:text-sm">SOL</span>
                  <span className="text-base lg:text-lg font-bold">
                    {(userProfile?.sol_balance || 0).toFixed(8)}
                  </span>
                </div>
              </div>
              <div className="flex space-x-1 lg:space-x-2">
                <Button
                  onClick={() => router.push("/dashboard/deposit")}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-2 lg:px-3 py-1 rounded text-xs lg:text-sm"
                >
                  Deposit
                </Button>
                <Button
                  onClick={() => router.push("/dashboard/withdraw")}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-2 lg:px-3 py-1 rounded text-xs lg:text-sm"
                >
                  Withdraw
                </Button>
              </div>
            </div>

            {/* PENGU Token */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm lg:text-base">
                    Pudgy Penguins{" "}
                  </span>
                  <span className="text-gray-400 text-xs lg:text-sm">
                    PENGU
                  </span>
                  <span className="text-base lg:text-lg font-bold">
                    {(userProfile?.pengu_tokens || 0).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex space-x-1 lg:space-x-2">
                <Button
                  onClick={() => router.push("/dashboard/deposit")}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-2 lg:px-3 py-1 rounded text-xs lg:text-sm"
                >
                  Deposit
                </Button>
                <Button
                  onClick={() => router.push("/dashboard/withdraw")}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-2 lg:px-3 py-1 rounded text-xs lg:text-sm"
                >
                  Withdraw
                </Button>
              </div>
            </div>

            {/* USDT */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm lg:text-base">USDT</span>
                  <span className="text-gray-400 text-xs lg:text-sm">USDT</span>
                  <span className="text-base lg:text-lg font-bold">
                    {(userProfile?.usdt_balance || 0).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex space-x-1 lg:space-x-2">
                <Button
                  onClick={() => router.push("/dashboard/deposit")}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-2 lg:px-3 py-1 rounded text-xs lg:text-sm"
                >
                  Deposit
                </Button>
                <Button
                  onClick={() => router.push("/dashboard/withdraw")}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-2 lg:px-3 py-1 rounded text-xs lg:text-sm"
                >
                  Withdraw
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row - TRADES and ACCOUNT SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* TRADES Section */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Trading Activity</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 text-xs lg:text-sm font-medium text-gray-400">
                    Type
                  </th>
                  <th className="text-left py-2 text-xs lg:text-sm font-medium text-gray-400">
                    Token
                  </th>
                  <th className="text-left py-2 text-xs lg:text-sm font-medium text-gray-400">
                    Action
                  </th>
                  <th className="text-left py-2 text-xs lg:text-sm font-medium text-gray-400">
                    Amount
                  </th>
                  <th className="text-left py-2 text-xs lg:text-sm font-medium text-gray-400">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-gray-400 text-sm lg:text-base"
                  >
                    No Recent PENGU Activity
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ACCOUNT SUMMARY Section */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Trading Summary</h3>
          <div className="space-y-4">
            {/* Total Deposits */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Plus className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-xs lg:text-sm text-gray-400">
                    Total Deposits
                  </p>
                  <p className="font-bold text-sm lg:text-base">
                    ${(userProfile?.total_investment || 0).toFixed(2)}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => router.push("/dashboard/deposit")}
                className="bg-orange-500 hover:bg-orange-600 text-white px-2 lg:px-3 py-1 rounded text-xs lg:text-sm"
              >
                Deposit
              </Button>
            </div>

            {/* Total Withdrawals */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Minus className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-xs lg:text-sm text-gray-400">
                    Total Withdrawals
                  </p>
                  <p className="font-bold text-sm lg:text-base">$0.00</p>
                </div>
              </div>
              <Button
                onClick={() => router.push("/dashboard/withdraw")}
                className="bg-orange-500 hover:bg-orange-600 text-white px-2 lg:px-3 py-1 rounded text-xs lg:text-sm"
              >
                Withdraw
              </Button>
            </div>

            {/* Staking Rewards */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Plus className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-xs lg:text-sm text-gray-400">
                    Staking Rewards
                  </p>
                  <p className="font-bold text-sm lg:text-base">
                    {(userProfile?.staking_rewards || 0).toFixed(2)} PENGU
                  </p>
                </div>
              </div>
              <Button
                onClick={() => router.push("/dashboard/staking")}
                className="bg-orange-500 hover:bg-orange-600 text-white px-2 lg:px-3 py-1 rounded text-xs lg:text-sm"
              >
                View
              </Button>
            </div>

            {/* Verification */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-xs lg:text-sm text-gray-400">
                    Verification
                  </p>
                  <p className="text-xs lg:text-sm">
                    {userProfile?.is_verified
                      ? "Account verified"
                      : "Your account is not verified."}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => router.push("/dashboard/verify")}
                className="bg-orange-500 hover:bg-orange-600 text-white px-2 lg:px-3 py-1 rounded text-xs lg:text-sm"
              >
                {userProfile?.is_verified ? "Verified" : "Verify"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Trading Instruments */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">PENGU Trading Pairs</h3>
        <div className="space-y-3">
          {/* PENGU/USDT */}
          <div className="bg-gray-800 rounded-lg p-4 flex items-center space-x-3">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm lg:text-base">
                  PENGU/USDT
                </span>
                <span className="text-green-500">↗</span>
              </div>
              <p className="text-gray-400 text-xs lg:text-sm">
                Main Trading Pair
              </p>
            </div>
            <div className="text-gray-400 text-xs">Live</div>
          </div>

          {/* PENGU/ETH */}
          <div className="bg-gray-800 rounded-lg p-4 flex items-center space-x-3">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm lg:text-base">
                  PENGU/ETH
                </span>
                <span className="text-green-500">↗</span>
              </div>
              <p className="text-gray-400 text-xs lg:text-sm">Ethereum Pair</p>
            </div>
            <div className="text-gray-400 text-xs">Live</div>
          </div>

          {/* PENGU/BTC */}
          <div className="bg-gray-800 rounded-lg p-4 flex items-center space-x-3">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm lg:text-base">
                  PENGU/BTC
                </span>
                <span className="text-green-500">↗</span>
              </div>
              <p className="text-gray-400 text-xs lg:text-sm">Bitcoin Pair</p>
            </div>
            <div className="text-gray-400 text-xs">Live</div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
