"use client";

import { useEffect } from "react";
import { CheckCircle, X, AlertCircle } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  isVisible: boolean;
  onClose: () => void;
}

export default function Toast({
  message,
  type,
  isVisible,
  onClose,
}: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      default:
        return <AlertCircle className="h-5 w-5 text-blue-400" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-500/20 border-green-500/30";
      case "error":
        return "bg-red-500/20 border-red-500/30";
      default:
        return "bg-blue-500/20 border-blue-500/30";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-2 duration-300">
      <div
        className={`flex items-center space-x-3 p-4 rounded-lg border backdrop-blur-lg ${getBgColor()}`}
      >
        {getIcon()}
        <span className="text-white font-medium">{message}</span>
        <button
          onClick={onClose}
          className="text-gray-300 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
