"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Download, Upload, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Toast from "@/components/Toast";

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
}

interface DepositWithdrawalProps {
  assets: CryptoAsset[];
  depositAddresses: DepositAddress[];
  withdrawalLimits: WithdrawalLimits[];
  userBalances: UserBalances;
  onWithdraw: (
    symbol: string,
    amount: number,
    address: string
  ) => Promise<{ success: boolean; error?: any }>;
}

export default function DepositWithdrawal({
  assets,
  depositAddresses,
  withdrawalLimits,
  userBalances,
  onWithdraw,
}: DepositWithdrawalProps) {
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
  const [selectedCrypto, setSelectedCrypto] = useState<string>("PENGU");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as const,
  });

  const getBalanceForAsset = (symbol: string): number => {
    switch (symbol) {
      case "PENGU":
        return userBalances.pengu_tokens;
      case "SOL":
        return userBalances.sol_balance;
      case "ETH":
        return userBalances.eth_balance;
      case "BTC":
        return userBalances.btc_balance;
      case "USDT":
        return userBalances.usdt_balance;
      default:
        return 0;
    }
  };

  const getDepositAddress = (symbol: string): DepositAddress | null => {
    return (
      depositAddresses.find((addr) => addr.crypto_symbol === symbol) || null
    );
  };

  const getWithdrawalLimits = (symbol: string): WithdrawalLimits | null => {
    return (
      withdrawalLimits.find((limit) => limit.crypto_symbol === symbol) || null
    );
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast({
        show: true,
        message: "Address copied to clipboard!",
        type: "success",
      });
    } catch {
      setToast({
        show: true,
        message: "Failed to copy address",
        type: "error",
      });
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      setToast({
        show: true,
        message: "Please enter a valid amount",
        type: "error",
      });
      return;
    }

    if (!withdrawAddress.trim()) {
      setToast({
        show: true,
        message: "Please enter a withdrawal address",
        type: "error",
      });
      return;
    }

    const limits = getWithdrawalLimits(selectedCrypto);
    const balance = getBalanceForAsset(selectedCrypto);

    if (limits) {
      if (amount < limits.min_withdrawal) {
        setToast({
          show: true,
          message: `Minimum withdrawal is ${limits.min_withdrawal} ${selectedCrypto}`,
          type: "error",
        });
        return;
      }

      if (amount > limits.max_withdrawal) {
        setToast({
          show: true,
          message: `Maximum withdrawal is ${limits.max_withdrawal} ${selectedCrypto}`,
          type: "error",
        });
        return;
      }
    }

    if (amount > balance) {
      setToast({
        show: true,
        message: "Insufficient balance",
        type: "error",
      });
      return;
    }

    setIsWithdrawing(true);
    const result = await onWithdraw(selectedCrypto, amount, withdrawAddress);
    setIsWithdrawing(false);

    if (result.success) {
      setToast({
        show: true,
        message: `Withdrawal request submitted for ${amount} ${selectedCrypto}`,
        type: "success",
      });
      setWithdrawAmount("");
      setWithdrawAddress("");
    } else {
      setToast({
        show: true,
        message: "Failed to submit withdrawal request",
        type: "error",
      });
    }
  };

  const depositAddress = getDepositAddress(selectedCrypto);
  const withdrawalLimit = getWithdrawalLimits(selectedCrypto);
  const userBalance = getBalanceForAsset(selectedCrypto);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Deposit & Withdraw
        </h3>
        <div className="flex space-x-1">
          <Button
            variant={activeTab === "deposit" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("deposit")}
          >
            <Download className="h-4 w-4 mr-2" />
            Deposit
          </Button>
          <Button
            variant={activeTab === "withdraw" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("withdraw")}
          >
            <Upload className="h-4 w-4 mr-2" />
            Withdraw
          </Button>
        </div>
      </div>

      {/* Crypto Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Token
        </label>
        <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {assets.map((asset) => (
              <SelectItem key={asset.id} value={asset.symbol}>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: asset.color_hex }}
                  />
                  <span>{asset.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {activeTab === "deposit" ? (
        /* Deposit Section */
        <div>
          {depositAddress ? (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Deposit Address
                </h4>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 bg-white dark:bg-gray-600 px-3 py-2 rounded text-sm font-mono">
                    {depositAddress.address}
                  </code>
                  <Button
                    onClick={() => copyToClipboard(depositAddress.address)}
                    variant="outline"
                    size="sm"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {depositAddress.instructions}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Min: {depositAddress.min_deposit} {selectedCrypto} | Max:{" "}
                  {depositAddress.max_deposit} {selectedCrypto}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                Deposit not available for {selectedCrypto}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Withdrawal Section */
        <div>
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-blue-600 dark:text-blue-300">
                Available Balance: {userBalance.toFixed(8)} {selectedCrypto}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount to Withdraw
              </label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                min={withdrawalLimit?.min_withdrawal || 0}
                max={Math.min(
                  userBalance,
                  withdrawalLimit?.max_withdrawal || userBalance
                )}
                step="0.00000001"
              />
              {withdrawalLimit && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Min: {withdrawalLimit.min_withdrawal} {selectedCrypto} | Max:{" "}
                  {withdrawalLimit.max_withdrawal} {selectedCrypto} | Fee:{" "}
                  {withdrawalLimit.withdrawal_fee} {selectedCrypto}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Withdrawal Address
              </label>
              <Input
                placeholder="Enter {selectedCrypto} address"
                value={withdrawAddress}
                onChange={(e) => setWithdrawAddress(e.target.value)}
              />
            </div>

            <Button
              onClick={handleWithdraw}
              disabled={isWithdrawing || !withdrawAmount || !withdrawAddress}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {isWithdrawing ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Withdraw {selectedCrypto}
            </Button>

            {userBalance < (withdrawalLimit?.min_withdrawal || 0) && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Your balance is low. Contact Support for help.
                </p>
              </div>
            )}
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
