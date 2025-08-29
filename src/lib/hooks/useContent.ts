"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useUserAuth } from "./useUserAuth";

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

interface UserContent {
  id: number;
  user_id: string;
  page_name: string;
  section_name: string;
  content_type: string;
  content_value: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ContentMap {
  [key: string]: string;
}

export function useContent(pageName: string) {
  const { user } = useUserAuth();
  const [globalContent, setGlobalContent] = useState<ContentMap>({});
  const [userContent, setUserContent] = useState<ContentMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContent();
  }, [pageName, user?.id]);

  const fetchContent = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch global content
      const { data: globalData, error: globalError } = await (supabase as any)
        .from("page_content")
        .select("*")
        .eq("page_name", pageName)
        .eq("is_active", true)
        .order("display_order");

      if (globalError) {
        throw globalError;
      }

      // Convert global array to object
      const globalContentMap: ContentMap = {};
      globalData?.forEach((item: PageContent) => {
        globalContentMap[item.section_name] = item.content_value;
      });
      setGlobalContent(globalContentMap);

      // Fetch user-specific content if user is logged in
      if (user?.id) {
        const { data: userData, error: userError } = await (supabase as any)
          .from("user_content")
          .select("*")
          .eq("user_id", user.id)
          .eq("page_name", pageName)
          .eq("is_active", true);

        if (userError) {
          console.error("Error fetching user content:", userError);
        } else {
          // Convert user array to object
          const userContentMap: ContentMap = {};
          userData?.forEach((item: UserContent) => {
            userContentMap[item.section_name] = item.content_value;
          });
          setUserContent(userContentMap);
        }
      }
    } catch (err) {
      console.error("Error fetching content:", err);
      setError("Failed to load content");
    } finally {
      setIsLoading(false);
    }
  };

  const updateContent = async (sectionName: string, newValue: string) => {
    try {
      // Update global content (admin function)
      const { error } = await (supabase as any)
        .from("page_content")
        .update({ content_value: newValue })
        .eq("page_name", pageName)
        .eq("section_name", sectionName);

      if (error) {
        throw error;
      }

      // Update local state
      setGlobalContent((prev) => ({
        ...prev,
        [sectionName]: newValue,
      }));

      return { success: true };
    } catch (err) {
      console.error("Error updating content:", err);
      return { success: false, error: err };
    }
  };

  const updateUserContent = async (sectionName: string, newValue: string) => {
    if (!user?.id) {
      return { success: false, error: "User not authenticated" };
    }

    try {
      // Upsert user content (insert or update)
      const { error } = await (supabase as any).from("user_content").upsert({
        user_id: user.id,
        page_name: pageName,
        section_name: sectionName,
        content_type: "text",
        content_value: newValue,
        is_active: true,
      });

      if (error) {
        throw error;
      }

      // Update local state
      setUserContent((prev) => ({
        ...prev,
        [sectionName]: newValue,
      }));

      return { success: true };
    } catch (err) {
      console.error("Error updating user content:", err);
      return { success: false, error: err };
    }
  };

  const deleteUserContent = async (sectionName: string) => {
    if (!user?.id) {
      return { success: false, error: "User not authenticated" };
    }

    try {
      const { error } = await (supabase as any)
        .from("user_content")
        .delete()
        .eq("user_id", user.id)
        .eq("page_name", pageName)
        .eq("section_name", sectionName);

      if (error) {
        throw error;
      }

      // Remove from local state
      setUserContent((prev) => {
        const newState = { ...prev };
        delete newState[sectionName];
        return newState;
      });

      return { success: true };
    } catch (err) {
      console.error("Error deleting user content:", err);
      return { success: false, error: err };
    }
  };

  const getContent = (sectionName: string, fallback: string = "") => {
    // Priority: User content > Global content > Fallback
    if (userContent[sectionName]) {
      return userContent[sectionName];
    }
    if (globalContent[sectionName]) {
      return globalContent[sectionName];
    }
    return fallback;
  };

  const getUserContent = (sectionName: string) => {
    return userContent[sectionName] || null;
  };

  const getGlobalContent = (sectionName: string) => {
    return globalContent[sectionName] || null;
  };

  const hasUserContent = (sectionName: string) => {
    return !!userContent[sectionName];
  };

  return {
    globalContent,
    userContent,
    isLoading,
    error,
    updateContent,
    updateUserContent,
    deleteUserContent,
    getContent,
    getUserContent,
    getGlobalContent,
    hasUserContent,
    refreshContent: fetchContent,
  };
}
