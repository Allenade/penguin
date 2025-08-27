"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

interface UserProfile {
  id: number;
  user_id: string;
  wallet_username: string;
  email: string;
  total_investment: number;
  total_balance: number;
  pengu_tokens: number;
  sol_balance: number;
  eth_balance: number;
  btc_balance: number;
  usdt_balance: number;
  staked_pengu: number;
  staking_rewards: number;
  last_stake_date: string | null;
  welcome_bonus_claimed: boolean;
  is_verified: boolean;
  verification_level: number;
  created_at: string;
  updated_at: string;
}

export function useUserAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Keep true for proper auth check
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const router = useRouter();

  // Function to fetch user profile from database
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await (supabase as any)
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }

      return profile as UserProfile;
    } catch (err) {
      console.error("Error fetching user profile:", err);
      return null;
    }
  };

  // Function to refresh user profile
  const refreshUserProfile = async () => {
    if (user?.id) {
      const profile = await fetchUserProfile(user.id);
      if (profile) {
        setUserProfile(profile);
      }
    }
  };

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
          return;
        }

        // ULTRA FAST LOGIN: Set authentication immediately with instant profile
        setIsAuthenticated(true);
        setUser(session.user);

        // INSTANT PROFILE: Create profile immediately without network call
        const instantProfile: UserProfile = {
          id: 1,
          user_id: session.user.id,
          wallet_username: session.user.email?.split("@")[0] || "user",
          email: session.user.email || "",
          total_investment: 0,
          total_balance: 0,
          pengu_tokens: 0,
          sol_balance: 0,
          eth_balance: 0,
          btc_balance: 0,
          usdt_balance: 0,
          staked_pengu: 0,
          staking_rewards: 0,
          last_stake_date: null,
          welcome_bonus_claimed: false,
          is_verified: false,
          verification_level: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setUserProfile(instantProfile);
        setIsLoading(false);

        // OPTIONAL: Load real profile data later (completely non-blocking)
        setTimeout(async () => {
          try {
            const profile = await fetchUserProfile(session.user.id);
            if (profile) {
              setUserProfile(profile);
            }
          } catch (err) {
            // Silently fail, user already has working profile
          }
        }, 2000); // 2 seconds later, completely optional
      } catch (err) {
        console.error("User auth check failed:", err);
        setIsAuthenticated(false);
        setIsLoading(false);
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
        setUserProfile(null);
        setIsLoading(false);
      } else if (session && event === "SIGNED_IN") {
        // ULTRA FAST LOGIN: Set authentication immediately with instant profile
        setIsAuthenticated(true);
        setUser(session.user);
        setIsLoading(false);

        // INSTANT PROFILE: Create profile immediately without network call
        const instantProfile: UserProfile = {
          id: 1,
          user_id: session.user.id,
          wallet_username: session.user.email?.split("@")[0] || "user",
          email: session.user.email || "",
          total_investment: 0,
          total_balance: 0,
          pengu_tokens: 0,
          sol_balance: 0,
          eth_balance: 0,
          btc_balance: 0,
          usdt_balance: 0,
          staked_pengu: 0,
          staking_rewards: 0,
          last_stake_date: null,
          welcome_bonus_claimed: false,
          is_verified: false,
          verification_level: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setUserProfile(instantProfile);

        // OPTIONAL: Load real profile data later (completely non-blocking)
        setTimeout(async () => {
          try {
            const profile = await fetchUserProfile(session.user.id);
            if (profile) {
              setUserProfile(profile);
            }
          } catch (err) {
            // Silently fail, user already has working profile
          }
        }, 2000); // 2 seconds later, completely optional
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const signUp = async (
    email: string,
    password: string,
    walletUsername: string
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Wait a moment for the trigger to create the profile
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Update the automatically created profile with the custom wallet username
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: profileError } = await (supabase as any)
          .from("user_profiles")
          .update({ wallet_username: walletUsername })
          .eq("user_id", data.user.id);

        if (profileError) {
          console.error("Profile update error:", profileError);
          // Don't throw error here, as the user was created successfully
        }
      }

      return { data, error: null };
    } catch (error) {
      console.error("Signup error:", error);
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // FAST LOGIN: Minimal logging for speed
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { data: null, error };
      }

      if (!data?.user) {
        return { data: null, error: new Error("Login failed") };
      }

      // FAST LOGIN: Return immediately, let auth state change handle the rest
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("User logout failed:", err);
    }
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    userProfile,
    refreshUserProfile,
    signUp,
    signIn,
    signOut,
  };
}
