import "server-only";
import { createClient } from "@/db/supabase/server";
import type { Company, Profile } from "@/db/types/database";

export type CurrentProfile = {
  profile: Profile;
  company: Company;
};

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
    .maybeSingle<Profile & { company: Company | null }>();

  if (error || !data) {
    return null;
  }

  const { company, ...profile } = data;

  if (!company) {
    return null;
  }

  return { profile, company };
}
