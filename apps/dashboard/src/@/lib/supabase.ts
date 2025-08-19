import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only create client if environment variables are available
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Log the status for debugging (both dev and production)
console.log("🔧 Supabase client status:", {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  clientCreated: !!supabase,
  env: process.env.NODE_ENV,
  urlLength: supabaseUrl?.length || 0,
  keyLength: supabaseAnonKey?.length || 0,
});
