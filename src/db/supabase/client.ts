import { createBrowserClient } from "@supabase/ssr";

// Browser client: runs in client components, uses the public anon key under RLS.
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing Supabase public environment variables");
  }

  return createBrowserClient(url, anonKey);
}
