import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  XMarkIcon,
  ClipboardDocumentIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  walletAddress: string;
}

export default function PaymentModal({
  isOpen,
  onClose,
  amount,
  walletAddress,
}: PaymentModalProps) {
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-white/10 backdrop-blur-md transition-all duration-500 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 transition-all duration-500 transform ${
          isAnimating
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        }`}
      >
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute top-4 left-4 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-75"></div>
          <div className="absolute top-8 right-8 w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-purple-300 rounded-full animate-bounce"></div>
          <div className="absolute bottom-4 right-4 w-1 h-1 bg-blue-300 rounded-full animate-ping opacity-50"></div>
        </div>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-110 hover:rotate-90"
        >
          <XMarkIcon className="w-5 h-5 text-gray-500" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 animate-pulse">
            Invest ${amount.toLocaleString()}
          </h2>
          <p className="text-gray-600">
            Send your payment to the wallet address below
          </p>
        </div>

        {/* Wallet Address */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Wallet Address
          </label>
          <div className="relative">
            <input
              type="text"
              value={walletAddress}
              readOnly
              className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
            />
            <button
              onClick={copyToClipboard}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-md hover:bg-gray-200 transition-all duration-200 hover:scale-110"
              title="Copy to clipboard"
            >
              {copied ? (
                <CheckIcon className="w-4 h-4 text-green-600 animate-bounce" />
              ) : (
                <ClipboardDocumentIcon className="w-4 h-4 text-gray-500 hover:text-purple-600" />
              )}
            </button>
          </div>
          {copied && (
            <p className="text-green-600 text-sm mt-1 animate-pulse font-semibold">
              Address copied to clipboard!
            </p>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <h3 className="font-semibold text-blue-900 mb-2">
            Payment Instructions:
          </h3>
          <ol className="text-sm text-blue-800 space-y-1">
            <li className="hover:text-purple-700 transition-colors duration-200">
              1. Copy the wallet address above
            </li>
            <li className="hover:text-purple-700 transition-colors duration-200">
              2. Send exactly ${amount.toLocaleString()} to this address
            </li>
            <li className="hover:text-purple-700 transition-colors duration-200">
              3. Keep your transaction hash for verification
            </li>
            <li className="hover:text-purple-700 transition-colors duration-200">
              4. Contact support if you need assistance
            </li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 hover:scale-105 transition-all duration-200 hover:shadow-md"
          >
            Close
          </Button>
          <Button
            onClick={copyToClipboard}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold hover:scale-105 transition-all duration-200 hover:shadow-lg transform"
          >
            {copied ? "Copied!" : "Copy Address"}
          </Button>
        </div>
      </div>
    </div>
  );
}
