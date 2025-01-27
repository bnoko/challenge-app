import { createClient } from "@supabase/supabase-js";

const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL || "missing-url";
const supabaseKey: string = import.meta.env.VITE_SUPABASE_KEY || "missing-key";

if (supabaseUrl === "missing-url" || supabaseKey === "missing-key") {
  console.error("Supabase URL or Key is missing!");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
