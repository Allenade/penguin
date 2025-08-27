"use client";
import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase, supabaseAdmin } from "@/lib/supabase";
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
  const [activeTab, setActiveTab] = useState<
    "users" | "withdrawals" | "overview"
  >("users");
  const [withdrawalRequests, setWithdrawalRequests] = useState<any[]>([]);
  const [isLoadingWithdrawals, setIsLoadingWithdrawals] = useState(false);
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    pendingWithdrawals: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
  });
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
      const { data, error } = await (supabaseAdmin as any)
        .from("user_profiles")
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

      setAllUsers(data || []);
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
        message: "Please enter an email address to search",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await (supabaseAdmin as any)
        .from("user_profiles")
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
        setSelectedUser(data);
        setUpdateForm({
          pengu_tokens: data.pengu_tokens || 0,
          usdt_balance: data.usdt_balance || 0,
          sol_balance: data.sol_balance || 0,
          eth_balance: data.eth_balance || 0,
          btc_balance: data.btc_balance || 0,
          staked_pengu: data.staked_pengu || 0,
          staking_rewards: data.staking_rewards || 0,
          total_investment: data.total_investment || 0,
          total_balance: data.total_balance || 0,
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
      const { error } = await (supabaseAdmin as any)
        .from("user_profiles")
        .update(updateForm)
        .eq("user_id", selectedUser.user_id);

      if (error) {
        console.error("Update error:", error);
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

      // Refresh the user list instead of searching
      await loadAllUsers();

      // Update the selected user with new data
      const updatedUser = { ...selectedUser, ...updateForm };
      setSelectedUser(updatedUser);
    } catch (err) {
      console.error("Update error:", err);
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

  // Fetch withdrawal requests
  const loadWithdrawalRequests = async () => {
    setIsLoadingWithdrawals(true);
    try {
      const { data, error } = await (supabaseAdmin as any)
        .from("withdrawal_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching withdrawal requests:", error);
        setToast({
          show: true,
          message: "Failed to load withdrawal requests",
          type: "error",
        });
        return;
      }

      setWithdrawalRequests(data || []);
    } catch (err) {
      console.error("Error:", err);
      setToast({
        show: true,
        message: "Error loading withdrawal requests",
        type: "error",
      });
    } finally {
      setIsLoadingWithdrawals(false);
    }
  };

  // Update withdrawal request status
  const updateWithdrawalStatus = async (
    requestId: number,
    status: "pending" | "approved" | "rejected" | "processing" | "completed"
  ) => {
    try {
      const { error } = await (supabaseAdmin as any)
        .from("withdrawal_requests")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", requestId.toString());

      if (error) {
        setToast({
          show: true,
          message: "Failed to update withdrawal status",
          type: "error",
        });
        return;
      }

      setToast({
        show: true,
        message: `Withdrawal request ${status} successfully`,
        type: "success",
      });

      await loadWithdrawalRequests();
    } catch (err) {
      setToast({
        show: true,
        message: "Error updating withdrawal status",
        type: "error",
      });
    }
  };

  // Load system statistics
  const loadSystemStats = async () => {
    try {
      // Get total users
      const { count: userCount } = await (supabaseAdmin as any)
        .from("user_profiles")
        .select("*", { count: "exact", head: true });

      // Get pending withdrawals
      const { count: pendingCount } = await (supabaseAdmin as any)
        .from("withdrawal_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      setSystemStats({
        totalUsers: userCount || 0,
        pendingWithdrawals: pendingCount || 0,
        totalDeposits: 0, // TODO: Add deposit tracking
        totalWithdrawals: 0, // TODO: Add withdrawal tracking
      });
    } catch (err) {
      console.error("Error loading system stats:", err);
    }
  };

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === "withdrawals") {
      loadWithdrawalRequests();
    } else if (activeTab === "overview") {
      loadSystemStats();
    }
  }, [activeTab]);

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
        <div className="flex-1 p-4 lg:p-8 overflow-hidden">
          <div className="max-w-6xl mx-auto h-full">
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
              <div className="w-10"></div>
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
                Manage users, withdrawal requests, and view system overview
              </p>
            </div>

            {/* Main Content */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-300px)]">
                {/* Main Tab Navigation */}
                <div className="flex space-x-1 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
                  <button
                    onClick={() => setActiveTab("users")}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      activeTab === "users"
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    <Users className="h-4 w-4 inline mr-2" />
                    User Management
                  </button>
                  <button
                    onClick={() => setActiveTab("withdrawals")}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      activeTab === "withdrawals"
                        ? "bg-green-600 text-white"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    <Wallet className="h-4 w-4 inline mr-2" />
                    Withdrawal Requests
                    {systemStats.pendingWithdrawals > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {systemStats.pendingWithdrawals}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      activeTab === "overview"
                        ? "bg-purple-600 text-white"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    <BarChart3 className="h-4 w-4 inline mr-2" />
                    System Overview
                  </button>
                </div>

                {/* Users Tab Content */}
                {activeTab === "users" && (
                  <div>
                    {/* View Mode Toggle */}
                    <div className="flex space-x-1 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg mb-6">
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
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                          <Input
                            type="email"
                            placeholder="Enter user email address..."
                            value={searchEmail}
                            onChange={(e) => setSearchEmail(e.target.value)}
                            className="flex-1"
                            onKeyPress={(e) =>
                              e.key === "Enter" && searchUser()
                            }
                          />
                          <Button
                            onClick={searchUser}
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white sm:w-auto w-full"
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
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                            All Users ({allUsers.length})
                          </h3>
                          <Button
                            onClick={loadAllUsers}
                            disabled={isLoadingUsers}
                            className="bg-green-600 hover:bg-green-700 text-white sm:w-auto w-full"
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
                          <div className="overflow-x-auto max-w-full">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                              <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    User
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
                                    Total Investment
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
                                      ${user.total_investment.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                      ${user.total_balance.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                      <Button
                                        onClick={() => {
                                          setSelectedUser(user);
                                          setUpdateForm({
                                            pengu_tokens:
                                              user.pengu_tokens || 0,
                                            usdt_balance:
                                              user.usdt_balance || 0,
                                            sol_balance: user.sol_balance || 0,
                                            eth_balance: user.eth_balance || 0,
                                            btc_balance: user.btc_balance || 0,
                                            staked_pengu:
                                              user.staked_pengu || 0,
                                            staking_rewards:
                                              user.staking_rewards || 0,
                                            total_investment:
                                              user.total_investment || 0,
                                            total_balance:
                                              user.total_balance || 0,
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
                              Click "Refresh" to load users
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* User Information and Update Form */}
                    {selectedUser && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 overflow-x-auto">
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
                                  handleInputChange(
                                    "pengu_tokens",
                                    e.target.value
                                  )
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
                                  handleInputChange(
                                    "usdt_balance",
                                    e.target.value
                                  )
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
                                  handleInputChange(
                                    "sol_balance",
                                    e.target.value
                                  )
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
                                  handleInputChange(
                                    "eth_balance",
                                    e.target.value
                                  )
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
                                  handleInputChange(
                                    "btc_balance",
                                    e.target.value
                                  )
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
                                  handleInputChange(
                                    "staked_pengu",
                                    e.target.value
                                  )
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
                                  handleInputChange(
                                    "total_balance",
                                    e.target.value
                                  )
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
                )}

                {/* Withdrawals Tab Content */}
                {activeTab === "withdrawals" && (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        Withdrawal Requests ({withdrawalRequests.length})
                      </h3>
                      <Button
                        onClick={loadWithdrawalRequests}
                        disabled={isLoadingWithdrawals}
                        className="bg-green-600 hover:bg-green-700 text-white sm:w-auto w-full"
                      >
                        {isLoadingWithdrawals ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        ) : (
                          <Wallet className="h-4 w-4 mr-2" />
                        )}
                        Refresh
                      </Button>
                    </div>

                    {isLoadingWithdrawals ? (
                      <div className="text-center py-8">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-400">
                          Loading withdrawal requests...
                        </p>
                      </div>
                    ) : withdrawalRequests.length > 0 ? (
                      <div className="overflow-x-auto max-w-full">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                User
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Crypto
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Amount
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Address
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Date
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {withdrawalRequests.map((request) => (
                              <tr
                                key={request.id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700"
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                      User ID: {request.user_id}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      Request ID: {request.id}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                  {request.crypto_symbol}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                  {request.amount} {request.crypto_symbol}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  <div className="max-w-xs truncate">
                                    {request.user_address}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`px-2 py-1 rounded text-xs ${
                                      request.status === "pending"
                                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                                        : request.status === "approved"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                        : request.status === "rejected"
                                        ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                        : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                                    }`}
                                  >
                                    {request.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  {new Date(
                                    request.created_at
                                  ).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex space-x-2">
                                    {request.status === "pending" && (
                                      <>
                                        <Button
                                          onClick={() =>
                                            updateWithdrawalStatus(
                                              request.id,
                                              "approved"
                                            )
                                          }
                                          size="sm"
                                          className="bg-green-600 hover:bg-green-700 text-white"
                                        >
                                          Approve
                                        </Button>
                                        <Button
                                          onClick={() =>
                                            updateWithdrawalStatus(
                                              request.id,
                                              "rejected"
                                            )
                                          }
                                          size="sm"
                                          className="bg-red-600 hover:bg-red-700 text-white"
                                        >
                                          Reject
                                        </Button>
                                      </>
                                    )}
                                    {request.status === "approved" && (
                                      <Button
                                        onClick={() =>
                                          updateWithdrawalStatus(
                                            request.id,
                                            "completed"
                                          )
                                        }
                                        size="sm"
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                      >
                                        Complete
                                      </Button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-400">
                          No withdrawal requests found
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* System Overview Tab Content */}
                {activeTab === "overview" && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                      System Overview
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
                        <div className="flex items-center">
                          <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              Total Users
                            </p>
                            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                              {systemStats.totalUsers}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-700">
                        <div className="flex items-center">
                          <Wallet className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                              Pending Withdrawals
                            </p>
                            <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                              {systemStats.pendingWithdrawals}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-700">
                        <div className="flex items-center">
                          <BarChart3 className="h-8 w-8 text-green-600 dark:text-green-400" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-green-600 dark:text-green-400">
                              Total Deposits
                            </p>
                            <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                              ${systemStats.totalDeposits.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-700">
                        <div className="flex items-center">
                          <BarChart3 className="h-8 w-8 text-red-600 dark:text-red-400" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-red-600 dark:text-red-400">
                              Total Withdrawals
                            </p>
                            <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                              ${systemStats.totalWithdrawals.toLocaleString()}
                            </p>
                          </div>
                        </div>
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
