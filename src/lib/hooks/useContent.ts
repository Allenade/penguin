"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface PageContent {
  id: number;
  page_name: string;
  section_name: string;
  content_type: string;
  content_value: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ContentMap {
  [key: string]: string;
}

export function useContent(pageName: string) {
  const [content, setContent] = useState<ContentMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContent();
  }, [pageName]);

  const fetchContent = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("page_content")
        .select("*")
        .eq("page_name", pageName)
        .eq("is_active", true)
        .order("display_order");

      if (error) {
        throw error;
      }

      // Convert array to object for easy access
      const contentMap: ContentMap = {};
      data?.forEach((item: PageContent) => {
        contentMap[item.section_name] = item.content_value;
      });

      setContent(contentMap);
    } catch (err) {
      console.error("Error fetching content:", err);
      setError("Failed to load content");
    } finally {
      setIsLoading(false);
    }
  };

  const updateContent = async (sectionName: string, newValue: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from("page_content")
        .update({ content_value: newValue })
        .eq("page_name", pageName)
        .eq("section_name", sectionName);

      if (error) {
        throw error;
      }

      // Update local state
      setContent((prev) => ({
        ...prev,
        [sectionName]: newValue,
      }));

      return { success: true };
    } catch (err) {
      console.error("Error updating content:", err);
      return { success: false, error: err };
    }
  };

  const getContent = (sectionName: string, fallback: string = "") => {
    return content[sectionName] || fallback;
  };

  return {
    content,
    isLoading,
    error,
    updateContent,
    getContent,
    refreshContent: fetchContent,
  };
}
