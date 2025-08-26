"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

import { useCrypto } from "@/lib/hooks/useCrypto";
import Toast from "@/components/Toast";

import { Image, Copy } from "lucide-react";

export default function NFTPage() {
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

  const getETHDepositAddress = () => {
    const ethAddress = getDepositAddress("ETH");
    return ethAddress?.address || null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">NFT Collection</h2>
        <Image className="h-6 w-6 text-purple-500" />
      </div>

      <div className="space-y-6">
        {/* NFT Collection Display */}
        <div>
          <h3 className="text-lg font-semibold mb-3">View NFT Collection</h3>
          <div className="bg-gray-700 p-6 rounded-lg text-center">
            <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300 mb-2">
              Your NFT collection will appear here
            </p>
            <p className="text-sm text-gray-400">
              Deposit ETH to start collecting NFTs
            </p>
          </div>
        </div>

        {/* ETH Deposit Section */}
        {getETHDepositAddress() && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Deposit ETH for NFTs</h3>
            <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-700">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  E
                </div>
                <span className="font-medium text-purple-100">
                  Ethereum Address
                </span>
              </div>

              <div className="flex items-center space-x-2 mb-3">
                <code className="flex-1 bg-gray-600 px-3 py-2 rounded text-sm font-mono text-purple-100">
                  {getETHDepositAddress()}
                </code>
                <Button
                  onClick={() => copyToClipboard(getETHDepositAddress()!)}
                  variant="outline"
                  size="sm"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-sm text-purple-300">
                Send ETH to this address to start collecting NFTs. Minimum
                deposit: 0.001 ETH
              </p>
            </div>
          </div>
        )}

        {/* NFT Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-700">
            <p className="text-sm text-blue-300">Total NFTs</p>
            <p className="text-xl font-bold text-blue-100">0</p>
          </div>
          <div className="bg-green-900/20 p-4 rounded-lg border border-green-700">
            <p className="text-sm text-green-300">Rare NFTs</p>
            <p className="text-xl font-bold text-green-100">0</p>
          </div>
          <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-700">
            <p className="text-sm text-purple-300">Collection Value</p>
            <p className="text-xl font-bold text-purple-100">0 ETH</p>
          </div>
        </div>

        {/* Coming Soon Features */}
        <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-700">
          <h4 className="font-medium text-yellow-100 mb-2">🚀 Coming Soon</h4>
          <ul className="text-sm text-yellow-200 space-y-1">
            <li>• NFT Marketplace integration</li>
            <li>• Rare NFT drops</li>
            <li>• NFT trading functionality</li>
            <li>• Collection analytics</li>
          </ul>
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
