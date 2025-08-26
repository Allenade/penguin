"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Gift, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Toast from "@/components/Toast";

interface WelcomeBonusProps {
  isEnabled: boolean;
  amount: number;
  isClaimed: boolean;
  onClaim: () => Promise<{ success: boolean; error?: any }>;
}

export default function WelcomeBonus({
  isEnabled,
  amount,
  isClaimed,
  onClaim,
}: WelcomeBonusProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as const,
  });

  const handleClaim = async () => {
    setIsLoading(true);
    const result = await onClaim();
    setIsLoading(false);

    if (result.success) {
      setToast({
        show: true,
        message: `Successfully claimed ${amount.toLocaleString()} PENGU welcome bonus!`,
        type: "success",
      });
    } else {
      setToast({
        show: true,
        message: "Failed to claim welcome bonus. Please try again.",
        type: "error",
      });
    }
  };

  if (!isEnabled || isClaimed) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white/20 rounded-full">
            <Gift className="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Welcome Bonus!</h3>
            <p className="text-blue-100">
              Receive {amount.toLocaleString()} PENGU as welcome bonus
            </p>
          </div>
        </div>
        <Button
          onClick={handleClaim}
          disabled={isLoading}
          className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Claim Bonus
        </Button>
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
