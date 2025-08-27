"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserAuth } from "@/lib/hooks/useUserAuth";
import { useCrypto } from "@/lib/hooks/useCrypto";
import Toast from "@/components/Toast";

import { Lock, Unlock, TrendingUp, X } from "lucide-react";

export default function StakingPage() {
  const [showStakingModal, setShowStakingModal] = useState(false);
  const [stakeAmount, setStakeAmount] = useState("");
  const [isStaking, setIsStaking] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const { user, userProfile, refreshUserProfile } = useUserAuth();
  const { userStaking, getStakingSettings, stakeTokens, unstakeTokens } =
    useCrypto();

  // Periodic refresh of user profile to catch admin updates
  useEffect(() => {
    const interval = setInterval(() => {
      refreshUserProfile();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [refreshUserProfile]);

  const handleStake = async (amount: number) => {
    if (!user?.id) return { success: false };
    return await stakeTokens(user.id, "PENGU", amount);
  };

  const handleUnstake = async (stakingId: number) => {
    if (!user?.id) return { success: false };
    return await unstakeTokens(stakingId, user.id);
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

  const stakingSetting = getStakingSettings("PENGU");
  const activeStaking = userStaking.filter((s) => s.status === "active");
  const totalStaked = activeStaking.reduce(
    (sum, s) => sum + s.staked_amount,
    0
  );
  const totalRewards = activeStaking.reduce(
    (sum, s) => sum + s.rewards_earned,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Staking: PENGU</h2>
        <TrendingUp className="h-6 w-6 text-green-500" />
      </div>

      {/* Staking Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-700">
          <p className="text-sm text-blue-300">APY</p>
          <p className="text-xl font-bold text-blue-100">
            {stakingSetting?.apy_percentage || 0}%
          </p>
        </div>
        <div className="bg-green-900/20 p-4 rounded-lg border border-green-700">
          <p className="text-sm text-green-300">Total Staked</p>
          <p className="text-xl font-bold text-green-100">
            {totalStaked.toFixed(2)} PENGU
          </p>
        </div>
        <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-700">
          <p className="text-sm text-purple-300">Rewards Earned</p>
          <p className="text-xl font-bold text-purple-100">
            {totalRewards.toFixed(2)} PENGU
          </p>
        </div>
      </div>

      {/* Stake Button */}
      <div>
        <Button
          onClick={() => setShowStakingModal(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Lock className="h-4 w-4 mr-2" />
          Stake PENGU
        </Button>
      </div>

      {/* Active Staking */}
      {activeStaking.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Active Staking</h3>
          <div className="space-y-3">
            {activeStaking.map((staking) => (
              <div
                key={staking.id}
                className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
              >
                <div>
                  <p className="font-medium">
                    {staking.staked_amount.toFixed(2)} PENGU
                  </p>
                  <p className="text-sm text-gray-400">
                    Staked on {new Date(staking.staked_at).toLocaleDateString()}{" "}
                    | APY: {staking.apy_at_stake}%
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-green-400">
                    +{staking.rewards_earned.toFixed(2)} rewards
                  </span>
                  <Button
                    onClick={() => handleUnstake(staking.id)}
                    variant="outline"
                    size="sm"
                  >
                    <Unlock className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Staking Modal */}
      {showStakingModal && (
        <div className="fixed inset-0  bg-opacity-50 z-50 flex items-center justify-center p-4">
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
                  min={stakingSetting?.min_stake_amount || 0}
                  max={Math.min(
                    userProfile?.pengu_tokens || 0,
                    stakingSetting?.max_stake_amount || 0
                  )}
                  step="0.01"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Available: {(userProfile?.pengu_tokens || 0).toFixed(2)} PENGU
                </p>
                {stakingSetting && (
                  <p className="text-xs text-gray-400">
                    Min: {stakingSetting.min_stake_amount} PENGU | Max:{" "}
                    {stakingSetting.max_stake_amount} PENGU | APY:{" "}
                    {stakingSetting.apy_percentage}%
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
