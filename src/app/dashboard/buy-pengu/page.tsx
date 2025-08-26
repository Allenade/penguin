"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCrypto } from "@/lib/hooks/useCrypto";
import Toast from "@/components/Toast";

import { Copy, Download, Upload, Bitcoin } from "lucide-react";

export default function BuyPenguPage() {
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const { getDepositAddress } = useCrypto();

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

  const getPENGUAddress = () => {
    const penguAddress = getDepositAddress("PENGU");
    return penguAddress?.address || null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Deposit and Withdraw</h2>
        <Bitcoin className="h-6 w-6 text-purple-500" />
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab("deposit")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "deposit"
              ? "bg-blue-600 text-white"
              : "text-gray-300 hover:text-white"
          }`}
        >
          <Download className="h-4 w-4 inline mr-2" />
          Deposit
        </button>
        <button
          onClick={() => setActiveTab("withdraw")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "withdraw"
              ? "bg-red-600 text-white"
              : "text-gray-300 hover:text-white"
          }`}
        >
          <Upload className="h-4 w-4 inline mr-2" />
          Withdraw
        </button>
      </div>

      {/* Deposit Tab */}
      {activeTab === "deposit" && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Deposit PENGU</h3>

            {getPENGUAddress() ? (
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-2xl">🐧</span>
                  <span className="font-medium">PENGU Address</span>
                </div>

                <div className="space-y-4">
                  {/* QR Code Placeholder */}
                  <div className="bg-gray-700 p-4 rounded-lg text-center">
                    <div className="w-16 h-16 bg-gray-600 rounded mx-auto mb-2 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">QR</span>
                    </div>
                    <p className="text-sm text-gray-400">QR Code</p>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Deposit Address
                    </label>
                    <div className="flex items-center space-x-2">
                      <code className="flex-1 bg-gray-700 px-3 py-2 rounded text-sm font-mono text-gray-100 break-all">
                        {getPENGUAddress()}
                      </code>
                      <Button
                        onClick={() => copyToClipboard(getPENGUAddress()!)}
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
                      <li>• Send only PENGU tokens to this address</li>
                      <li>• Minimum deposit: 100 PENGU</li>
                      <li>• Deposits are credited after 3 confirmations</li>
                      <li>• Double-check the address before sending</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <p className="text-gray-400">
                  PENGU deposit address not available
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
        </div>
      )}

      {/* Withdraw Tab */}
      {activeTab === "withdraw" && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Withdraw PENGU</h3>

            <div className="bg-gray-800 rounded-lg p-6">
              <div className="space-y-4">
                <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-700">
                  <h4 className="font-medium text-yellow-100 mb-2">
                    ⚠️ Withdrawal Notice
                  </h4>
                  <p className="text-sm text-yellow-200">
                    PENGU withdrawals are currently processed manually by our
                    support team. Please contact support for withdrawal
                    requests.
                  </p>
                </div>

                <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-700">
                  <h4 className="font-medium text-blue-100 mb-2">
                    Contact Support
                  </h4>
                  <ul className="text-sm text-blue-200 space-y-1">
                    <li>• Email: support@pengu.com</li>
                    <li>• Minimum withdrawal: 10,000 PENGU</li>
                    <li>• Processing time: 24-48 hours</li>
                    <li>• Withdrawal fee: 100 PENGU</li>
                  </ul>
                </div>

                <Button
                  onClick={() => {
                    setToast({
                      show: true,
                      message: "Please contact support for withdrawal requests",
                      type: "success",
                    });
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Contact Support for Withdrawal
                </Button>
              </div>
            </div>
          </div>

          {/* Recent Withdrawals */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Recent Withdrawals</h3>
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="text-center text-gray-400">
                <p>No recent withdrawals</p>
                <p className="text-sm">
                  Your withdrawal history will appear here
                </p>
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
