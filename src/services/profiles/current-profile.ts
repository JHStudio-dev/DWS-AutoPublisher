import "server-only";
import { createClient } from "@/db/supabase/server";
import type { Company, Profile } from "@/db/types/database";

export type CurrentProfile = {
  profile: Profile;
  company: Company;
};

// Loads the authenticated user's profile together with their company.
// Returns null when there is no session or no linked profile.
export async function getCurrentProfile(): Promise<CurrentProfile | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*, company:companies(*)")
    .eq("auth_user_id", user.id)
    .single<Profile & { company: Company }>();

  if (error || !data) {
    return null;
  }

  const { company, ...profile } = data;
  return { profile, company };
}
