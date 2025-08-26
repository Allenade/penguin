import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const supabaseUrl = "https://fulhrbcetwwwefoxpfmr.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1bGhyYmNldHd3d2Vmb3hwZm1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2OTU2NzIsImV4cCI6MjA3MTI3MTY3Mn0.aHoik8ptv3-rsvofM11QcKe_A0Clj-Q-aph7h1QXAtU";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// For server-side operations (use with caution)
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1bGhyYmNldHd3d2Vmb3hwZm1yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTY5NTY3MiwiZXhwIjoyMDcxMjcxNjcyfQ.Zn7ttv8mGqvmQKE2LYRE8oslPcw_hE0UFKILJx5lNaM"
);
