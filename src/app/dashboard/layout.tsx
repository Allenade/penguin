"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useUserAuth } from "@/lib/hooks/useUserAuth";
import UserProtectedRoute from "@/components/UserProtectedRoute";

import {
  Menu,
  User,
  Plus,
  Minus,
  Home,
  CircuitBoard,
  Image as PictureFrame,
  CheckCircle,
  LogOut,
  Bitcoin,
  X,
  ArrowLeft,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut } = useUserAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const navItems = [
    { name: "Dashboard", icon: Home, href: "/dashboard" },
    { name: "PENGU Holdings", icon: Plus, href: "/dashboard/holdings" },
    { name: "Staking", icon: CircuitBoard, href: "/dashboard/staking" },
    { name: "Deposit", icon: Plus, href: "/dashboard/deposit" },
    { name: "Withdraw", icon: Minus, href: "/dashboard/withdraw" },
  ];

  const isActiveRoute = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <UserProtectedRoute>
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex">
          {/* Left Sidebar */}
          <div
            className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-800 min-h-screen transform transition-transform duration-300 ease-in-out ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }`}
          >
            <div className="p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <Menu className="h-6 w-6 text-white" />
                <button
                  className="lg:hidden text-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Back Button */}
              <div className="mb-4">
                <Link href="/huddle">
                  <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-gray-300 hover:bg-gray-700 transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                    <span className="text-sm font-medium">Back to Huddle</span>
                  </button>
                </Link>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-2 flex-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      isActiveRoute(item.href)
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-700"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                ))}
              </nav>

              {/* Logout */}
              <div className="pt-4 border-t border-gray-700">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-gray-900 lg:ml-0">
            {/* Top Header */}
            <div className="bg-gray-800 px-4 lg:px-6 py-4 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <button
                  className="lg:hidden text-white"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-6 w-6" />
                </button>
                <h1 className="text-lg lg:text-xl font-semibold">
                  PENGU Dashboard
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Page Content */}
            <div className="p-4 lg:p-6">{children}</div>

            {/* Footer */}
            <div className="bg-gray-800 px-4 lg:px-6 py-4 text-center">
              <p className="text-gray-400 text-xs lg:text-sm">
                Copyright © 2025. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </UserProtectedRoute>
  );
}
