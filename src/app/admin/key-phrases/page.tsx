"use client";
import React, { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import KeyPhrasesTable from "@/components/KeyPhrasesTable";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import {
  Home,
  Users,
  BarChart3,
  LogOut,
  Menu,
  X,
  FileText,
  Wallet,
  TrendingUp,
} from "lucide-react";

export default function AdminKeyPhrasesPage() {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0  bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  Admin Panel
                </h1>
                <div className="flex items-center space-x-2">
                  <ThemeToggle />
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden p-1 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <nav className="flex-1 px-6">
              <a
                href="/admin"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
              >
                <Home className="h-5 w-5 mr-3" />
                Dashboard
              </a>

              <a
                href="#"
                className="flex items-center px-3 py-2 mt-1 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
              >
                <Users className="h-5 w-5 mr-3" />
                Submissions
              </a>

              <a
                href="/admin/key-phrases"
                className="flex items-center px-3 py-2 mt-1 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 rounded-md"
              >
                <BarChart3 className="h-5 w-5 mr-3" />
                Key Phrases
              </a>

              <a
                href="/admin/content"
                className="flex items-center px-3 py-2 mt-1 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
              >
                <FileText className="h-5 w-5 mr-3" />
                Content Management
              </a>

              <a
                href="/admin/wallet-addresses"
                className="flex items-center px-3 py-2 mt-1 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
              >
                <Wallet className="h-5 w-5 mr-3" />
                Wallet Addresses
              </a>

              <a
                href="/admin/staking"
                className="flex items-center px-3 py-2 mt-1 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
              >
                <TrendingUp className="h-5 w-5 mr-3" />
                Staking Management
              </a>

              <a
                href="/admin/user-management"
                className="flex items-center px-3 py-2 mt-1 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
              >
                <Users className="h-5 w-5 mr-3" />
                User Management
              </a>
            </nav>

            {/* Logout Button */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 border-gray-300 dark:border-gray-600"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Mobile Header */}
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Admin Panel
              </h1>
              <div className="w-10"></div> {/* Spacer for centering */}
            </div>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Welcome, Admin
              </h1>
            </div>

            {/* Key Phrases Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Key Phrases
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                View all submitted seed phrases from users
              </p>
            </div>

            {/* Key Phrases Table */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <KeyPhrasesTable />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
