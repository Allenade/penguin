"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, X, Check } from "lucide-react";
import { useContent } from "@/lib/hooks/useContent";
import Toast from "@/components/Toast";

interface ContentEditorProps {
  pageName: string;
}

interface ContentSection {
  key: string;
  label: string;
  type: "text" | "textarea" | "image";
  description?: string;
}

const contentSections: ContentSection[] = [
  // Hero Section
  {
    key: "hero_title",
    label: "Hero Title",
    type: "text",
    description: "Main page title",
  },
  {
    key: "hero_subtitle",
    label: "Hero Subtitle",
    type: "text",
    description: "Welcome message",
  },
  {
    key: "hero_image",
    label: "Hero Image",
    type: "image",
    description: "Main penguin image path",
  },

  // Magic Section
  {
    key: "magic_title",
    label: "Magic Section Title",
    type: "text",
    description: "How the Magic Works title",
  },
  {
    key: "magic_step_1_title",
    label: "Step 1 Title",
    type: "text",
    description: "First step title",
  },
  {
    key: "magic_step_1_desc",
    label: "Step 1 Description",
    type: "textarea",
    description: "First step description",
  },
  {
    key: "magic_step_2_title",
    label: "Step 2 Title",
    type: "text",
    description: "Second step title",
  },
  {
    key: "magic_step_2_desc",
    label: "Step 2 Description",
    type: "textarea",
    description: "Second step description",
  },

  // What Is Section
  {
    key: "what_is_title",
    label: "What Is Title",
    type: "text",
    description: "What Is section title",
  },
  {
    key: "what_is_desc",
    label: "What Is Description",
    type: "textarea",
    description: "What Is section description",
  },
  {
    key: "what_is_image",
    label: "What Is Image",
    type: "image",
    description: "What Is section image path",
  },

  // Adventure Buttons
  {
    key: "adventure_button_1_text",
    label: "Adventure Button 1 Text",
    type: "text",
    description: "First adventure button text",
  },
  {
    key: "adventure_button_1_link",
    label: "Adventure Button 1 Link",
    type: "text",
    description: "First adventure button link",
  },
  {
    key: "adventure_button_2_text",
    label: "Adventure Button 2 Text",
    type: "text",
    description: "Second adventure button text",
  },
  {
    key: "adventure_button_2_link",
    label: "Adventure Button 2 Link",
    type: "text",
    description: "Second adventure button link",
  },

  // Investment Section
  {
    key: "investment_title",
    label: "Investment Title",
    type: "text",
    description: "Investment section title",
  },
  {
    key: "investment_desc",
    label: "Investment Description",
    type: "textarea",
    description: "Investment section description",
  },
  {
    key: "investment_amount_1",
    label: "Investment Amount 1",
    type: "text",
    description: "First investment amount",
  },
  {
    key: "investment_amount_2",
    label: "Investment Amount 2",
    type: "text",
    description: "Second investment amount",
  },
  {
    key: "investment_amount_3",
    label: "Investment Amount 3",
    type: "text",
    description: "Third investment amount",
  },
  {
    key: "investment_amount_4",
    label: "Investment Amount 4",
    type: "text",
    description: "Fourth investment amount",
  },
  {
    key: "investment_amount_5",
    label: "Investment Amount 5",
    type: "text",
    description: "Fifth investment amount",
  },

  // Wallet Address
  {
    key: "wallet_address",
    label: "Wallet Address",
    type: "text",
    description: "Wallet address for payments",
  },

  // Footer
  {
    key: "footer_text",
    label: "Footer Text",
    type: "textarea",
    description: "Footer message",
  },
];

export default function ContentEditor({ pageName }: ContentEditorProps) {
  const { isLoading, updateContent, getContent } = useContent(pageName);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ [key: string]: string }>({});
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as const,
  });

  const handleEdit = (sectionKey: string) => {
    setEditingSection(sectionKey);
    setEditValues((prev) => ({
      ...prev,
      [sectionKey]: getContent(sectionKey),
    }));
  };

  const handleSave = async (sectionKey: string) => {
    const newValue = editValues[sectionKey];
    if (!newValue) return;

    const result = await updateContent(sectionKey, newValue);

    if (result.success) {
      setToast({
        show: true,
        message: "Content updated successfully!",
        type: "success",
      });
      setEditingSection(null);
    } else {
      setToast({
        show: true,
        message: "Failed to update content",
        type: "error",
      });
    }
  };

  const handleCancel = (sectionKey: string) => {
    setEditingSection(null);
    setEditValues((prev) => {
      const newValues = { ...prev };
      delete newValues[sectionKey];
      return newValues;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Edit {pageName.charAt(0).toUpperCase() + pageName.slice(1)} Page
          Content
        </h2>
      </div>

      <div className="grid gap-6">
        {contentSections.map((section) => (
          <Card key={section.key}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-semibold">{section.label}</span>
                  {section.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {section.description}
                    </p>
                  )}
                </div>
                {editingSection === section.key ? (
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleSave(section.key)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCancel(section.key)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(section.key)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editingSection === section.key ? (
                <div className="space-y-4">
                  {section.type === "textarea" ? (
                    <Textarea
                      value={editValues[section.key] || ""}
                      onChange={(e) =>
                        setEditValues((prev) => ({
                          ...prev,
                          [section.key]: e.target.value,
                        }))
                      }
                      rows={4}
                      placeholder={`Enter ${section.label.toLowerCase()}...`}
                    />
                  ) : (
                    <Input
                      type={section.type === "image" ? "text" : "text"}
                      value={editValues[section.key] || ""}
                      onChange={(e) =>
                        setEditValues((prev) => ({
                          ...prev,
                          [section.key]: e.target.value,
                        }))
                      }
                      placeholder={`Enter ${section.label.toLowerCase()}...`}
                    />
                  )}
                  {section.type === "image" && (
                    <p className="text-sm text-gray-500">
                      Enter the image path (e.g., /image/penguin.jpg)
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {section.type === "image" ? (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        Current image path:
                      </p>
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {getContent(section.key, "No image set")}
                      </code>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        Current content:
                      </p>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded">
                        {getContent(section.key, "No content set")}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
