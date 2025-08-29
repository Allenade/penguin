"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCrypto } from "@/lib/hooks/useCrypto";

import Toast from "@/components/Toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/lib/hooks/useAuth";
import ThemeToggle from "@/components/ThemeToggle";

import {
  Settings,
  Users,
  Gift,
  Shield,
  Plus,
  Edit,
  TrendingUp,
  X,
  Save,
  Home,
  BarChart3,
  FileText,
  Wallet,
  LogOut,
  Search,
  Filter,
  Pause,
  Play,
  AlertTriangle,
  DollarSign,
  Calendar,
  User,
  Activity,
} from "lucide-react";

interface StakingSettings {
  id: number;
  crypto_symbol: string;
  apy_percentage: number;
  min_stake_amount: number;
  max_stake_amount: number;
  lock_period_days: number;
  reward_frequency?: string;
  is_active: boolean;
}

export default function AdminStakingPage() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "settings" | "active" | "rewards" | "controls"
  >("settings");
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editingSettings, setEditingSettings] =
    useState<StakingSettings | null>(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  // User staking management state
  const [showUserStakeModal, setShowUserStakeModal] = useState(false);
  const [editingUserStake, setEditingUserStake] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [selectedStakeForRewards, setSelectedStakeForRewards] =
    useState<any>(null);

  const [settingsForm, setSettingsForm] = useState({
    crypto_symbol: "",
    apy_percentage: "",
    min_stake_amount: "",
    max_stake_amount: "",
    lock_period_days: "",
    reward_frequency: "daily",
    is_active: true,
  });

  const [userStakeForm, setUserStakeForm] = useState({
    staked_amount: "",
    apy_at_stake: "",
    status: "active",
    admin_notes: "",
  });

  const [rewardForm, setRewardForm] = useState({
    new_reward_amount: "",
    reason: "",
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    createStakingSettings,
    updateStakingSettings,
    fetchCryptoData,
    stakingSettings,
    allUserStaking,
    stakingAnalytics,
    fetchAllUserStaking,
    editUserStake,
    pauseUserStake,
    resumeUserStake,
    forceUnstake,
    adjustUserRewards,
  } = useCrypto();

  const handleAddSettings = () => {
    setEditingSettings(null);
    setSettingsForm({
      crypto_symbol: "",
      apy_percentage: "",
      min_stake_amount: "",
      max_stake_amount: "",
      lock_period_days: "",
      reward_frequency: "daily",
      is_active: true,
    });
    setShowSettingsModal(true);
  };

  const handleEditSettings = (settings: StakingSettings) => {
    setEditingSettings(settings);
    setSettingsForm({
      crypto_symbol: settings.crypto_symbol,
      apy_percentage: settings.apy_percentage.toString(),
      min_stake_amount: settings.min_stake_amount.toString(),
      max_stake_amount: settings.max_stake_amount.toString(),
      lock_period_days: settings.lock_period_days.toString(),
      reward_frequency: settings.reward_frequency || "daily",
      is_active: settings.is_active,
    });
    setShowSettingsModal(true);
  };

  // Load user staking data when active tab changes
  useEffect(() => {
    if (activeTab === "active") {
      fetchAllUserStaking();
    }
  }, [activeTab, fetchAllUserStaking]);

  const handleSaveSettings = async () => {
    try {
      const settingsData = {
        crypto_symbol: settingsForm.crypto_symbol,
        apy_percentage: parseFloat(settingsForm.apy_percentage),
        min_stake_amount: parseFloat(settingsForm.min_stake_amount),
        max_stake_amount: parseFloat(settingsForm.max_stake_amount),
        lock_period_days: parseInt(settingsForm.lock_period_days),
        reward_frequency: settingsForm.reward_frequency,
        is_active: settingsForm.is_active,
      };

      if (editingSettings) {
        await updateStakingSettings(editingSettings.id, settingsData);
        setToast({
          show: true,
          message: "Staking settings updated successfully",
          type: "success",
        });
      } else {
        await createStakingSettings(settingsData);
        setToast({
          show: true,
          message: "Staking settings created successfully",
          type: "success",
        });
      }
      setShowSettingsModal(false);
      fetchCryptoData();
    } catch (error) {
      setToast({
        show: true,
        message: "Error saving staking settings",
        type: "error",
      });
    }
  };

  // User staking management functions
  const handleEditUserStake = (stake: any) => {
    setEditingUserStake(stake);
    setUserStakeForm({
      staked_amount: stake.staked_amount.toString(),
      apy_at_stake: stake.apy_at_stake.toString(),
      status: stake.status,
      admin_notes: stake.admin_notes || "",
    });
    setShowUserStakeModal(true);
  };

  const handleSaveUserStake = async () => {
    try {
      const result = await editUserStake(editingUserStake.id, {
        staked_amount: parseFloat(userStakeForm.staked_amount),
        apy_at_stake: parseFloat(userStakeForm.apy_at_stake),
        status: userStakeForm.status,
        admin_notes: userStakeForm.admin_notes,
      });

      if (result.success) {
        setToast({
          show: true,
          message: "User stake updated successfully",
          type: "success",
        });
        setShowUserStakeModal(false);
        fetchAllUserStaking();
      } else {
        setToast({
          show: true,
          message: result.error || "Error updating user stake",
          type: "error",
        });
      }
    } catch (error) {
      setToast({
        show: true,
        message: "Error updating user stake",
        type: "error",
      });
    }
  };

  const handlePauseStake = async (stakeId: number) => {
    try {
      const result = await pauseUserStake(stakeId);
      if (result.success) {
        setToast({
          show: true,
          message: "Stake paused successfully",
          type: "success",
        });
        fetchAllUserStaking();
      } else {
        setToast({
          show: true,
          message: result.error || "Error pausing stake",
          type: "error",
        });
      }
    } catch (error) {
      setToast({
        show: true,
        message: "Error pausing stake",
        type: "error",
      });
    }
  };

  const handleResumeStake = async (stakeId: number) => {
    try {
      const result = await resumeUserStake(stakeId);
      if (result.success) {
        setToast({
          show: true,
          message: "Stake resumed successfully",
          type: "success",
        });
        fetchAllUserStaking();
      } else {
        setToast({
          show: true,
          message: result.error || "Error resuming stake",
          type: "error",
        });
      }
    } catch (error) {
      setToast({
        show: true,
        message: "Error resuming stake",
        type: "error",
      });
    }
  };

  const handleForceUnstake = async (stakeId: number) => {
    if (
      !confirm(
        "Are you sure you want to force unstake this position? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const result = await forceUnstake(stakeId);
      if (result.success) {
        setToast({
          show: true,
          message: "Force unstake completed successfully",
          type: "success",
        });
        fetchAllUserStaking();
      } else {
        setToast({
          show: true,
          message: result.error || "Error force unstaking",
          type: "error",
        });
      }
    } catch (error) {
      setToast({
        show: true,
        message: "Error force unstaking",
        type: "error",
      });
    }
  };

  const handleAdjustRewards = (stake: any) => {
    setSelectedStakeForRewards(stake);
    setRewardForm({
      new_reward_amount: stake.rewards_earned.toString(),
      reason: "",
    });
    setShowRewardModal(true);
  };

  const handleSaveRewards = async () => {
    try {
      const result = await adjustUserRewards(
        selectedStakeForRewards.id,
        parseFloat(rewardForm.new_reward_amount),
        rewardForm.reason
      );

      if (result.success) {
        setToast({
          show: true,
          message: "Rewards adjusted successfully",
          type: "success",
        });
        setShowRewardModal(false);
        fetchAllUserStaking();
      } else {
        setToast({
          show: true,
          message: result.error || "Error adjusting rewards",
          type: "error",
        });
      }
    } catch (error) {
      setToast({
        show: true,
        message: "Error adjusting rewards",
        type: "error",
      });
    }
  };

  // Filter user staking data
  const filteredUserStaking = allUserStaking.filter((stake) => {
    const matchesSearch =
      stake.user_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stake.admin_notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stake.crypto_symbol?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || stake.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
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
                </div>
              </div>
            </div>

            <nav className="flex-1 px-6">
              <a
                href="/admin"
                className="flex items-center px-3 py-2 mt-1 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
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
                className="flex items-center px-3 py-2 mt-1 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 rounded-md"
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
                onClick={logout}
                variant="outline"
                className="w-full text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 border-gray-300 dark:border-gray-600"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 ml-0 md:ml-64 p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Staking Management
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Manage staking settings, monitor user positions, and control
                rewards
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg mb-6">
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "settings"
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <Settings className="h-4 w-4 inline mr-2" />
                Settings
              </button>
              <button
                onClick={() => setActiveTab("active")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "active"
                    ? "bg-green-600 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <Users className="h-4 w-4 inline mr-2" />
                Active Staking
              </button>
              <button
                onClick={() => setActiveTab("rewards")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "rewards"
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <Gift className="h-4 w-4 inline mr-2" />
                Rewards
              </button>
              <button
                onClick={() => setActiveTab("controls")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "controls"
                    ? "bg-orange-600 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <Shield className="h-4 w-4 inline mr-2" />
                System Controls
              </button>
            </div>

            {/* Tab Content */}
            <div className="bg-gray-800 rounded-lg p-6">
              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Staking Settings</h2>
                    <Button
                      onClick={handleAddSettings}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Settings
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {stakingSettings && stakingSettings.length > 0 ? (
                      stakingSettings.map((settings) => (
                        <div
                          key={settings.id}
                          className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-4">
                              <h3 className="font-medium text-lg">
                                {settings.crypto_symbol}
                              </h3>
                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  settings.is_active
                                    ? "bg-green-900 text-green-200"
                                    : "bg-red-900 text-red-200"
                                }`}
                              >
                                {settings.is_active ? "Active" : "Inactive"}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm text-gray-400">
                              <div>DIR: {settings.apy_percentage}%</div>
                              <div>Min: {settings.min_stake_amount}</div>
                              <div>Max: {settings.max_stake_amount}</div>
                              <div>Lock: {settings.lock_period_days} days</div>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleEditSettings(settings)}
                            variant="outline"
                            size="sm"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-400">
                          No staking settings found
                        </p>
                        <Button
                          onClick={handleAddSettings}
                          className="mt-4 bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add First Setting
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Active Staking Tab */}
              {activeTab === "active" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">
                      User Staking Management
                    </h2>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => fetchAllUserStaking()}
                        variant="outline"
                        size="sm"
                      >
                        <Activity className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                  </div>

                  {/* Analytics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center">
                        <DollarSign className="h-8 w-8 text-green-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-400">Total Staked</p>
                          <p className="text-xl font-semibold text-white">
                            {stakingAnalytics.totalStaked.toLocaleString()}{" "}
                            PENGU
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center">
                        <Users className="h-8 w-8 text-blue-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-400">Active Users</p>
                          <p className="text-xl font-semibold text-white">
                            {stakingAnalytics.totalUsers}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center">
                        <Gift className="h-8 w-8 text-purple-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-400">Total Rewards</p>
                          <p className="text-xl font-semibold text-white">
                            {stakingAnalytics.totalRewards.toLocaleString()}{" "}
                            PENGU
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center">
                        <TrendingUp className="h-8 w-8 text-orange-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-400">Active Stakes</p>
                          <p className="text-xl font-semibold text-white">
                            {stakingAnalytics.activeStakes}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Search and Filter */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Search by user ID, notes, or crypto symbol..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </div>
                    <div className="sm:w-48">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md"
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="unstaked">Unstaked</option>
                        <option value="force_unstaked">Force Unstaked</option>
                      </select>
                    </div>
                  </div>

                  {/* User Staking Table */}
                  <div className="bg-gray-700 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-800">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                              User
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                              Staked Amount
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                              DRI
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                              Rewards
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                              Status
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                              Staked Date
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-600">
                          {filteredUserStaking.length > 0 ? (
                            filteredUserStaking.map((stake) => (
                              <tr key={stake.id} className="hover:bg-gray-600">
                                <td className="px-4 py-3">
                                  <div>
                                    <p className="text-sm font-medium text-white">
                                      User {stake.user_id?.slice(0, 8)}...
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      ID: {stake.user_id}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      {stake.admin_notes || "No notes"}
                                    </p>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <p className="text-sm text-white">
                                    {stake.staked_amount.toLocaleString()} PENGU
                                  </p>
                                </td>
                                <td className="px-4 py-3">
                                  <p className="text-sm text-white">
                                    {stake.apy_at_stake}%
                                  </p>
                                </td>
                                <td className="px-4 py-3">
                                  <p className="text-sm text-white">
                                    {stake.rewards_earned.toLocaleString()}{" "}
                                    PENGU
                                  </p>
                                </td>
                                <td className="px-4 py-3">
                                  <span
                                    className={`px-2 py-1 rounded text-xs ${
                                      stake.status === "active"
                                        ? "bg-green-900 text-green-200"
                                        : stake.status === "paused"
                                        ? "bg-yellow-900 text-yellow-200"
                                        : stake.status === "unstaked"
                                        ? "bg-blue-900 text-blue-200"
                                        : "bg-red-900 text-red-200"
                                    }`}
                                  >
                                    {stake.status
                                      .replace("_", " ")
                                      .toUpperCase()}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <p className="text-sm text-gray-400">
                                    {new Date(
                                      stake.staked_at
                                    ).toLocaleDateString()}
                                  </p>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      onClick={() => handleEditUserStake(stake)}
                                      variant="outline"
                                      size="sm"
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    {stake.status === "active" && (
                                      <Button
                                        onClick={() =>
                                          handlePauseStake(stake.id)
                                        }
                                        variant="outline"
                                        size="sm"
                                        className="text-yellow-400 border-yellow-400 hover:bg-yellow-400 hover:text-white"
                                      >
                                        <Pause className="h-3 w-3" />
                                      </Button>
                                    )}
                                    {stake.status === "paused" && (
                                      <Button
                                        onClick={() =>
                                          handleResumeStake(stake.id)
                                        }
                                        variant="outline"
                                        size="sm"
                                        className="text-green-400 border-green-400 hover:bg-green-400 hover:text-white"
                                      >
                                        <Play className="h-3 w-3" />
                                      </Button>
                                    )}
                                    <Button
                                      onClick={() => handleAdjustRewards(stake)}
                                      variant="outline"
                                      size="sm"
                                      className="text-purple-400 border-purple-400 hover:bg-purple-400 hover:text-white"
                                    >
                                      <Gift className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      onClick={() =>
                                        handleForceUnstake(stake.id)
                                      }
                                      variant="outline"
                                      size="sm"
                                      className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                                    >
                                      <AlertTriangle className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={7} className="px-4 py-8 text-center">
                                <p className="text-gray-400">
                                  {searchTerm || statusFilter !== "all"
                                    ? "No staking records match your filters"
                                    : "No user staking records found"}
                                </p>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Rewards Tab */}
              {activeTab === "rewards" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">
                      Rewards Management
                    </h2>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => fetchAllUserStaking()}
                        variant="outline"
                        size="sm"
                      >
                        <Activity className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                  </div>

                  {/* Rewards Analytics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center">
                        <Gift className="h-8 w-8 text-purple-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-400">
                            Total Rewards Distributed
                          </p>
                          <p className="text-xl font-semibold text-white">
                            {stakingAnalytics.totalRewards.toLocaleString()}{" "}
                            PENGU
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center">
                        <Users className="h-8 w-8 text-blue-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-400">
                            Users with Rewards
                          </p>
                          <p className="text-xl font-semibold text-white">
                            {
                              allUserStaking.filter(
                                (stake) => stake.rewards_earned > 0
                              ).length
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center">
                        <TrendingUp className="h-8 w-8 text-green-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-400">
                            Average Rewards per User
                          </p>
                          <p className="text-xl font-semibold text-white">
                            {allUserStaking.length > 0
                              ? (
                                  stakingAnalytics.totalRewards /
                                  allUserStaking.length
                                ).toFixed(2)
                              : "0"}{" "}
                            PENGU
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Top Rewards Earners */}
                  <div className="bg-gray-700 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Top Rewards Earners
                    </h3>
                    <div className="space-y-3">
                      {allUserStaking
                        .filter((stake) => stake.rewards_earned > 0)
                        .sort((a, b) => b.rewards_earned - a.rewards_earned)
                        .slice(0, 10)
                        .map((stake, index) => (
                          <div
                            key={stake.id}
                            className="flex items-center justify-between p-3 bg-gray-600 rounded-lg"
                          >
                            <div className="flex items-center">
                              <span className="text-lg font-bold text-gray-400 mr-3">
                                #{index + 1}
                              </span>
                              <div>
                                <p className="text-sm font-medium text-white">
                                  {stake.user_profile?.first_name}{" "}
                                  {stake.user_profile?.last_name}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {stake.user_profile?.email}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-white">
                                {stake.rewards_earned.toLocaleString()} PENGU
                              </p>
                              <p className="text-xs text-gray-400">
                                {stake.staked_amount.toLocaleString()} staked
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Recent Reward Activities */}
                  <div className="bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Recent Reward Activities
                    </h3>
                    <div className="space-y-3">
                      {allUserStaking
                        .filter((stake) => stake.rewards_earned > 0)
                        .sort(
                          (a, b) =>
                            new Date(b.staked_at).getTime() -
                            new Date(a.staked_at).getTime()
                        )
                        .slice(0, 5)
                        .map((stake) => (
                          <div
                            key={stake.id}
                            className="flex items-center justify-between p-3 bg-gray-600 rounded-lg"
                          >
                            <div>
                              <p className="text-sm font-medium text-white">
                                {stake.user_profile?.first_name}{" "}
                                {stake.user_profile?.last_name}
                              </p>
                              <p className="text-xs text-gray-400">
                                Earned {stake.rewards_earned.toLocaleString()}{" "}
                                PENGU rewards
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-400">
                                {new Date(stake.staked_at).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-gray-400">
                                APY: {stake.apy_at_stake}%
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* System Controls Tab */}
              {activeTab === "controls" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">System Controls</h2>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => fetchCryptoData()}
                        variant="outline"
                        size="sm"
                      >
                        <Activity className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                  </div>

                  {/* Emergency Controls */}
                  <div className="bg-gray-700 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-red-400">
                      <AlertTriangle className="h-5 w-5 inline mr-2" />
                      Emergency Controls
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-600 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-white">
                              Emergency Pause All Staking
                            </p>
                            <p className="text-xs text-gray-400">
                              Pause all staking activities immediately
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                          >
                            <Pause className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="bg-gray-600 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-white">
                              Resume All Staking
                            </p>
                            <p className="text-xs text-gray-400">
                              Resume all paused staking activities
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-400 border-green-400 hover:bg-green-400 hover:text-white"
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* System Status */}
                  <div className="bg-gray-700 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                      System Status
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-600 p-4 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              Staking System
                            </p>
                            <p className="text-xs text-gray-400">Operational</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-600 p-4 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              Reward Distribution
                            </p>
                            <p className="text-xs text-gray-400">Active</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-600 p-4 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              Database
                            </p>
                            <p className="text-xs text-gray-400">Connected</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* System Information */}
                  <div className="bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      System Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-600 rounded-lg">
                        <span className="text-sm text-gray-300">
                          Total Active Stakes
                        </span>
                        <span className="text-sm font-medium text-white">
                          {stakingAnalytics.activeStakes}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-600 rounded-lg">
                        <span className="text-sm text-gray-300">
                          Total Staked Amount
                        </span>
                        <span className="text-sm font-medium text-white">
                          {stakingAnalytics.totalStaked.toLocaleString()} PENGU
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-600 rounded-lg">
                        <span className="text-sm text-gray-300">
                          Total Rewards Distributed
                        </span>
                        <span className="text-sm font-medium text-white">
                          {stakingAnalytics.totalRewards.toLocaleString()} PENGU
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-600 rounded-lg">
                        <span className="text-sm text-gray-300">
                          Unique Users
                        </span>
                        <span className="text-sm font-medium text-white">
                          {stakingAnalytics.totalUsers}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Settings Modal */}
        {showSettingsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {editingSettings ? "Edit" : "Add"} Staking Settings
                </h2>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="text-gray-400 hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Crypto Symbol
                  </label>
                  <Input
                    type="text"
                    value={settingsForm.crypto_symbol}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        crypto_symbol: e.target.value,
                      })
                    }
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="e.g., PENGU"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      DIR Percentage
                    </label>
                    <Input
                      type="number"
                      value={settingsForm.apy_percentage}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          apy_percentage: e.target.value,
                        })
                      }
                      className="bg-gray-700 border-gray-600 text-white"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Lock Period (days)
                    </label>
                    <Input
                      type="number"
                      value={settingsForm.lock_period_days}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          lock_period_days: e.target.value,
                        })
                      }
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Min Stake Amount
                    </label>
                    <Input
                      type="number"
                      value={settingsForm.min_stake_amount}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          min_stake_amount: e.target.value,
                        })
                      }
                      className="bg-gray-700 border-gray-600 text-white"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Max Stake Amount
                    </label>
                    <Input
                      type="number"
                      value={settingsForm.max_stake_amount}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          max_stake_amount: e.target.value,
                        })
                      }
                      className="bg-gray-700 border-gray-600 text-white"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={handleSaveSettings}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingSettings ? "Update" : "Create"}
                  </Button>
                  <Button
                    onClick={() => setShowSettingsModal(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Stake Edit Modal */}
        {showUserStakeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Edit User Stake
                </h2>
                <button
                  onClick={() => setShowUserStakeModal(false)}
                  className="text-gray-400 hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    User
                  </label>
                  <p className="text-white bg-gray-700 p-2 rounded">
                    {editingUserStake?.user_profile?.first_name}{" "}
                    {editingUserStake?.user_profile?.last_name}
                    <br />
                    <span className="text-gray-400">
                      {editingUserStake?.user_profile?.email}
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Staked Amount
                    </label>
                    <Input
                      type="number"
                      value={userStakeForm.staked_amount}
                      onChange={(e) =>
                        setUserStakeForm({
                          ...userStakeForm,
                          staked_amount: e.target.value,
                        })
                      }
                      className="bg-gray-700 border-gray-600 text-white"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      DRI at Stake
                    </label>
                    <Input
                      type="number"
                      value={userStakeForm.apy_at_stake}
                      onChange={(e) =>
                        setUserStakeForm({
                          ...userStakeForm,
                          apy_at_stake: e.target.value,
                        })
                      }
                      className="bg-gray-700 border-gray-600 text-white"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={userStakeForm.status}
                    onChange={(e) =>
                      setUserStakeForm({
                        ...userStakeForm,
                        status: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md"
                  >
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="unstaked">Unstaked</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Admin Notes
                  </label>
                  <textarea
                    value={userStakeForm.admin_notes}
                    onChange={(e) =>
                      setUserStakeForm({
                        ...userStakeForm,
                        admin_notes: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md"
                    rows={3}
                    placeholder="Optional notes about this stake..."
                  />
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={handleSaveUserStake}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Update Stake
                  </Button>
                  <Button
                    onClick={() => setShowUserStakeModal(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reward Adjustment Modal */}
        {showRewardModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Adjust User Rewards
                </h2>
                <button
                  onClick={() => setShowRewardModal(false)}
                  className="text-gray-400 hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    User
                  </label>
                  <p className="text-white bg-gray-700 p-2 rounded">
                    {selectedStakeForRewards?.user_profile?.first_name}{" "}
                    {selectedStakeForRewards?.user_profile?.last_name}
                    <br />
                    <span className="text-gray-400">
                      {selectedStakeForRewards?.user_profile?.email}
                    </span>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Current Rewards
                  </label>
                  <p className="text-white bg-gray-700 p-2 rounded">
                    {selectedStakeForRewards?.rewards_earned.toLocaleString()}{" "}
                    PENGU
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    New Reward Amount
                  </label>
                  <Input
                    type="number"
                    value={rewardForm.new_reward_amount}
                    onChange={(e) =>
                      setRewardForm({
                        ...rewardForm,
                        new_reward_amount: e.target.value,
                      })
                    }
                    className="bg-gray-700 border-gray-600 text-white"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Reason for Adjustment
                  </label>
                  <textarea
                    value={rewardForm.reason}
                    onChange={(e) =>
                      setRewardForm({
                        ...rewardForm,
                        reason: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md"
                    rows={3}
                    placeholder="Explain why you're adjusting the rewards..."
                  />
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={handleSaveRewards}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    <Gift className="h-4 w-4 mr-2" />
                    Adjust Rewards
                  </Button>
                  <Button
                    onClick={() => setShowRewardModal(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
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
    </ProtectedRoute>
  );
}
