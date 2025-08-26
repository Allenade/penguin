"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Lock, Unlock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Toast from "@/components/Toast";

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

interface StakingSectionProps {
  stakingSettings: StakingSettings | null;
  userStaking: UserStaking[];
  userBalance: number;
  onStake: (amount: number) => Promise<{ success: boolean; error?: any }>;
  onUnstake: (stakingId: number) => Promise<{ success: boolean; error?: any }>;
}

export default function StakingSection({
  stakingSettings,
  userStaking,
  userBalance,
  onStake,
  onUnstake,
}: StakingSectionProps) {
  const [stakeAmount, setStakeAmount] = useState("");
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState<number | null>(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as const,
  });

  const handleStake = async () => {
    const amount = parseFloat(stakeAmount);
    if (!amount || amount <= 0) {
      setToast({
        show: true,
        message: "Please enter a valid amount",
        type: "error",
      });
      return;
    }

    if (amount > userBalance) {
      setToast({
        show: true,
        message: "Insufficient balance",
        type: "error",
      });
      return;
    }

    if (stakingSettings && amount < stakingSettings.min_stake_amount) {
      setToast({
        show: true,
        message: `Minimum stake amount is ${stakingSettings.min_stake_amount} PENGU`,
        type: "error",
      });
      return;
    }

    setIsStaking(true);
    const result = await onStake(amount);
    setIsStaking(false);

    if (result.success) {
      setToast({
        show: true,
        message: `Successfully staked ${amount} PENGU`,
        type: "success",
      });
      setStakeAmount("");
    } else {
      setToast({
        show: true,
        message: "Failed to stake tokens. Please try again.",
        type: "error",
      });
    }
  };

  const handleUnstake = async (stakingId: number) => {
    setIsUnstaking(stakingId);
    const result = await onUnstake(stakingId);
    setIsUnstaking(null);

    if (result.success) {
      setToast({
        show: true,
        message: "Successfully unstaked tokens",
        type: "success",
      });
    } else {
      setToast({
        show: true,
        message: "Failed to unstake tokens. Please try again.",
        type: "error",
      });
    }
  };

  const activeStaking = userStaking.filter((s) => s.status === "active");
  const totalStaked = activeStaking.reduce(
    (sum, s) => sum + s.staked_amount,
    0
  );
  const totalRewards = activeStaking.reduce(
    (sum, s) => sum + s.rewards_earned,
    0
  );

  if (!stakingSettings || !stakingSettings.is_active) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Staking: PENGU
        </h3>
        <TrendingUp className="h-5 w-5 text-green-500" />
      </div>

      {/* Staking Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <p className="text-sm text-blue-600 dark:text-blue-300">APY</p>
          <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
            {stakingSettings.apy_percentage}%
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <p className="text-sm text-green-600 dark:text-green-300">
            Total Staked
          </p>
          <p className="text-xl font-bold text-green-900 dark:text-green-100">
            {totalStaked.toFixed(2)} PENGU
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <p className="text-sm text-purple-600 dark:text-purple-300">
            Rewards Earned
          </p>
          <p className="text-xl font-bold text-purple-900 dark:text-purple-100">
            {totalRewards.toFixed(2)} PENGU
          </p>
        </div>
      </div>

      {/* Stake Form */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
          Stake from Balance
        </h4>
        <div className="flex space-x-3">
          <Input
            type="number"
            placeholder="Amount to stake"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            className="flex-1"
            min={stakingSettings.min_stake_amount}
            max={Math.min(userBalance, stakingSettings.max_stake_amount)}
            step="0.01"
          />
          <Button
            onClick={handleStake}
            disabled={isStaking || !stakeAmount}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isStaking ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Lock className="h-4 w-4 mr-2" />
            )}
            Stake
          </Button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Available: {userBalance.toFixed(2)} PENGU | Min:{" "}
          {stakingSettings.min_stake_amount} PENGU | Max:{" "}
          {stakingSettings.max_stake_amount} PENGU
        </p>
      </div>

      {/* Active Staking */}
      {activeStaking.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
            Active Staking
          </h4>
          <div className="space-y-3">
            {activeStaking.map((staking) => (
              <div
                key={staking.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {staking.staked_amount.toFixed(2)} PENGU
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Staked on {new Date(staking.staked_at).toLocaleDateString()}{" "}
                    | APY: {staking.apy_at_stake}%
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-green-600 dark:text-green-400">
                    +{staking.rewards_earned.toFixed(2)} rewards
                  </span>
                  <Button
                    onClick={() => handleUnstake(staking.id)}
                    disabled={isUnstaking === staking.id}
                    variant="outline"
                    size="sm"
                  >
                    {isUnstaking === staking.id ? (
                      <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Unlock className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
