import "server-only";
import { createClient } from "@/db/supabase/server";
import { getCurrentProfile } from "@/services/profiles/current-profile";

export type CompanyScope = {
  supabase: Awaited<ReturnType<typeof createClient>>;
  companyId: string;
  profileId: string;
};

export async function getCompanyScope(): Promise<CompanyScope> {
  const current = await getCurrentProfile();

  if (!current) {
    throw new Error("No authenticated company context.");
  }

  const supabase = await createClient();
  return {
    supabase,
    companyId: current.company.id,
    profileId: current.profile.id,
  };
}
