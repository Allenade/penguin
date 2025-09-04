"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, X, Check, RotateCcw, Eye, EyeOff } from "lucide-react";
import { useContent } from "@/lib/hooks/useContent";
import Toast from "@/components/Toast";

interface UserContentEditorProps {
  pageName: string;
  sectionName: string;
  label: string;
  type: "text" | "textarea";
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export default function UserContentEditor({
  pageName,
  sectionName,
  label,
  type,
  description,
  children,
  className = "",
}: UserContentEditorProps) {
  const {
    getContent,
    getUserContent,
    getGlobalContent,
    hasUserContent,
    updateUserContent,
    deleteUserContent,
  } = useContent(pageName);

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const currentValue = getContent(sectionName);
  const userValue = getUserContent(sectionName);
  const globalValue = getGlobalContent(sectionName);
  const hasCustomContent = hasUserContent(sectionName);

  const handleEdit = () => {
    setEditValue(currentValue);
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    const result = await updateUserContent(sectionName, editValue);
    setIsLoading(false);

    if (result.success) {
      setToast({
        show: true,
        message: "Content saved successfully!",
        type: "success",
      });
      setIsEditing(false);
    } else {
      setToast({
        show: true,
        message: "Failed to save content",
        type: "error",
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue("");
  };

  const handleResetToGlobal = async () => {
    setIsLoading(true);
    const result = await deleteUserContent(sectionName);
    setIsLoading(false);

    if (result.success) {
      setToast({
        show: true,
        message: "Reset to global content!",
        type: "success",
      });
    } else {
      setToast({
        show: true,
        message: "Failed to reset content",
        type: "error",
      });
    }
  };

  const handleTogglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Content Display */}
      <div className="relative">
        {children}

        {/* Edit Overlay */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex space-x-1">
            <Button
              size="sm"
              variant="outline"
              onClick={handleTogglePreview}
              className="bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800"
            >
              {showPreview ? (
                <EyeOff className="h-3 w-3" />
              ) : (
                <Eye className="h-3 w-3" />
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleEdit}
              className="bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800"
            >
              <Edit className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Content Status Indicator */}
        {hasCustomContent && (
          <div className="absolute top-2 left-2">
            <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              Custom
            </div>
          </div>
        )}
      </div>

      {/* Preview Mode */}
      {showPreview && (
        <Card className="mt-4 border-blue-200 dark:border-blue-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-blue-600 dark:text-blue-400">
              Content Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {userValue && (
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Your Custom Content:
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border border-blue-200 dark:border-blue-700">
                  {userValue}
                </div>
              </div>
            )}
            {globalValue && (
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Global Content (Fallback):
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600">
                  {globalValue}
                </div>
              </div>
            )}
            {!userValue && !globalValue && (
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  System Default:
                </p>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded border border-yellow-200 dark:border-yellow-700">
                  {currentValue}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Edit {label}
              </h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {label}
                </label>
                {description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {description}
                  </p>
                )}
                {type === "textarea" ? (
                  <Textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    rows={4}
                    className="w-full"
                    placeholder={`Enter ${label.toLowerCase()}...`}
                  />
                ) : (
                  <Input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full"
                    placeholder={`Enter ${label.toLowerCase()}...`}
                  />
                )}
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Check className="h-4 w-4 mr-2" />
                  )}
                  Save
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>

              {hasCustomContent && (
                <Button
                  onClick={handleResetToGlobal}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full text-orange-600 border-orange-300 hover:bg-orange-50 dark:text-orange-400 dark:border-orange-600 dark:hover:bg-orange-900/20"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset to Global Content
                </Button>
              )}
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
  );
}



