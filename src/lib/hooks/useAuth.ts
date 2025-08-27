"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Start with false for instant access
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session) {
          setIsAuthenticated(false);
          setIsLoading(false);
          router.push("/admin/auth");
          return;
        }

        setIsAuthenticated(true);
        setUser(session.user);
        setIsLoading(false);
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsAuthenticated(false);
        setIsLoading(false);
        router.push("/admin/auth");
      }
    };

    checkAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setIsAuthenticated(false);
        setUser(null);
        router.push("/admin/auth");
      } else if (session) {
        setIsAuthenticated(true);
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    logout,
  };
}
