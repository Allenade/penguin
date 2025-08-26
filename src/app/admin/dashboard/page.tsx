"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-white"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Admin Panel
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">Settings</h1>
            </div>
          </div>

          {/* Settings Content */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <p className="text-white">{user?.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  User ID
                </label>
                <p className="text-gray-400 text-sm">{user?.id}</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-700">
              <Button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
