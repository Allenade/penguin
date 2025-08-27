"use client";
import React, { useEffect } from "react";
import { useUserAuth } from "@/lib/hooks/useUserAuth";
import { useCrypto } from "@/lib/hooks/useCrypto";

import { Bitcoin, Zap, TrendingUp, DollarSign } from "lucide-react";

export default function HoldingsPage() {
  const { userProfile, refreshUserProfile } = useUserAuth();
  const { assets } = useCrypto();

  // Periodic refresh of user profile to catch admin updates
  useEffect(() => {
    const interval = setInterval(() => {
      refreshUserProfile();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [refreshUserProfile]);

  // Simple price management - we'll replace this with Supabase data later
  const getAssetPrice = (symbol: string): number => {
    const prices: Record<string, number> = {
      PENGU: 0.15, // $0.15 per PENGU
      USDT: 1.0, // $1.00 per USDT
      SOL: 85.5, // $85.50 per SOL
      ETH: 3200.0, // $3200 per ETH
      BTC: 65000.0, // $65000 per BTC
    };
    return prices[symbol] || 0;
  };

  // Debug: Log what data we have
  console.log("Holdings Page Data:", {
    userProfile,
    assets: assets.map((a) => ({ symbol: a.symbol, name: a.name })),
    balances: {
      PENGU: userProfile?.pengu_tokens || 0,
      USDT: userProfile?.usdt_balance || 0,
      SOL: userProfile?.sol_balance || 0,
      ETH: userProfile?.eth_balance || 0,
      BTC: userProfile?.btc_balance || 0,
    },
    staking: {
      staked_pengu: userProfile?.staked_pengu || 0,
      staking_rewards: userProfile?.staking_rewards || 0,
    },
  });

  const getAssetIcon = (symbol: string) => {
    switch (symbol) {
      case "PENGU":
        return <Bitcoin className="h-5 w-5 text-purple-500" />;
      case "USDT":
        return <Zap className="h-5 w-5 text-green-500" />;
      case "SOL":
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case "ETH":
        return <DollarSign className="h-5 w-5 text-orange-500" />;
      case "BTC":
        return <Bitcoin className="h-5 w-5 text-yellow-500" />;
      default:
        return <DollarSign className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAssetBalance = (symbol: string) => {
    switch (symbol) {
      case "PENGU":
        return userProfile?.pengu_tokens || 0;
      case "USDT":
        return userProfile?.usdt_balance || 0;
      case "SOL":
        return userProfile?.sol_balance || 0;
      case "ETH":
        return userProfile?.eth_balance || 0;
      case "BTC":
        return userProfile?.btc_balance || 0;
      default:
        return 0;
    }
  };

  // Calculate total portfolio value
  const calculateTotalValue = () => {
    let total = 0;
    assets.forEach((asset) => {
      const balance = getAssetBalance(asset.symbol);
      const price = getAssetPrice(asset.symbol);
      total += balance * price;
    });
    return total;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">PENGU Holdings</h2>
        <TrendingUp className="h-6 w-6 text-green-500" />
      </div>

      {/* Total Portfolio Value */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-2">
          Total Portfolio Value
        </h3>
        <p className="text-3xl font-bold text-white">
          ${(userProfile?.total_balance || calculateTotalValue()).toFixed(2)}
        </p>
        <p className="text-blue-100 text-sm">All your crypto assets combined</p>
      </div>

      {/* Asset Holdings */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Your Assets</h3>
        <div className="space-y-3">
          {assets.map((asset) => {
            const balance = getAssetBalance(asset.symbol);
            const price = getAssetPrice(asset.symbol);
            const value = balance * price;

            return (
              <div
                key={asset.symbol}
                className="bg-gray-800 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-700 p-2 rounded-lg">
                    {getAssetIcon(asset.symbol)}
                  </div>
                  <div>
                    <p className="font-medium">{asset.name}</p>
                    <p className="text-sm text-gray-400">{asset.symbol}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-medium">
                    {balance.toFixed(4)} {asset.symbol}
                  </p>
                  <p className="text-sm text-gray-400">${value.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">@ ${price.toFixed(2)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Staking Summary */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Staking Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-900/20 p-4 rounded-lg border border-green-700">
            <p className="text-sm text-green-300">Staked PENGU</p>
            <p className="text-xl font-bold text-green-100">
              {(userProfile?.staked_pengu || 0).toFixed(2)} PENGU
            </p>
            <p className="text-xs text-green-400">
              $
              {(
                (userProfile?.staked_pengu || 0) * getAssetPrice("PENGU")
              ).toFixed(2)}
            </p>
          </div>
          <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-700">
            <p className="text-sm text-purple-300">Staking Rewards</p>
            <p className="text-xl font-bold text-purple-100">
              {(userProfile?.staking_rewards || 0).toFixed(2)} PENGU
            </p>
            <p className="text-xs text-purple-400">
              $
              {(
                (userProfile?.staking_rewards || 0) * getAssetPrice("PENGU")
              ).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Investment Summary */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Investment Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-700">
            <p className="text-sm text-blue-300">Total Investment</p>
            <p className="text-xl font-bold text-blue-100">
              ${(userProfile?.total_investment || 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-orange-900/20 p-4 rounded-lg border border-orange-700">
            <p className="text-sm text-orange-300">Total Withdrawals</p>
            <p className="text-xl font-bold text-orange-100">$0.00</p>
          </div>
        </div>
      </div>
    </div>
  );
}
