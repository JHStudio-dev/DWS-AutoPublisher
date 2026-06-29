import "server-only";
import type { Company } from "@/db/types/database";
import type { CompanySettingsInput } from "@/lib/validation/company";
import { getCompanyScope } from "@/services/company-scope";

// Company services

export async function updateCompany(
  input: CompanySettingsInput,
): Promise<Company> {
  const { supabase, companyId } = await getCompanyScope();
  const { data, error } = await supabase
    .from("companies")
    .update({ name: input.name })
    .eq("id", companyId)
    .select("*")
    .maybeSingle<Company>();

  // RLS (companies_admin_update) restricts updates to owner/admin: a denied
  // update affects no rows and returns null here.
  if (error) throw error;
  if (!data) throw new Error("Company update not permitted.");
  return data;
}
