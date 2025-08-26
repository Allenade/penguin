"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserAuth } from "@/lib/hooks/useUserAuth";
import { useCrypto } from "@/lib/hooks/useCrypto";
import Toast from "@/components/Toast";

import { Upload, AlertTriangle, CheckCircle } from "lucide-react";

export default function WithdrawPage() {
  const [selectedToken, setSelectedToken] = useState("PENGU");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const { userProfile } = useUserAuth();
  const {
    withdrawalLimits,
    withdrawalAddresses,
    getWithdrawalAddress,
    createWithdrawalRequest,
    fetchUserWithdrawalRequests,
    withdrawalRequests,
  } = useCrypto();

  const getWithdrawalLimit = (symbol: string) => {
    // Use withdrawal addresses table for min/max limits
    const withdrawalAddress = withdrawalAddresses.find(
      (addr) => addr.crypto_symbol === symbol
    );
    if (withdrawalAddress) {
      return {
        crypto_symbol: symbol,
        min_withdrawal: withdrawalAddress.min_withdrawal,
        max_withdrawal: withdrawalAddress.max_withdrawal,
        daily_limit: withdrawalAddress.daily_limit,
      };
    }
    // Fallback to withdrawal limits table
    return withdrawalLimits.find((limit) => limit.crypto_symbol === symbol);
  };

  const getTokenBalance = (symbol: string) => {
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

  const getTokenIcon = (symbol: string) => {
    // First check if there's a custom icon from withdrawal addresses
    const withdrawalAddress = getWithdrawalAddress(symbol);
    if (
      withdrawalAddress?.icon_url &&
      withdrawalAddress.icon_url.trim() !== ""
    ) {
      return (
        <img
          src={withdrawalAddress.icon_url}
          alt={symbol}
          className="w-8 h-8 rounded-full object-cover"
          onError={(e) => {
            console.log(
              `Image failed to load for ${symbol}, using emoji fallback`
            );
            // Fallback to emoji if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            // Show emoji fallback
            const emojiSpan = document.createElement("span");
            emojiSpan.textContent = getEmojiIcon(symbol);
            emojiSpan.className = "text-2xl";
            target.parentNode?.appendChild(emojiSpan);
          }}
          onLoad={() => {
            console.log(`Image loaded successfully for ${symbol}`);
          }}
        />
      );
    }

    // Fallback to emoji icons
    return getEmojiIcon(symbol);
  };

  const getEmojiIcon = (symbol: string) => {
    switch (symbol) {
      case "PENGU":
        return "🐧";
      case "USDT":
        return "💚";
      case "SOL":
        return "🔵";
      case "ETH":
        return "🟠";
      case "BTC":
        return "🟡";
      default:
        return "💰";
    }
  };

  const handleWithdraw = async () => {
    const withdrawAmount = parseFloat(amount);
    const balance = getTokenBalance(selectedToken);
    const limit = getWithdrawalLimit(selectedToken);
    const withdrawalAddress = getWithdrawalAddress(selectedToken);

    if (!withdrawAmount || withdrawAmount <= 0) {
      setToast({
        show: true,
        message: "Please enter a valid amount",
        type: "error",
      });
      return;
    }

    if (withdrawAmount > balance) {
      setToast({
        show: true,
        message: "Insufficient balance",
        type: "error",
      });
      return;
    }

    if (limit) {
      if (withdrawAmount < limit.min_withdrawal) {
        setToast({
          show: true,
          message: `Minimum withdrawal is ${limit.min_withdrawal} ${selectedToken}`,
          type: "error",
        });
        return;
      }

      if (withdrawAmount > limit.max_withdrawal) {
        setToast({
          show: true,
          message: `Maximum withdrawal is ${limit.max_withdrawal} ${selectedToken}`,
          type: "error",
        });
        return;
      }
    }

    if (!address.trim()) {
      setToast({
        show: true,
        message: "Please enter a valid address",
        type: "error",
      });
      return;
    }

    if (!withdrawalAddress) {
      setToast({
        show: true,
        message: `No withdrawal address available for ${selectedToken}`,
        type: "error",
      });
      return;
    }

    setIsWithdrawing(true);

    try {
      const result = await createWithdrawalRequest(
        userProfile?.user_id || "",
        selectedToken,
        withdrawAmount,
        address
      );

      if (result.success) {
        setToast({
          show: true,
          message: `Withdrawal request submitted for ${withdrawAmount} ${selectedToken}. Request ID: ${result.requestId}`,
          type: "success",
        });
        setAmount("");
        setAddress("");

        // Refresh withdrawal requests
        if (userProfile?.user_id) {
          await fetchUserWithdrawalRequests(userProfile.user_id);
        }
      } else {
        setToast({
          show: true,
          message: result.error || "Failed to submit withdrawal request",
          type: "error",
        });
      }
    } catch {
      setToast({
        show: true,
        message: "An error occurred while submitting withdrawal request",
        type: "error",
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  const balance = getTokenBalance(selectedToken);
  const limit = getWithdrawalLimit(selectedToken);

  // Fetch withdrawal requests when component loads
  useEffect(() => {
    if (userProfile?.user_id) {
      fetchUserWithdrawalRequests(userProfile.user_id);
    }
  }, [userProfile?.user_id, fetchUserWithdrawalRequests]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Withdraw</h2>
        <Upload className="h-6 w-6 text-red-500" />
      </div>

      {/* Token Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Token</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {withdrawalAddresses.map((address) => (
            <button
              key={address.crypto_symbol}
              onClick={() => setSelectedToken(address.crypto_symbol)}
              className={`p-4 rounded-lg border transition-colors ${
                selectedToken === address.crypto_symbol
                  ? "bg-red-600 border-red-500 text-white"
                  : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <div className="text-2xl mb-2">
                {getTokenIcon(address.crypto_symbol)}
              </div>
              <div className="text-sm font-medium">{address.crypto_symbol}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Balance and Limits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-sm text-gray-400">Available Balance</p>
          <p className="text-xl font-bold">
            {balance.toFixed(4)} {selectedToken}
          </p>
        </div>
        {limit && (
          <>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Min Withdrawal</p>
              <p className="text-xl font-bold">
                {limit.min_withdrawal} {selectedToken}
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Max Withdrawal</p>
              <p className="text-xl font-bold">
                {limit.max_withdrawal} {selectedToken}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Withdrawal Form */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Withdraw {selectedToken}</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Amount
            </label>
            <Input
              type="number"
              placeholder={`Enter amount in ${selectedToken}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              min={limit?.min_withdrawal || 0}
              max={Math.min(balance, limit?.max_withdrawal || balance)}
              step="0.0001"
            />
            <p className="text-xs text-gray-400 mt-1">
              Available: {balance.toFixed(4)} {selectedToken}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {selectedToken} Address
            </label>
            <Input
              type="text"
              placeholder={`Enter ${selectedToken} address`}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          {/* Balance Check */}
          {balance < (limit?.min_withdrawal || 0) ? (
            <div className="bg-red-900/20 p-4 rounded-lg border border-red-700">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <span className="text-red-200">Your balance is low</span>
              </div>
              <p className="text-sm text-red-300 mt-1">
                Minimum withdrawal: {limit?.min_withdrawal} {selectedToken}
              </p>
            </div>
          ) : (
            <div className="bg-green-900/20 p-4 rounded-lg border border-green-700">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-green-200">Contact Support for help</span>
              </div>
              <p className="text-sm text-green-300 mt-1">
                Your balance meets the minimum withdrawal requirement
              </p>
            </div>
          )}

          <Button
            onClick={handleWithdraw}
            disabled={
              isWithdrawing ||
              !amount ||
              !address ||
              balance < (limit?.min_withdrawal || 0)
            }
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600"
          >
            {isWithdrawing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Withdraw {selectedToken}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Recent Withdrawals */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Recent Withdrawals</h3>
        <div className="bg-gray-800 rounded-lg p-6">
          {withdrawalRequests.length > 0 ? (
            <div className="space-y-3">
              {withdrawalRequests.slice(0, 5).map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {request.amount} {request.crypto_symbol}
                    </p>
                    <p className="text-sm text-gray-400">
                      To: {request.user_address.slice(0, 8)}...
                      {request.user_address.slice(-8)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(request.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        request.status === "completed"
                          ? "bg-green-900 text-green-200"
                          : request.status === "pending"
                          ? "bg-yellow-900 text-yellow-200"
                          : request.status === "processing"
                          ? "bg-blue-900 text-blue-200"
                          : "bg-red-900 text-red-200"
                      }`}
                    >
                      {request.status}
                    </span>
                    {request.transaction_hash && (
                      <p className="text-xs text-gray-400 mt-1">
                        TX: {request.transaction_hash.slice(0, 8)}...
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <p>No recent withdrawals</p>
              <p className="text-sm">
                Your withdrawal history will appear here
              </p>
            </div>
          )}
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
