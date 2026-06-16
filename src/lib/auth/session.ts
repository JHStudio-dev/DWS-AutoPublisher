import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/db/supabase/server";
import {
  getCurrentProfile,
  type CurrentProfile,
} from "@/services/profiles/current-profile";

export async function requireProfile(): Promise<CurrentProfile> {
  const current = await getCurrentProfile();

  if (current) {
    return current;
  }

  // No profile/company: send unauthenticated users to login, but route a signed-in
  // account that is not linked to a company to a clear page instead of looping.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  redirect("/account-pending");
}
