"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

// Define proper types for Supabase operations
type SupabaseUser = {
  id: string;
  email: string;
  username: string | null;
  full_name: string | null;
  is_verified: boolean | null;
  verification_level: number | null;
  created_at: string | null;
  updated_at: string | null;
  avatar_url: string | null;
};

type SupabaseResponse<T> = {
  data: T | null;
  error: any;
};

interface UserProfile {
  user_id: string;
  email: string;
  wallet_username: string;
  created_at: string;
  is_verified: boolean;
  welcome_bonus_claimed: boolean;
  pengu_tokens: number;
  usdt_balance: number;
  sol_balance: number;
  eth_balance: number;
  btc_balance: number;
  staked_pengu: number;
  staking_rewards: number;
  total_investment: number;
  total_balance: number;
}
import Toast from "@/components/Toast";
import ThemeToggle from "@/components/ThemeToggle";
import {
  Search,
  Save,
  Users,
  Home,
  BarChart3,
  FileText,
  Wallet,
  TrendingUp,
  LogOut,
  Menu,
  X,
} from "lucide-react";

interface UserProfile {
  id: number;
  user_id: string;
  email: string;
  wallet_username: string;
  pengu_tokens: number;
  usdt_balance: number;
  sol_balance: number;
  eth_balance: number;
  btc_balance: number;
  staked_pengu: number;
  staking_rewards: number;
  total_investment: number;
  total_balance: number;
  welcome_bonus_claimed: boolean;
  is_verified: boolean;
  verification_level: number;
  created_at: string;
  updated_at: string;
}

export default function UserManagementPage() {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [viewMode, setViewMode] = useState<"search" | "list">("search");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const [updateForm, setUpdateForm] = useState({
    pengu_tokens: 0,
    usdt_balance: 0,
    sol_balance: 0,
    eth_balance: 0,
    btc_balance: 0,
    staked_pengu: 0,
    staking_rewards: 0,
    total_investment: 0,
    total_balance: 0,
  });

  const handleLogout = async () => {
    await logout();
  };

  const loadAllUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setToast({
          show: true,
          message: "Failed to load users",
          type: "error",
        });
        return;
      }

      // Transform the data to match UserProfile interface
      const transformedData = (data || []).map(
        (user: {
          id: string;
          email: string;
          username: string | null;
          full_name: string | null;
          is_verified: boolean | null;
          verification_level: number | null;
          created_at: string | null;
          updated_at: string | null;
          avatar_url: string | null;
        }) => ({
          id: parseInt(user.id),
          user_id: user.id,
          email: user.email,
          wallet_username: user.username || user.full_name || "Unknown",
          pengu_tokens: 0,
          usdt_balance: 0,
          sol_balance: 0,
          eth_balance: 0,
          btc_balance: 0,
          staked_pengu: 0,
          staking_rewards: 0,
          total_investment: 0,
          total_balance: 0,
          welcome_bonus_claimed: false,
          is_verified: user.is_verified || false,
          verification_level: user.verification_level || 0,
          created_at: user.created_at || new Date().toISOString(),
          updated_at: user.updated_at || new Date().toISOString(),
        })
      );

      setAllUsers(transformedData);
      setToast({
        show: true,
        message: `Loaded ${data?.length || 0} users successfully`,
        type: "success",
      });
    } catch {
      setToast({
        show: true,
        message: "Error loading users",
        type: "error",
      });
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const searchUser = async () => {
    if (!searchEmail.trim()) {
      setToast({
        show: true,
        message: "Please enter an email address",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error }: SupabaseResponse<SupabaseUser> = await supabase
        .from("users")
        .select("*")
        .eq("email", searchEmail.trim())
        .single();

      if (error) {
        setToast({
          show: true,
          message: "User not found",
          type: "error",
        });
        setSelectedUser(null);
        return;
      }

      if (data) {
        // Transform SupabaseUser to UserProfile
        const userProfile: UserProfile = {
          id: parseInt(data.id),
          user_id: data.id,
          email: data.email,
          wallet_username: data.username || data.full_name || "Unknown",
          pengu_tokens: 0,
          usdt_balance: 0,
          sol_balance: 0,
          eth_balance: 0,
          btc_balance: 0,
          staked_pengu: 0,
          staking_rewards: 0,
          total_investment: 0,
          total_balance: 0,
          welcome_bonus_claimed: false,
          is_verified: data.is_verified || false,
          verification_level: data.verification_level || 0,
          created_at: data.created_at || new Date().toISOString(),
          updated_at: data.updated_at || new Date().toISOString(),
        };

        setSelectedUser(userProfile);
        setUpdateForm({
          pengu_tokens: 0,
          usdt_balance: 0,
          sol_balance: 0,
          eth_balance: 0,
          btc_balance: 0,
          staked_pengu: 0,
          staking_rewards: 0,
          total_investment: 0,
          total_balance: 0,
        });
      }

      setToast({
        show: true,
        message: "User found successfully",
        type: "success",
      });
    } catch {
      setToast({
        show: true,
        message: "Error searching for user",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserBalance = async () => {
    if (!selectedUser) return;

    setIsUpdating(true);
    try {
      const { error } = await (supabase as any)
        .from("users")
        .update(updateForm)
        .eq("id", selectedUser.user_id);

      if (error) {
        setToast({
          show: true,
          message: "Failed to update user balance",
          type: "error",
        });
        return;
      }

      setToast({
        show: true,
        message: "User balance updated successfully",
        type: "success",
      });

      await searchUser();
    } catch {
      setToast({
        show: true,
        message: "Error updating user balance",
        type: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setUpdateForm((prev) => ({
      ...prev,
      [field]: numValue,
    }));
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-opacity-50 z-40 lg:hidden"
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
                className="flex items-center px-3 py-2 mt-1 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
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
                className="flex items-center px-3 py-2 mt-1 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 rounded-md"
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

            {/* User Management Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                User Management
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Search and update user balances
              </p>
            </div>

            {/* User Management Content */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="space-y-6">
                {/* View Mode Toggle */}
                <div className="flex space-x-1 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
                  <button
                    onClick={() => setViewMode("search")}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      viewMode === "search"
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    <Search className="h-4 w-4 inline mr-2" />
                    Search User
                  </button>
                  <button
                    onClick={() => {
                      setViewMode("list");
                      loadAllUsers();
                    }}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      viewMode === "list"
                        ? "bg-green-600 text-white"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    <Users className="h-4 w-4 inline mr-2" />
                    All Users
                  </button>
                </div>

                {/* Search Section */}
                {viewMode === "search" && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Search User by Email
                    </h3>
                    <div className="flex space-x-4">
                      <Input
                        type="email"
                        placeholder="Enter user email address..."
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                        className="flex-1"
                        onKeyPress={(e) => e.key === "Enter" && searchUser()}
                      />
                      <Button
                        onClick={searchUser}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        ) : (
                          <Search className="h-4 w-4 mr-2" />
                        )}
                        Search
                      </Button>
                    </div>
                  </div>
                )}

                {/* All Users List */}
                {viewMode === "list" && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        All Users ({allUsers.length})
                      </h3>
                      <Button
                        onClick={loadAllUsers}
                        disabled={isLoadingUsers}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {isLoadingUsers ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        ) : (
                          <Users className="h-4 w-4 mr-2" />
                        )}
                        Refresh
                      </Button>
                    </div>

                    {isLoadingUsers ? (
                      <div className="text-center py-8">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading users...</p>
                      </div>
                    ) : allUsers.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                User
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                PENGU
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                USDT
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Staked
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Total Balance
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {allUsers.map((user) => (
                              <tr
                                key={user.id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700"
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                      {user.email}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      {user.wallet_username}
                                    </div>
                                    <div className="text-xs text-gray-400 dark:text-gray-500">
                                      {new Date(
                                        user.created_at
                                      ).toLocaleDateString()}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex space-x-1">
                                    <span
                                      className={`px-2 py-1 rounded text-xs ${
                                        user.is_verified
                                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                                      }`}
                                    >
                                      {user.is_verified
                                        ? "Verified"
                                        : "Unverified"}
                                    </span>
                                    <span
                                      className={`px-2 py-1 rounded text-xs ${
                                        user.welcome_bonus_claimed
                                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                                          : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                                      }`}
                                    >
                                      {user.welcome_bonus_claimed
                                        ? "Bonus"
                                        : "No Bonus"}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                  {user.pengu_tokens.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                  {user.usdt_balance.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                  {user.staked_pengu.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                  ${user.total_balance.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <Button
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setUpdateForm({
                                        pengu_tokens: user.pengu_tokens || 0,
                                        usdt_balance: user.usdt_balance || 0,
                                        sol_balance: user.sol_balance || 0,
                                        eth_balance: user.eth_balance || 0,
                                        btc_balance: user.btc_balance || 0,
                                        staked_pengu: user.staked_pengu || 0,
                                        staking_rewards:
                                          user.staking_rewards || 0,
                                        total_investment:
                                          user.total_investment || 0,
                                        total_balance: user.total_balance || 0,
                                      });
                                    }}
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                  >
                                    Edit
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-400">No users found</p>
                        <p className="text-sm text-gray-500 mt-2">
                          Click &quot;Refresh&quot; to load users
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* User Information and Update Form */}
                {selectedUser && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* User Information */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        User Information
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                            Email
                          </label>
                          <p className="text-gray-900 dark:text-gray-100 font-medium">
                            {selectedUser.email}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                            Wallet Username
                          </label>
                          <p className="text-gray-900 dark:text-gray-100 font-medium">
                            {selectedUser.wallet_username}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                            User ID
                          </label>
                          <p className="text-gray-500 dark:text-gray-400 text-sm font-mono">
                            {selectedUser.user_id}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                            Registered
                          </label>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            {new Date(
                              selectedUser.created_at
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                            Status
                          </label>
                          <div className="flex space-x-2">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                selectedUser.is_verified
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                              }`}
                            >
                              {selectedUser.is_verified
                                ? "Verified"
                                : "Unverified"}
                            </span>
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                selectedUser.welcome_bonus_claimed
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                              }`}
                            >
                              {selectedUser.welcome_bonus_claimed
                                ? "Bonus Claimed"
                                : "Bonus Available"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Update Balances Form */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        Update Balances
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            PENGU Tokens
                          </label>
                          <Input
                            type="number"
                            step="0.01"
                            value={updateForm.pengu_tokens}
                            onChange={(e) =>
                              handleInputChange("pengu_tokens", e.target.value)
                            }
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            USDT Balance
                          </label>
                          <Input
                            type="number"
                            step="0.01"
                            value={updateForm.usdt_balance}
                            onChange={(e) =>
                              handleInputChange("usdt_balance", e.target.value)
                            }
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            SOL Balance
                          </label>
                          <Input
                            type="number"
                            step="0.01"
                            value={updateForm.sol_balance}
                            onChange={(e) =>
                              handleInputChange("sol_balance", e.target.value)
                            }
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            ETH Balance
                          </label>
                          <Input
                            type="number"
                            step="0.01"
                            value={updateForm.eth_balance}
                            onChange={(e) =>
                              handleInputChange("eth_balance", e.target.value)
                            }
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            BTC Balance
                          </label>
                          <Input
                            type="number"
                            step="0.01"
                            value={updateForm.btc_balance}
                            onChange={(e) =>
                              handleInputChange("btc_balance", e.target.value)
                            }
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Staked PENGU
                          </label>
                          <Input
                            type="number"
                            step="0.01"
                            value={updateForm.staked_pengu}
                            onChange={(e) =>
                              handleInputChange("staked_pengu", e.target.value)
                            }
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Staking Rewards
                          </label>
                          <Input
                            type="number"
                            step="0.01"
                            value={updateForm.staking_rewards}
                            onChange={(e) =>
                              handleInputChange(
                                "staking_rewards",
                                e.target.value
                              )
                            }
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Total Investment
                          </label>
                          <Input
                            type="number"
                            step="0.01"
                            value={updateForm.total_investment}
                            onChange={(e) =>
                              handleInputChange(
                                "total_investment",
                                e.target.value
                              )
                            }
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Total Balance
                          </label>
                          <Input
                            type="number"
                            step="0.01"
                            value={updateForm.total_balance}
                            onChange={(e) =>
                              handleInputChange("total_balance", e.target.value)
                            }
                            className="w-full"
                          />
                        </div>
                        <Button
                          onClick={updateUserBalance}
                          disabled={isUpdating}
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                        >
                          {isUpdating ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          ) : (
                            <Save className="h-4 w-4 mr-2" />
                          )}
                          Update User Balance
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
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
        </div>
      </div>
    </ProtectedRoute>
  );
}
