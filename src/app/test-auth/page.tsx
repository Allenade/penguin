"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TestAuthPage() {
  const [email, setEmail] = useState("allenumunade@gmail.com");
  const [password, setPassword] = useState("testpassword123");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const testSignIn = async () => {
    setLoading(true);
    setStatus("Testing sign in...");

    try {
      console.log("Testing Supabase connection...");

      // Test basic connection
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      console.log("Session check:", { sessionData, sessionError });

      if (sessionError) {
        setStatus(`Session error: ${sessionError.message}`);
        setLoading(false);
        return;
      }

      // Test sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("Sign in result:", { data, error });

      if (error) {
        setStatus(`Sign in error: ${error.message}`);
      } else if (data?.user) {
        setStatus(`Sign in successful! User ID: ${data.user.id}`);
      } else {
        setStatus("Sign in failed - no user data returned");
      }
    } catch (err) {
      console.error("Test error:", err);
      setStatus(
        `Unexpected error: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const testSignUp = async () => {
    setLoading(true);
    setStatus("Testing sign up...");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      console.log("Sign up result:", { data, error });

      if (error) {
        setStatus(`Sign up error: ${error.message}`);
      } else if (data?.user) {
        setStatus(`Sign up successful! User ID: ${data.user.id}`);
      } else {
        setStatus("Sign up failed - no user data returned");
      }
    } catch (err) {
      console.error("Test error:", err);
      setStatus(
        `Unexpected error: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Authentication Test</h1>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={testSignIn}
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50"
          >
            {loading ? "Testing..." : "Test Sign In"}
          </button>

          <button
            onClick={testSignUp}
            disabled={loading}
            className="w-full bg-green-500 text-white p-2 rounded disabled:opacity-50"
          >
            {loading ? "Testing..." : "Test Sign Up"}
          </button>
        </div>

        {status && (
          <div className="mt-6 p-3 bg-gray-100 rounded">
            <p className="text-sm">{status}</p>
          </div>
        )}

        <div className="mt-6 text-xs text-gray-500">
          <p>Check browser console for detailed logs</p>
        </div>
      </div>
    </div>
  );
}
