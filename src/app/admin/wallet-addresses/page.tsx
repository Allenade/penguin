"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/hooks/useAuth";
import { supabase } from "@/lib/supabase";

// Define proper types for Supabase operations
type SupabaseResponse<T> = {
  data: T | null;
  error: any;
};

type DepositAddressData = {
  crypto_symbol: string;
  network: string;
  instructions: string;
  min_deposit: number;
  max_deposit: number;
  icon_url: string | null;
  is_active: boolean;
};

type WithdrawalAddressData = {
  crypto_symbol: string;
  network: string;
  daily_limit: number;
  min_withdrawal: number;
  max_withdrawal: number;
  icon_url: string | null;
  is_active: boolean;
  is_automated: boolean;
};
import Toast from "@/components/Toast";
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
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Download,
  Upload,
  Image as ImageIcon,
  X as XIcon,
  TrendingUp,
} from "lucide-react";

interface DepositAddress {
  id: number;
  crypto_symbol: string;
  network: string;
  address: string;
  qr_code_url: string | null;
  instructions: string;
  is_active: boolean;
  min_deposit: number;
  max_deposit: number;
  icon_url?: string;
}

interface WithdrawalAddress {
  id: number;
  crypto_symbol: string;
  network: string;
  address: string;
  private_key_encrypted: string | null;
  is_active: boolean;
  is_automated: boolean;
  daily_limit: number;
  icon_url?: string;
}

interface WithdrawalRequest {
  id: number;
  crypto_symbol: string;
  amount: number;
  user_address: string;
  status: string;
  created_at: string;
  user_profiles?: {
    email: string;
    first_name?: string;
    last_name?: string;
  };
}

export default function WalletAddressesPage() {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"deposit" | "withdrawal">(
    "deposit"
  );
  const [depositAddresses, setDepositAddresses] = useState<DepositAddress[]>(
    []
  );
  const [withdrawalAddresses, setWithdrawalAddresses] = useState<
    WithdrawalAddress[]
  >([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<
    WithdrawalRequest[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPrivateKeys, setShowPrivateKeys] = useState(false);
  const [editingAddress, setEditingAddress] = useState<
    DepositAddress | WithdrawalAddress | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const handleLogout = async () => {
    await logout();
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Accept any image format
      const validImageTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml",
        "image/bmp",
        "image/tiff",
        "image/x-icon",
        "image/vnd.microsoft.icon",
      ];

      if (!validImageTypes.includes(file.type)) {
        setToast({
          show: true,
          message:
            "Please select a valid image file (JPEG, PNG, GIF, WebP, SVG, etc.)",
          type: "error",
        });
        return;
      }

      // Validate file size (max 10MB for better support)
      if (file.size > 10 * 1024 * 1024) {
        setToast({
          show: true,
          message: "Image size must be less than 10MB",
          type: "error",
        });
        return;
      }

      // Optimize the image before storing
      const optimizedFile = await optimizeImage(file);
      setUploadedImage(optimizedFile);

      // Create preview with optimized image
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        // Also update the form data with the base64 data
        setFormData((prev) => ({
          ...prev,
          icon_url: result,
        }));
      };
      reader.readAsDataURL(optimizedFile);

      setToast({
        show: true,
        message: `Image uploaded and optimized successfully: ${file.name}`,
        type: "success",
      });
    }
  };

  const removeUploadedImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
    setFormData((prev) => ({
      ...prev,
      icon_url: "",
    }));
  };

  const optimizeImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Set canvas size (max 128x128 for icons to reduce size)
        const maxSize = 128;
        let { width, height } = img;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress image
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const optimizedFile = new File([blob], file.name, {
                type: "image/png",
                lastModified: Date.now(),
              });
              resolve(optimizedFile);
            } else {
              resolve(file);
            }
          },
          "image/png",
          0.6
        ); // 60% quality for smaller size
      };

      img.src = URL.createObjectURL(file);
    });
  };

  // Form state for new/edit address
  const [formData, setFormData] = useState({
    crypto_symbol: "",
    network: "",
    instructions: "",
    min_deposit: "",
    max_deposit: "",
    min_withdrawal: "",
    max_withdrawal: "",
    daily_limit: "",
    icon_url: "",
    is_active: true,
    is_automated: false,
  });

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);

      // Fetch deposit addresses
      const { data: depositData, error: depositError } = await (supabase as any)
        .from("deposit_addresses")
        .select("*")
        .order("crypto_symbol");

      if (depositError) throw depositError;

      // Fetch withdrawal addresses
      const { data: withdrawalData, error: withdrawalError } = await (
        supabase as any
      )
        .from("withdrawal_addresses")
        .select("*")
        .order("crypto_symbol");

      if (withdrawalError) throw withdrawalError;

      console.log(
        "Fetched deposit addresses:",
        depositData?.map((addr: DepositAddress) => ({
          id: addr.id,
          symbol: addr.crypto_symbol,
          icon_url: addr.icon_url
            ? addr.icon_url.substring(0, 50) + "..."
            : "null",
          icon_length: addr.icon_url ? addr.icon_url.length : 0,
        }))
      );

      // Check if any addresses have icon_url data
      const addressesWithIcons = depositData?.filter(
        (addr: DepositAddress) => addr.icon_url && addr.icon_url.length > 0
      );
      console.log("📊 Addresses with icons:", addressesWithIcons?.length || 0);
      if (addressesWithIcons && addressesWithIcons.length > 0) {
        console.log(
          "📋 Addresses with icons:",
          addressesWithIcons.map((addr: DepositAddress) => ({
            id: addr.id,
            symbol: addr.crypto_symbol,
            icon_length: addr.icon_url?.length || 0,
          }))
        );
      }
      console.log(
        "Fetched withdrawal addresses:",
        withdrawalData?.map((addr: WithdrawalAddress) => ({
          symbol: addr.crypto_symbol,
          icon_url: addr.icon_url
            ? addr.icon_url.substring(0, 50) + "..."
            : "null",
        }))
      );

      setDepositAddresses(depositData || []);
      setWithdrawalAddresses(withdrawalData || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setToast({
        show: true,
        message: "Failed to fetch addresses",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWithdrawalRequests = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("withdrawal_requests")
        .select(
          `
          *,
          user_profiles!inner(
            user_id,
            email,
            first_name,
            last_name
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      setWithdrawalRequests(data || []);
    } catch (error) {
      console.error("Error fetching withdrawal requests:", error);
      setToast({
        show: true,
        message: "Failed to fetch withdrawal requests",
        type: "error",
      });
    }
  };

  const updateRequestStatus = async (
    requestId: number,
    status: "pending" | "approved" | "rejected" | "processing" | "completed",
    adminNotes?: string,
    transactionHash?: string
  ) => {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (adminNotes !== undefined) {
        updateData.admin_notes = adminNotes;
      }

      if (transactionHash !== undefined) {
        updateData.transaction_hash = transactionHash;
      }

      const { error } = await (supabase as any)
        .from("withdrawal_requests")
        .update(updateData)
        .eq("id", requestId);

      if (error) throw error;

      setToast({
        show: true,
        message: `Request ${status} successfully`,
        type: "success",
      });

      // Refresh the requests list
      await fetchWithdrawalRequests();
    } catch (error) {
      console.error("Error updating request status:", error);
      setToast({
        show: true,
        message: "Failed to update request status",
        type: "error",
      });
    }
  };

  useEffect(() => {
    fetchAddresses();
    fetchWithdrawalRequests();
  }, []);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast({
        show: true,
        message: "Address copied to clipboard!",
        type: "success",
      });
    } catch {
      setToast({
        show: true,
        message: "Failed to copy address",
        type: "error",
      });
    }
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setFormData({
      crypto_symbol: "",
      network: "",
      instructions: "",
      min_deposit: "",
      max_deposit: "",
      min_withdrawal: "",
      max_withdrawal: "",
      daily_limit: "",
      icon_url: "",
      is_active: true,
      is_automated: false,
    });
    setUploadedImage(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const handleEdit = (address: DepositAddress | WithdrawalAddress) => {
    console.log("🖊️ Editing address:", {
      id: address.id,
      symbol: address.crypto_symbol,
      current_icon_url: address.icon_url ? "Has icon" : "No icon",
    });

    const formDataToSet = {
      crypto_symbol: address.crypto_symbol,
      network: address.network,
      instructions: "instructions" in address ? address.instructions : "",
      min_deposit:
        "min_deposit" in address ? address.min_deposit.toString() : "",
      max_deposit:
        "max_deposit" in address ? address.max_deposit.toString() : "",
      min_withdrawal:
        "min_withdrawal" in address ? address.min_withdrawal.toString() : "",
      max_withdrawal:
        "max_withdrawal" in address ? address.max_withdrawal.toString() : "",
      daily_limit:
        "daily_limit" in address ? address.daily_limit.toString() : "",
      icon_url: address.icon_url || "",
      is_active: address.is_active,
      is_automated: "is_automated" in address ? address.is_automated : false,
    };

    console.log("📝 Setting form data:", formDataToSet);

    setEditingAddress(address);
    setFormData(formDataToSet);

    // Set the image preview if there's an existing icon_url
    if (address.icon_url) {
      // Check if it's an external URL that might fail
      if (address.icon_url.startsWith("http")) {
        console.log("⚠️ External URL detected in edit, clearing it");
        setImagePreview(null);
        setFormData((prev) => ({
          ...prev,
          icon_url: "", // Clear external URLs
        }));
      } else {
        setImagePreview(address.icon_url);
      }
    } else {
      setImagePreview(null);
    }

    setUploadedImage(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number, type: "deposit" | "withdrawal") => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      const table =
        type === "deposit" ? "deposit_addresses" : "withdrawal_addresses";
      const { error } = await (supabase as any)
        .from(table)
        .delete()
        .eq("id", id);

      if (error) throw error;

      setToast({
        show: true,
        message: "Address deleted successfully",
        type: "success",
      });

      fetchAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
      setToast({
        show: true,
        message: "Failed to delete address",
        type: "error",
      });
    }
  };

  const handleSave = async () => {
    try {
      console.log("=== Starting save process ===");
      console.log(
        "Editing address:",
        editingAddress
          ? {
              id: editingAddress.id,
              symbol: editingAddress.crypto_symbol,
            }
          : "New address"
      );
      console.log("📋 Current form data:", {
        crypto_symbol: formData.crypto_symbol,
        network: formData.network,
        address: formData.address,
        instructions: formData.instructions,
        min_deposit: formData.min_deposit,
        max_deposit: formData.max_deposit,
        icon_url: formData.icon_url ? "Has data" : "No data",
      });
      console.log("Uploaded image:", uploadedImage ? "Yes" : "No");
      console.log("Image preview:", imagePreview ? "Yes" : "No");

      // Determine the final icon URL
      let finalIconUrl = formData.icon_url;

      // If we have an uploaded image, use its base64 data (this takes precedence)
      if (uploadedImage && imagePreview) {
        finalIconUrl = imagePreview;
        console.log("✅ Using uploaded image base64 data");
        console.log("Base64 length:", finalIconUrl.length);
      } else if (
        formData.icon_url &&
        formData.icon_url.trim() !== "" &&
        formData.icon_url.startsWith("data:image")
      ) {
        // Use the existing base64 data from form data
        finalIconUrl = formData.icon_url;
        console.log("✅ Using existing base64 data from form");
        console.log("Base64 length:", finalIconUrl.length);
      } else if (formData.icon_url && formData.icon_url.trim() !== "") {
        // Check if it's an external URL that might fail
        if (formData.icon_url.startsWith("http")) {
          console.log(
            "⚠️ External URL detected, clearing it to prevent 403 errors"
          );
          finalIconUrl = null; // Clear external URLs to prevent 403 errors
        } else {
          finalIconUrl = formData.icon_url;
          console.log("✅ Using existing icon URL from form data");
          console.log("URL length:", finalIconUrl.length);
        }
      } else {
        // No icon data
        finalIconUrl = null;
        console.log("ℹ️ No icon data to save");
      }

      console.log(
        "📝 Final icon_url preview:",
        finalIconUrl ? finalIconUrl.substring(0, 100) + "..." : "null"
      );

      // Check if the icon_url is too large (base64 can be very long)
      if (finalIconUrl && finalIconUrl.length > 50000) {
        console.warn(
          "⚠️ Icon URL is very large, consider using a smaller image"
        );
        setToast({
          show: true,
          message:
            "Image is very large. Please use a smaller image for better performance.",
          type: "error",
        });
        return;
      }

      if (activeTab === "deposit") {
        console.log(
          "🔧 Creating address data with finalIconUrl:",
          finalIconUrl ? "Has data" : "null"
        );

        const addressData = {
          crypto_symbol: formData.crypto_symbol,
          network: formData.network,
          instructions: formData.instructions,
          min_deposit: parseFloat(formData.min_deposit) || 0,
          max_deposit: parseFloat(formData.max_deposit) || 999999,
          icon_url: finalIconUrl || null,
          is_active: formData.is_active,
        };

        console.log(
          "🔧 Address data icon_url:",
          addressData.icon_url ? "Has data" : "null"
        );
        console.log(
          "🔧 Address data icon_url length:",
          addressData.icon_url ? addressData.icon_url.length : 0
        );

        console.log("🗄️ Saving deposit address data:", {
          ...addressData,
          icon_url: addressData.icon_url
            ? `${addressData.icon_url.substring(0, 50)}...`
            : null,
        });

        if (editingAddress) {
          console.log(
            "🔄 Updating existing deposit address with ID:",
            editingAddress.id
          );
          const { data, error } = await (supabase as any)
            .from("deposit_addresses")
            .update(addressData)
            .eq("id", editingAddress.id)
            .select();

          if (error) {
            console.error("❌ Error updating deposit address:", error);
            throw error;
          }
          console.log("✅ Deposit address updated successfully:", data);
        } else {
          console.log("➕ Creating new deposit address");
          const { data, error } = await (supabase as any)
            .from("deposit_addresses")
            .insert(addressData)
            .select();

          if (error) {
            console.error("❌ Error creating deposit address:", error);
            throw error;
          }
          console.log("✅ Deposit address created successfully:", data);
        }
      } else {
        console.log(
          "🔧 Creating withdrawal address data with finalIconUrl:",
          finalIconUrl ? "Has data" : "null"
        );

        const addressData = {
          crypto_symbol: formData.crypto_symbol,
          network: formData.network,
          daily_limit: parseFloat(formData.daily_limit) || 999999,
          min_withdrawal: parseFloat(formData.min_withdrawal) || 0,
          max_withdrawal: parseFloat(formData.max_withdrawal) || 999999,
          icon_url: finalIconUrl || null,
          is_active: formData.is_active,
          is_automated: formData.is_automated,
        };

        console.log(
          "🔧 Withdrawal address data icon_url:",
          addressData.icon_url ? "Has data" : "null"
        );
        console.log(
          "🔧 Withdrawal address data icon_url length:",
          addressData.icon_url ? addressData.icon_url.length : 0
        );

        console.log("🗄️ Saving withdrawal address data:", {
          ...addressData,
          icon_url: addressData.icon_url
            ? `${addressData.icon_url.substring(0, 50)}...`
            : null,
        });

        if (editingAddress) {
          console.log(
            "🔄 Updating existing withdrawal address with ID:",
            editingAddress.id
          );
          const { data, error } = await (supabase as any)
            .from("withdrawal_addresses")
            .update(addressData)
            .eq("id", editingAddress.id)
            .select();

          if (error) {
            console.error("❌ Error updating withdrawal address:", error);
            throw error;
          }
          console.log("✅ Withdrawal address updated successfully:", data);
        } else {
          console.log("➕ Creating new withdrawal address");
          const { data, error } = await (supabase as any)
            .from("withdrawal_addresses")
            .insert(addressData)
            .select();

          if (error) {
            console.error("❌ Error creating withdrawal address:", error);
            throw error;
          }
          console.log("✅ Withdrawal address created successfully:", data);
        }
      }

      console.log("🎉 Save completed successfully!");

      setToast({
        show: true,
        message: `Address ${editingAddress ? "updated" : "added"} successfully`,
        type: "success",
      });

      setIsModalOpen(false);
      setUploadedImage(null);
      setImagePreview(null);

      console.log("🔄 Refreshing address list...");
      await fetchAddresses();
      console.log("✅ Address list refreshed");

      // Debug: Check what was actually saved for this specific address
      if (editingAddress) {
        console.log(
          "🔍 Checking saved data for address ID:",
          editingAddress.id
        );
        const { data: savedData, error } = await (supabase as any)
          .from("deposit_addresses")
          .select("crypto_symbol, icon_url")
          .eq("id", editingAddress.id)
          .single();

        if (error) {
          console.error("❌ Error checking saved data:", error);
        } else {
          console.log("✅ Saved data:", {
            symbol: savedData.crypto_symbol,
            has_icon: savedData.icon_url ? "Yes" : "No",
            icon_preview: savedData.icon_url
              ? savedData.icon_url.substring(0, 50) + "..."
              : "null",
            icon_length: savedData.icon_url ? savedData.icon_url.length : 0,
          });

          // Also check what's in the fetched data for this specific address
          const fetchedAddress = depositAddresses.find(
            (addr) => addr.id === editingAddress.id
          );
          if (fetchedAddress) {
            console.log("🔍 Fetched data for this address:", {
              symbol: fetchedAddress.crypto_symbol,
              has_icon: fetchedAddress.icon_url ? "Yes" : "No",
              icon_preview: fetchedAddress.icon_url
                ? fetchedAddress.icon_url.substring(0, 50) + "..."
                : "null",
            });
          } else {
            console.log("❌ Address not found in fetched data!");
          }
        }
      }
    } catch (error) {
      console.error("💥 Error saving address:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });

      let errorMessage = "Failed to save address";
      if (error.message) {
        errorMessage = `Save failed: ${error.message}`;
      }

      setToast({
        show: true,
        message: errorMessage,
        type: "error",
      });
    }
  };

  const getCryptoIcon = (symbol: string, iconUrl?: string) => {
    console.log(
      `Getting icon for ${symbol}:`,
      iconUrl ? "Has icon URL" : "No icon URL"
    );

    if (iconUrl && iconUrl.trim() !== "") {
      // Check if it's a base64 data URL
      const isBase64 = iconUrl.startsWith("data:image");
      console.log(
        `Icon for ${symbol} is ${isBase64 ? "base64" : "URL"}:`,
        iconUrl.substring(0, 100) + "..."
      );

      return (
        <img
          src={iconUrl}
          alt={symbol}
          className="w-8 h-8 rounded-full object-cover"
          onError={(e) => {
            console.log(
              `Image failed to load for ${symbol}:`,
              iconUrl?.substring(0, 100) + "..."
            );
            // Fallback to emoji if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            // Show emoji fallback
            const emojiSpan = document.createElement("span");
            emojiSpan.textContent = getEmojiIcon(symbol);
            emojiSpan.className = "text-2xl";
            target.parentNode?.appendChild(emojiSpan);
          }}
          onLoad={() => {
            console.log(`Image loaded successfully for ${symbol}`);
          }}
        />
      );
    }
    console.log(`Using emoji fallback for ${symbol}`);
    return getEmojiIcon(symbol);
  };

  const getEmojiIcon = (symbol: string) => {
    switch (symbol) {
      case "PENGU":
        return "🐧";
      case "SOL":
        return "🔵";
      case "ETH":
        return "🟠";
      case "BTC":
        return "🟡";
      case "USDT":
        return "💚";
      default:
        return "💰";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading wallet addresses...</p>
        </div>
      </div>
    );
  }

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
                className="flex items-center px-3 py-2 mt-1 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 rounded-md"
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

            {/* Wallet Addresses Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Wallet Addresses
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Manage deposit and withdrawal addresses
              </p>
            </div>

            {/* Wallet Addresses Content */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="space-y-6">
                {/* Tab Navigation */}
                <div className="flex space-x-1 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
                  <button
                    onClick={() => setActiveTab("deposit")}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      activeTab === "deposit"
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    <Download className="h-4 w-4 inline mr-2" />
                    Deposit Addresses
                  </button>
                  <button
                    onClick={() => setActiveTab("withdrawal")}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      activeTab === "withdrawal"
                        ? "bg-red-600 text-white"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    <Upload className="h-4 w-4 inline mr-2" />
                    Withdrawal Addresses
                  </button>
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={handleAddNew}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Address
                    </Button>
                    {activeTab === "withdrawal" && (
                      <Button
                        onClick={() => setShowPrivateKeys(!showPrivateKeys)}
                        variant="outline"
                      >
                        {showPrivateKeys ? (
                          <EyeOff className="h-4 w-4 mr-2" />
                        ) : (
                          <Eye className="h-4 w-4 mr-2" />
                        )}
                        {showPrivateKeys ? "Hide" : "Show"} Private Keys
                      </Button>
                    )}
                  </div>
                  <div className="text-sm text-gray-400">
                    {activeTab === "deposit"
                      ? depositAddresses.length
                      : withdrawalAddresses.length}{" "}
                    addresses
                  </div>
                </div>

                {/* Withdrawal Request Notifications */}
                {activeTab === "withdrawal" &&
                  withdrawalRequests.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3 text-yellow-400">
                        ⚠️ Pending Withdrawal Requests (
                        {
                          withdrawalRequests.filter(
                            (r: any) => r.status === "pending"
                          ).length
                        }
                        )
                      </h3>
                      <div className="space-y-3">
                        {withdrawalRequests
                          .filter(
                            (request: any) => request.status === "pending"
                          )
                          .slice(0, 3)
                          .map((request: any) => (
                            <div
                              key={request.id}
                              className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-3"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="text-xl">
                                    {getCryptoIcon(request.crypto_symbol)}
                                  </div>
                                  <div>
                                    <p className="font-medium text-yellow-200">
                                      {request.amount} {request.crypto_symbol}
                                    </p>
                                    <p className="text-sm text-yellow-300">
                                      {request.user_profiles?.email ||
                                        "Unknown User"}
                                    </p>
                                    <p className="text-xs text-yellow-400">
                                      {new Date(
                                        request.created_at
                                      ).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    onClick={() =>
                                      updateRequestStatus(
                                        request.id,
                                        "approved"
                                      )
                                    }
                                    variant="outline"
                                    size="sm"
                                    className="text-green-400 hover:text-green-300 border-green-600"
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      updateRequestStatus(
                                        request.id,
                                        "rejected"
                                      )
                                    }
                                    variant="outline"
                                    size="sm"
                                    className="text-red-400 hover:text-red-300 border-red-600"
                                  >
                                    Reject
                                  </Button>
                                </div>
                              </div>
                              <p className="text-sm text-yellow-300 mt-2">
                                <strong>User Address:</strong>{" "}
                                {request.user_address}
                              </p>
                            </div>
                          ))}
                      </div>
                      {withdrawalRequests.filter(
                        (r: any) => r.status === "pending"
                      ).length > 3 && (
                        <p className="text-sm text-yellow-400 mt-2">
                          +
                          {withdrawalRequests.filter(
                            (r: any) => r.status === "pending"
                          ).length - 3}{" "}
                          more pending requests
                        </p>
                      )}
                    </div>
                  )}

                {/* Addresses List */}
                <div className="space-y-4">
                  {(activeTab === "deposit"
                    ? depositAddresses
                    : withdrawalAddresses
                  ).map((address: any) => (
                    <div
                      key={address.id}
                      className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl flex items-center">
                            {getCryptoIcon(
                              address.crypto_symbol,
                              address.icon_url
                            )}
                            <span></span>
                          </div>
                          <div>
                            <h3 className="font-medium">
                              {address.crypto_symbol}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {address.network}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              address.is_active
                                ? "bg-green-900 text-green-200"
                                : "bg-red-900 text-red-200"
                            }`}
                          >
                            {address.is_active ? "Active" : "Inactive"}
                          </span>

                          {activeTab === "deposit" && (
                            <Button
                              onClick={() => copyToClipboard(address.address)}
                              variant="outline"
                              size="sm"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          )}

                          <Button
                            onClick={() => {
                              console.log(
                                "🔘 Edit button clicked for:",
                                address.crypto_symbol,
                                "ID:",
                                address.id
                              );
                              handleEdit(address);
                            }}
                            variant="outline"
                            size="sm"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            onClick={() => handleDelete(address.id, activeTab)}
                            variant="outline"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {activeTab === "deposit" && (
                        <div className="mt-3">
                          <code className="bg-gray-200 dark:bg-gray-600 px-3 py-2 rounded text-sm font-mono text-gray-900 dark:text-gray-100 break-all">
                            {address.address}
                          </code>
                        </div>
                      )}

                      {activeTab === "deposit" && "instructions" in address && (
                        <div className="mt-2 text-sm text-gray-400">
                          {address.instructions}
                        </div>
                      )}

                      {activeTab === "withdrawal" &&
                        "is_automated" in address && (
                          <div className="mt-2 flex items-center space-x-4 text-sm">
                            <span
                              className={`px-2 py-1 rounded ${
                                address.is_automated
                                  ? "bg-blue-900 text-blue-200"
                                  : "bg-gray-700 text-gray-300"
                              }`}
                            >
                              {address.is_automated ? "Automated" : "Manual"}
                            </span>
                            <span className="text-gray-400">
                              Daily Limit: {address.daily_limit}
                            </span>
                          </div>
                        )}
                    </div>
                  ))}
                </div>

                {/* Add/Edit Modal */}
                {isModalOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                      <h3 className="text-lg font-semibold mb-4">
                        {editingAddress ? "Edit" : "Add"}{" "}
                        {activeTab === "deposit" ? "Deposit" : "Withdrawal"}{" "}
                        Address
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Crypto Symbol
                          </label>
                          <Input
                            value={formData.crypto_symbol}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                crypto_symbol: e.target.value,
                              })
                            }
                            placeholder="PENGU, SOL, ETH, BTC, USDT"
                            className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Network
                          </label>
                          <Input
                            value={formData.network}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                network: e.target.value,
                              })
                            }
                            placeholder="mainnet, testnet, polygon"
                            className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Crypto Icon
                          </label>

                          {/* File Upload Area */}
                          <div className="space-y-3">
                            {/* Upload Button */}
                            <div className="flex items-center space-x-3">
                              <label className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors">
                                <ImageIcon className="h-4 w-4" />
                                <span>Upload Image</span>
                                <input
                                  type="file"
                                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml,image/bmp,image/tiff,image/x-icon"
                                  onChange={handleFileUpload}
                                  className="hidden"
                                />
                              </label>

                              {/* URL Input (Alternative) */}
                              <div className="flex-1">
                                <Input
                                  value={formData.icon_url}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      icon_url: e.target.value,
                                    })
                                  }
                                  placeholder="Or enter image URL"
                                  className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                                />
                              </div>
                            </div>

                            {/* Image Preview */}
                            {(imagePreview || formData.icon_url) && (
                              <div className="flex items-center space-x-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <div className="relative">
                                  <img
                                    src={imagePreview || formData.icon_url}
                                    alt="Icon preview"
                                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                                    onError={(e) => {
                                      const target =
                                        e.target as HTMLImageElement;
                                      target.style.display = "none";
                                    }}
                                  />
                                  {imagePreview && (
                                    <button
                                      onClick={removeUploadedImage}
                                      className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                                    >
                                      <XIcon className="h-3 w-3" />
                                    </button>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {uploadedImage
                                      ? uploadedImage.name
                                      : "Custom Icon"}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {uploadedImage
                                      ? `${(uploadedImage.size / 1024).toFixed(
                                          1
                                        )} KB`
                                      : "URL Image"}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Instructions */}
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              <p>
                                • Upload any image format: JPEG, PNG, GIF, WebP,
                                SVG, BMP, TIFF, ICO (max 10MB)
                              </p>
                              <p>• Or enter an image URL</p>
                              <p>• Leave empty to use default emoji icon</p>
                            </div>
                          </div>
                        </div>

                        {activeTab === "deposit" && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Instructions
                              </label>
                              <Textarea
                                value={formData.instructions}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    instructions: e.target.value,
                                  })
                                }
                                placeholder="Deposit instructions for users"
                                className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                                rows={3}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  Min Deposit
                                </label>
                                <Input
                                  type="number"
                                  value={formData.min_deposit}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      min_deposit: e.target.value,
                                    })
                                  }
                                  className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  Max Deposit
                                </label>
                                <Input
                                  type="number"
                                  value={formData.max_deposit}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      max_deposit: e.target.value,
                                    })
                                  }
                                  className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                                />
                              </div>
                            </div>
                          </>
                        )}

                        {activeTab === "withdrawal" && (
                          <>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  Min Withdrawal
                                </label>
                                <Input
                                  type="number"
                                  value={formData.min_withdrawal}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      min_withdrawal: e.target.value,
                                    })
                                  }
                                  className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  Max Withdrawal
                                </label>
                                <Input
                                  type="number"
                                  value={formData.max_withdrawal}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      max_withdrawal: e.target.value,
                                    })
                                  }
                                  className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Daily Limit
                              </label>
                              <Input
                                type="number"
                                value={formData.daily_limit}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    daily_limit: e.target.value,
                                  })
                                }
                                className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                              />
                            </div>

                            <div className="flex items-center space-x-4">
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={formData.is_active}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      is_active: e.target.checked,
                                    })
                                  }
                                  className="mr-2"
                                />
                                <span className="text-sm text-gray-300">
                                  Active
                                </span>
                              </label>

                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={formData.is_automated}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      is_automated: e.target.checked,
                                    })
                                  }
                                  className="mr-2"
                                />
                                <span className="text-sm text-gray-300">
                                  Automated
                                </span>
                              </label>
                            </div>
                          </>
                        )}

                        <div className="flex space-x-3">
                          <Button
                            onClick={handleSave}
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                          >
                            {editingAddress ? "Update" : "Add"} Address
                          </Button>
                          <Button
                            onClick={() => {
                              setIsModalOpen(false);
                              setUploadedImage(null);
                              setImagePreview(null);
                            }}
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
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
