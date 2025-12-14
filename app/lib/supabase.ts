import { createClient, SupabaseClient } from "@supabase/supabase-js";

type Database = Record<string, never>;

function ensureEnv(
  name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY",
): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required but was not provided`);
  }
  return value;
}

/**
 * Creates a short-lived Supabase client for server-only usage in API routes.
 * We skip session persistence since API routes authenticate with the anon key.
 */
export function createSupabaseClient(): SupabaseClient<Database> {
  const supabaseUrl = ensureEnv("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseKey = ensureEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  });
}
