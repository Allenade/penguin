"use client";
import React from "react";
import { TrendingUp } from "lucide-react";

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

interface UserBalances {
  pengu_tokens: number;
  sol_balance: number;
  eth_balance: number;
  btc_balance: number;
  usdt_balance: number;
  staked_pengu: number;
  staking_rewards: number;
}

interface AssetsDisplayProps {
  assets: CryptoAsset[];
  balances: UserBalances;
}

export default function AssetsDisplay({
  assets,
  balances,
}: AssetsDisplayProps) {
  const getBalanceForAsset = (symbol: string): number => {
    switch (symbol) {
      case "PENGU":
        return balances.pengu_tokens;
      case "SOL":
        return balances.sol_balance;
      case "ETH":
        return balances.eth_balance;
      case "BTC":
        return balances.btc_balance;
      case "USDT":
        return balances.usdt_balance;
      default:
        return 0;
    }
  };

  const formatBalance = (balance: number, decimals: number): string => {
    if (balance === 0) return "0.00";

    // Format based on decimals
    const formatted = balance.toFixed(decimals);
    // Remove trailing zeros after decimal
    return formatted.replace(/\.?0+$/, "");
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Assets
        </h3>
        <TrendingUp className="h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {assets.map((asset) => {
          const balance = getBalanceForAsset(asset.symbol);
          const formattedBalance = formatBalance(balance, asset.decimals);

          return (
            <div
              key={asset.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: asset.color_hex }}
                >
                  {asset.symbol.charAt(0)}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    {asset.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {asset.symbol}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {formattedBalance}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {asset.symbol}
                </p>
              </div>
            </div>
          );
        })}

        {/* Staking Information */}
        {balances.staked_pengu > 0 && (
          <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                S
              </div>
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                  Staked PENGU
                </h4>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  Earning rewards
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-blue-900 dark:text-blue-100">
                {formatBalance(balances.staked_pengu, 8)}
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-300">
                +{formatBalance(balances.staking_rewards, 8)} rewards
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
