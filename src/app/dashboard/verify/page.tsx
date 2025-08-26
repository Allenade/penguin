"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUserAuth } from "@/lib/hooks/useUserAuth";
import Toast from "@/components/Toast";

import { CheckCircle, XCircle, Shield, AlertTriangle } from "lucide-react";

export default function VerifyPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const { userProfile } = useUserAuth();

  const handleVerify = async () => {
    setIsVerifying(true);

    // Simulate verification process
    setTimeout(() => {
      setIsVerifying(false);
      setToast({
        show: true,
        message:
          "Verification request submitted. You will be notified once processed.",
        type: "success",
      });
    }, 2000);
  };

  const getVerificationLevel = () => {
    if (userProfile?.is_verified) {
      return {
        level: "Verified",
        color: "green",
        icon: CheckCircle,
        description: "Your account is fully verified",
      };
    } else {
      return {
        level: "Unverified",
        color: "red",
        icon: XCircle,
        description: "Your account needs verification",
      };
    }
  };

  const verification = getVerificationLevel();
  const IconComponent = verification.icon;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Verify Account</h2>
        <Shield className="h-6 w-6 text-blue-500" />
      </div>

      {/* Verification Status */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <IconComponent className={`h-8 w-8 text-${verification.color}-500`} />
          <div>
            <h3 className="text-lg font-semibold">Account Status</h3>
            <p className="text-gray-400">{verification.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Verification Level</p>
            <p className={`text-lg font-bold text-${verification.color}-500`}>
              {verification.level}
            </p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Level</p>
            <p className="text-lg font-bold">
              {userProfile?.verification_level || 0}
            </p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Account Type</p>
            <p className="text-lg font-bold">
              {userProfile?.is_verified ? "Verified" : "Standard"}
            </p>
          </div>
        </div>
      </div>

      {/* Verification Benefits */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Verification Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-900/20 p-4 rounded-lg border border-green-700">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="font-medium text-green-100">Higher Limits</span>
            </div>
            <p className="text-sm text-green-200">
              Increased deposit and withdrawal limits
            </p>
          </div>
          <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-700">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-5 w-5 text-blue-400" />
              <span className="font-medium text-blue-100">
                Enhanced Security
              </span>
            </div>
            <p className="text-sm text-blue-200">
              Additional security features and protection
            </p>
          </div>
          <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-700">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-purple-400" />
              <span className="font-medium text-purple-100">
                Priority Support
              </span>
            </div>
            <p className="text-sm text-purple-200">
              Faster customer support response times
            </p>
          </div>
          <div className="bg-orange-900/20 p-4 rounded-lg border border-orange-700">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-orange-400" />
              <span className="font-medium text-orange-100">
                Exclusive Features
              </span>
            </div>
            <p className="text-sm text-orange-200">
              Access to premium features and services
            </p>
          </div>
        </div>
      </div>

      {/* Verification Process */}
      {!userProfile?.is_verified && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Get Verified</h3>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="space-y-4">
              <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-700">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  <span className="font-medium text-yellow-100">
                    Verification Required
                  </span>
                </div>
                <p className="text-sm text-yellow-200">
                  To access higher limits and enhanced features, please complete
                  the verification process.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Verification Requirements:</h4>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Valid government-issued ID</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Proof of address (utility bill, bank statement)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Selfie with ID for identity verification</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Minimum account age of 30 days</span>
                  </li>
                </ul>
              </div>

              <Button
                onClick={handleVerify}
                disabled={isVerifying}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isVerifying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Start Verification Process
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Verification History */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Verification History</h3>
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="text-center text-gray-400">
            <p>No verification history</p>
            <p className="text-sm">
              Your verification attempts will appear here
            </p>
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
