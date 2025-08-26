"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { User, Settings, LogOut, Wallet, UserCheck } from "lucide-react";
import { useUserAuth } from "@/lib/hooks/useUserAuth";
import { useRouter } from "next/navigation";

interface UserDropdownProps {
  className?: string;
}

export default function UserDropdown({ className }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, userProfile, signOut } = useUserAuth();
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
      setIsOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleAccount = () => {
    // Navigate to dashboard
    router.push("/dashboard");
    setIsOpen(false);
  };

  const handleWallet = () => {
    // Add wallet logic here
    console.log("Wallet clicked");
    setIsOpen(false);
  };

  const handleSettings = () => {
    // Add settings logic here
    console.log("Settings clicked");
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="text-white hover:bg-white/10 rounded-full"
      >
        <User className="h-6 w-6" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">Account</p>
            <p className="text-xs text-gray-500">
              {userProfile?.wallet_username ||
                user?.email ||
                "user@example.com"}
            </p>
          </div>

          <button
            onClick={handleAccount}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
          >
            <UserCheck className="h-4 w-4" />
            <span>My Account</span>
          </button>

          <button
            onClick={handleWallet}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
          >
            <Wallet className="h-4 w-4" />
            <span>My Wallet</span>
          </button>

          <button
            onClick={handleSettings}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>

          <div className="border-t border-gray-100 mt-1">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
