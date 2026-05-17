import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * Browser-side Supabase client. Use this in client components ("use client").
 * Replace env vars in .env.local with your actual Supabase project credentials.
 */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
