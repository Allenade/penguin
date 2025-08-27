"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCrypto } from "@/lib/hooks/useCrypto";
import Toast from "@/components/Toast";

import { Copy, Download, QrCode } from "lucide-react";

export default function DepositPage() {
  const [selectedToken, setSelectedToken] = useState("PENGU");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const { assets, depositAddresses } = useCrypto();

  // Set initial selected token when deposit addresses load
  React.useEffect(() => {
    if (depositAddresses.length > 0 && !selectedToken) {
      const firstAddress = depositAddresses[0];
      setSelectedToken(`${firstAddress.crypto_symbol}-${firstAddress.id}`);
    }
  }, [depositAddresses, selectedToken]);

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

  const getDepositAddress = (tokenId: string) => {
    // Handle the new format: "SYMBOL-ID"
    if (tokenId.includes("-")) {
      const [symbol, id] = tokenId.split("-");
      return depositAddresses.find(
        (addr) => addr.crypto_symbol === symbol && addr.id.toString() === id
      );
    }
    // Fallback for old format
    return depositAddresses.find((addr) => addr.crypto_symbol === tokenId);
  };

  const getTokenIcon = (symbol: string) => {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Deposit</h2>
        <Download className="h-6 w-6 text-green-500" />
      </div>

      {/* Token Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Token</h3>
        {depositAddresses.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {depositAddresses.map((address) => (
              <button
                key={`${address.crypto_symbol}-${address.id}`}
                onClick={() =>
                  setSelectedToken(`${address.crypto_symbol}-${address.id}`)
                }
                className={`p-4 rounded-lg border transition-colors ${
                  selectedToken === `${address.crypto_symbol}-${address.id}`
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <div className="text-2xl mb-2">
                  {address.icon_url ? (
                    <img
                      src={address.icon_url}
                      alt={address.crypto_symbol}
                      className="w-8 h-8 mx-auto rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const emojiSpan = document.createElement("span");
                        emojiSpan.textContent = getTokenIcon(
                          address.crypto_symbol
                        );
                        emojiSpan.className = "text-2xl";
                        target.parentNode?.appendChild(emojiSpan);
                      }}
                    />
                  ) : (
                    getTokenIcon(address.crypto_symbol)
                  )}
                </div>
                <div className="text-sm font-medium">
                  {address.crypto_symbol}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <p className="text-gray-400 mb-2">No deposit addresses available</p>
            <p className="text-sm text-gray-500">
              Please check with admin to configure deposit addresses
            </p>
          </div>
        )}
      </div>

      {/* Deposit Address */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Deposit {selectedToken}</h3>

        {getDepositAddress(selectedToken) ? (
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">
                {getDepositAddress(selectedToken)?.icon_url ? (
                  <img
                    src={getDepositAddress(selectedToken)?.icon_url}
                    alt={selectedToken}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const emojiSpan = document.createElement("span");
                      emojiSpan.textContent = getTokenIcon(selectedToken);
                      emojiSpan.className = "text-2xl";
                      target.parentNode?.appendChild(emojiSpan);
                    }}
                  />
                ) : (
                  getTokenIcon(selectedToken)
                )}
              </span>
              <div>
                <span className="font-medium">{selectedToken} Address</span>
                <div className="text-sm text-gray-400">
                  Network:{" "}
                  {getDepositAddress(selectedToken)?.network || "mainnet"}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* QR Code Placeholder */}
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">QR Code</p>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Deposit Address
                </label>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 bg-gray-700 px-3 py-2 rounded text-sm font-mono text-gray-100 break-all">
                    {getDepositAddress(selectedToken)?.address}
                  </code>
                  <Button
                    onClick={() =>
                      copyToClipboard(
                        getDepositAddress(selectedToken)?.address || ""
                      )
                    }
                    variant="outline"
                    size="sm"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-700">
                <h4 className="font-medium text-blue-100 mb-2">
                  Deposit Instructions
                </h4>
                {getDepositAddress(selectedToken)?.instructions ? (
                  <div className="text-sm text-blue-200 whitespace-pre-line">
                    {getDepositAddress(selectedToken)?.instructions}
                  </div>
                ) : (
                  <ul className="text-sm text-blue-200 space-y-1">
                    <li>• Send only {selectedToken} to this address</li>
                    <li>
                      • Minimum deposit:{" "}
                      {getDepositAddress(selectedToken)?.min_deposit || "0.001"}{" "}
                      {selectedToken}
                    </li>
                    <li>
                      • Maximum deposit:{" "}
                      {getDepositAddress(selectedToken)?.max_deposit ||
                        "999999"}{" "}
                      {selectedToken}
                    </li>
                    <li>• Deposits are credited after 3 confirmations</li>
                    <li>• Double-check the address before sending</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <p className="text-gray-400">
              Deposit address not available for {selectedToken}
            </p>
          </div>
        )}
      </div>

      {/* Recent Deposits */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Recent Deposits</h3>
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="text-center text-gray-400">
            <p>No recent deposits</p>
            <p className="text-sm">Your deposit history will appear here</p>
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
