"use client";
import React, { useState } from "react";
import { Image, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import Toast from "@/components/Toast";

interface NFTCollectionProps {
  ethDepositAddress: string | null;
}

export default function NFTCollection({
  ethDepositAddress,
}: NFTCollectionProps) {
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast({
        show: true,
        message: "ETH address copied to clipboard!",
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          NFT Collection
        </h3>
        <Image className="h-5 w-5 text-purple-500" />
      </div>

      <div className="space-y-6">
        {/* NFT Collection Display */}
        <div>
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
            View NFT Collection
          </h4>
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg text-center">
            <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              Your NFT collection will appear here
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Deposit ETH to start collecting NFTs
            </p>
          </div>
        </div>

        {/* ETH Deposit Section */}
        {ethDepositAddress && (
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
              Deposit ETH for NFTs
            </h4>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  E
                </div>
                <span className="font-medium text-purple-900 dark:text-purple-100">
                  Ethereum Address
                </span>
              </div>

              <div className="flex items-center space-x-2 mb-3">
                <code className="flex-1 bg-white dark:bg-gray-600 px-3 py-2 rounded text-sm font-mono text-purple-900 dark:text-purple-100">
                  {ethDepositAddress}
                </code>
                <Button
                  onClick={() => copyToClipboard(ethDepositAddress)}
                  variant="outline"
                  size="sm"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-sm text-purple-700 dark:text-purple-300">
                Send ETH to this address to start collecting NFTs. Minimum
                deposit: 0.001 ETH
              </p>
            </div>
          </div>
        )}

        {/* NFT Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-blue-600 dark:text-blue-300">
              Total NFTs
            </p>
            <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
              0
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-300">
              Rare NFTs
            </p>
            <p className="text-xl font-bold text-green-900 dark:text-green-100">
              0
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <p className="text-sm text-purple-600 dark:text-purple-300">
              Collection Value
            </p>
            <p className="text-xl font-bold text-purple-900 dark:text-purple-100">
              0 ETH
            </p>
          </div>
        </div>

        {/* Coming Soon Features */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <h5 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
            🚀 Coming Soon
          </h5>
          <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
            <li>• NFT Marketplace integration</li>
            <li>• Rare NFT drops</li>
            <li>• NFT trading functionality</li>
            <li>• Collection analytics</li>
          </ul>
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
