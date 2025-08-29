"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContent } from "@/lib/hooks/useContent";
import { useUserAuth } from "@/lib/hooks/useUserAuth";
import { Edit, Save, X, RotateCcw, FileText, Eye } from "lucide-react";
import Toast from "@/components/Toast";

interface ContentSection {
  pageName: string;
  sectionName: string;
  label: string;
  type: "text" | "textarea";
  description?: string;
}

const contentSections: ContentSection[] = [
  // Huddle Page
  {
    pageName: "huddle",
    sectionName: "hero_title",
    label: "Hero Title",
    type: "text",
    description: "Main page title",
  },
  {
    pageName: "huddle",
    sectionName: "hero_subtitle",
    label: "Hero Subtitle",
    type: "text",
    description: "Welcome message",
  },
  {
    pageName: "huddle",
    sectionName: "magic_title",
    label: "Magic Section Title",
    type: "text",
    description: "How the Magic Works title",
  },
  {
    pageName: "huddle",
    sectionName: "magic_step_1_title",
    label: "Step 1 Title",
    type: "text",
    description: "First step title",
  },
  {
    pageName: "huddle",
    sectionName: "magic_step_1_desc",
    label: "Step 1 Description",
    type: "textarea",
    description: "First step description",
  },
  {
    pageName: "huddle",
    sectionName: "what_is_title",
    label: "Ready to Take the Plunge Title",
    type: "text",
    description: "Main call-to-action title",
  },
  {
    pageName: "huddle",
    sectionName: "what_is_desc",
    label: "Ready to Take the Plunge Description",
    type: "textarea",
    description: "Main call-to-action description",
  },
  {
    pageName: "huddle",
    sectionName: "footer_text",
    label: "Footer Text",
    type: "text",
    description: "Footer call-to-action text",
  },
];

export default function MyContentPage() {
  const { user } = useUserAuth();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ [key: string]: string }>({});
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  // Group content by page
  const contentByPage = contentSections.reduce((acc, section) => {
    if (!acc[section.pageName]) {
      acc[section.pageName] = [];
    }
    acc[section.pageName].push(section);
    return acc;
  }, {} as { [key: string]: ContentSection[] });

  const handleEdit = (sectionKey: string, currentValue: string) => {
    setEditingSection(sectionKey);
    setEditValues((prev) => ({
      ...prev,
      [sectionKey]: currentValue,
    }));
  };

  const handleSave = async (pageName: string, sectionName: string) => {
    const sectionKey = `${pageName}-${sectionName}`;
    const value = editValues[sectionKey];

    // Use the useContent hook for the specific page
    const { updateUserContent } = useContent(pageName);
    const result = await updateUserContent(sectionName, value);

    if (result.success) {
      setToast({
        show: true,
        message: "Content saved successfully!",
        type: "success",
      });
      setEditingSection(null);
    } else {
      setToast({
        show: true,
        message: "Failed to save content",
        type: "error",
      });
    }
  };

  const handleCancel = () => {
    setEditingSection(null);
    setEditValues({});
  };

  const handleResetToGlobal = async (pageName: string, sectionName: string) => {
    const { deleteUserContent } = useContent(pageName);
    const result = await deleteUserContent(sectionName);

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

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-500">Please log in to manage your content.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Content
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Customize your personal experience across all pages
          </p>
        </div>
        <Button variant="outline" className="flex items-center space-x-2">
          <Eye className="h-4 w-4" />
          <span>Preview All</span>
        </Button>
      </div>

      {Object.entries(contentByPage).map(([pageName, sections]) => (
        <Card key={pageName} className="border-blue-200 dark:border-blue-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span className="capitalize">{pageName} Page</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sections.map((section) => {
                const sectionKey = `${pageName}-${section.sectionName}`;
                const {
                  getContent,
                  getUserContent,
                  getGlobalContent,
                  hasUserContent,
                } = useContent(pageName);
                const currentValue = getContent(section.sectionName);
                const userValue = getUserContent(section.sectionName);
                const globalValue = getGlobalContent(section.sectionName);
                const hasCustomContent = hasUserContent(section.sectionName);
                const isEditing = editingSection === sectionKey;

                return (
                  <div
                    key={sectionKey}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {section.label}
                      </h3>
                      <div className="flex items-center space-x-1">
                        {hasCustomContent && (
                          <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            Custom
                          </div>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(sectionKey, currentValue)}
                          disabled={isEditing}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {section.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        {section.description}
                      </p>
                    )}

                    {isEditing ? (
                      <div className="space-y-2">
                        {section.type === "textarea" ? (
                          <Textarea
                            value={editValues[sectionKey] || ""}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [sectionKey]: e.target.value,
                              }))
                            }
                            rows={3}
                            className="w-full"
                          />
                        ) : (
                          <Input
                            value={editValues[sectionKey] || ""}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [sectionKey]: e.target.value,
                              }))
                            }
                            className="w-full"
                          />
                        )}
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              handleSave(pageName, section.sectionName)
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Save className="h-3 w-3 mr-1" />
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancel}
                          >
                            <X className="h-3 w-3 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded border">
                          <p className="text-sm text-gray-900 dark:text-white">
                            {currentValue || "No content set"}
                          </p>
                        </div>
                        {hasCustomContent && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleResetToGlobal(pageName, section.sectionName)
                            }
                            className="text-orange-600 border-orange-300 hover:bg-orange-50 dark:text-orange-400 dark:border-orange-600 dark:hover:bg-orange-900/20"
                          >
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Reset to Global
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Content Preview */}
                    <div className="mt-3 space-y-1">
                      {userValue && (
                        <div className="text-xs">
                          <span className="text-blue-600 dark:text-blue-400 font-medium">
                            Your Custom:
                          </span>{" "}
                          <span className="text-gray-600 dark:text-gray-400">
                            {userValue}
                          </span>
                        </div>
                      )}
                      {globalValue && !userValue && (
                        <div className="text-xs">
                          <span className="text-gray-600 dark:text-gray-400 font-medium">
                            Global:
                          </span>{" "}
                          <span className="text-gray-500 dark:text-gray-500">
                            {globalValue}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}

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
