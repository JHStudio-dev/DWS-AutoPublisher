import "server-only";
import type { GroupPlatform, PublicationGroup } from "@/db/types/database";
import type { PublicationGroupInput } from "@/lib/validation/publication-group";
import { getCompanyScope } from "@/services/company-scope";

// Publication group services

export type ListGroupsOptions = {
  search?: string;
  platform?: GroupPlatform;
  active?: boolean;
};

function sanitizeSearchTerm(term: string): string {
  return term
    .replace(/[,()*%:\\"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toRow(input: PublicationGroupInput) {
  return {
    name: input.name,
    url: input.url,
    platform: input.platform,
    active: input.active,
    notes: input.notes ?? null,
  };
}

export async function listGroups(
  options: ListGroupsOptions = {},
): Promise<PublicationGroup[]> {
  const { supabase, companyId } = await getCompanyScope();

  let query = supabase
    .from("publication_groups")
    .select("*")
    .eq("company_id", companyId);

  if (options.platform) {
    query = query.eq("platform", options.platform);
  }
  if (typeof options.active === "boolean") {
    query = query.eq("active", options.active);
  }

  const term = options.search ? sanitizeSearchTerm(options.search) : "";
  if (term) {
    const pattern = `%${term}%`;
    query = query.or(`name.ilike.${pattern},url.ilike.${pattern}`);
  }

  const { data, error } = await query
    .order("name", { ascending: true })
    .returns<PublicationGroup[]>();

  if (error) throw error;
  return data ?? [];
}

export async function getGroupById(
  id: string,
): Promise<PublicationGroup | null> {
  const { supabase, companyId } = await getCompanyScope();
  const { data, error } = await supabase
    .from("publication_groups")
    .select("*")
    .eq("id", id)
    .eq("company_id", companyId)
    .maybeSingle<PublicationGroup>();

  if (error) throw error;
  return data;
}

export async function createGroup(
  input: PublicationGroupInput,
): Promise<PublicationGroup> {
  const { supabase, companyId } = await getCompanyScope();
  const { data, error } = await supabase
    .from("publication_groups")
    .insert({ ...toRow(input), company_id: companyId })
    .select("*")
    .single<PublicationGroup>();

  if (error) throw error;
  return data;
}

export async function updateGroup(
  id: string,
  input: PublicationGroupInput,
): Promise<PublicationGroup> {
  const { supabase, companyId } = await getCompanyScope();
  const { data, error } = await supabase
    .from("publication_groups")
    .update(toRow(input))
    .eq("id", id)
    .eq("company_id", companyId)
    .select("*")
    .maybeSingle<PublicationGroup>();

  if (error) throw error;
  if (!data) throw new Error("Publication group not found.");
  return data;
}

export async function deleteGroup(id: string): Promise<void> {
  const { supabase, companyId } = await getCompanyScope();
  const { error } = await supabase
    .from("publication_groups")
    .delete()
    .eq("id", id)
    .eq("company_id", companyId);

  if (error) throw error;
}

export async function setGroupActive(
  id: string,
  active: boolean,
): Promise<PublicationGroup> {
  const { supabase, companyId } = await getCompanyScope();
  const { data, error } = await supabase
    .from("publication_groups")
    .update({ active })
    .eq("id", id)
    .eq("company_id", companyId)
    .select("*")
    .maybeSingle<PublicationGroup>();

  if (error) throw error;
  if (!data) throw new Error("Publication group not found.");
  return data;
}
