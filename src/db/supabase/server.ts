import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server client: runs in server components, route handlers, and actions.
// Uses the anon key plus the user session from cookies, so RLS applies.
export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing Supabase public environment variables");
  }

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // setAll can be called from a Server Component where cookies are
          // read-only; the session is refreshed in middleware instead.
        }
      },
    },
  });
}
