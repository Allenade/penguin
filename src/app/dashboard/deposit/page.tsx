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

  const getDepositAddress = (symbol: string) => {
    return depositAddresses.find((addr) => addr.crypto_symbol === symbol);
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {assets.map((asset) => (
            <button
              key={asset.symbol}
              onClick={() => setSelectedToken(asset.symbol)}
              className={`p-4 rounded-lg border transition-colors ${
                selectedToken === asset.symbol
                  ? "bg-blue-600 border-blue-500 text-white"
                  : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <div className="text-2xl mb-2">{getTokenIcon(asset.symbol)}</div>
              <div className="text-sm font-medium">{asset.symbol}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Deposit Address */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Deposit {selectedToken}</h3>

        {getDepositAddress(selectedToken) ? (
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">{getTokenIcon(selectedToken)}</span>
              <span className="font-medium">{selectedToken} Address</span>
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
                <ul className="text-sm text-blue-200 space-y-1">
                  <li>• Send only {selectedToken} to this address</li>
                  <li>
                    • Minimum deposit:{" "}
                    {getDepositAddress(selectedToken)?.min_deposit || "0.001"}{" "}
                    {selectedToken}
                  </li>
                  <li>• Deposits are credited after 3 confirmations</li>
                  <li>• Double-check the address before sending</li>
                </ul>
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
