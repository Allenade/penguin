"use client";
import { ReactNode } from "react";
import { useAuth } from "@/lib/hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // INSTANT ACCESS: Show content immediately, auth check in background
  if (isLoading) {
    // Show content immediately while auth checks in background
    return <>{children}</>;
  }

  // If not authenticated, don't render anything (will redirect via useAuth hook)
  if (!isAuthenticated) {
    return null;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
}
