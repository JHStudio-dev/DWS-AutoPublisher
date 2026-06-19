import "server-only";
import type {
  GroupPlatform,
  Publication,
  PublicationLog,
  PublicationLogLevel,
  PublicationStatus,
  PublicationTarget,
  PublicationTargetStatus,
  Vehicle,
} from "@/db/types/database";
import type {
  CreatePublicationInput,
  TargetUpdateInput,
} from "@/lib/validation/publication";
import { PUBLICATION_TARGET_STATUS_LABELS } from "@/lib/constants/publications";
import { derivePublicationStatus } from "@/lib/publications/status";
import { getCompanyScope, type CompanyScope } from "@/services/company-scope";

// Publication services

export type PublicationListItem = Publication & {
  vehicle: { id: string; title: string } | null;
  targets: { status: PublicationTargetStatus }[];
};

export type PublicationTargetWithGroup = PublicationTarget & {
  group: {
    id: string;
    name: string;
    url: string;
    platform: GroupPlatform;
  } | null;
};

export type PublicationDetail = Publication & {
  vehicle: Vehicle | null;
  targets: PublicationTargetWithGroup[];
  logs: PublicationLog[];
};

export type ListPublicationsOptions = {
  status?: PublicationStatus;
};

function statusLogLevel(status: PublicationTargetStatus): PublicationLogLevel {
  if (status === "completed") return "success";
  if (status === "failed") return "error";
  if (status === "requires_review") return "warning";
  return "info";
}

// Logging is best-effort: an audit write never blocks the user action.
async function insertLog(
  supabase: CompanyScope["supabase"],
  publicationId: string,
  targetId: string | null,
  level: PublicationLogLevel,
  message: string,
  metadata?: Record<string, unknown>,
): Promise<void> {
  await supabase.from("publication_logs").insert({
    publication_id: publicationId,
    target_id: targetId,
    level,
    message,
    metadata: metadata ?? null,
  });
}

async function refreshPublicationStatus(
  supabase: CompanyScope["supabase"],
  companyId: string,
  publicationId: string,
): Promise<void> {
  const { data: targets, error } = await supabase
    .from("publication_targets")
    .select("status")
    .eq("publication_id", publicationId)
    .returns<{ status: PublicationTargetStatus }[]>();
  if (error) throw error;

  const status = derivePublicationStatus(targets ?? []);
  const { error: updateError } = await supabase
    .from("publications")
    .update({ status })
    .eq("id", publicationId)
    .eq("company_id", companyId);
  if (updateError) throw updateError;
}

export async function listPublications(
  options: ListPublicationsOptions = {},
): Promise<PublicationListItem[]> {
  const { supabase, companyId } = await getCompanyScope();

  let query = supabase
    .from("publications")
    .select(
      "*, vehicle:vehicles(id, title), targets:publication_targets(status)",
    )
    .eq("company_id", companyId);

  if (options.status) {
    query = query.eq("status", options.status);
  }

  const { data, error } = await query
    .order("created_at", { ascending: false })
    .returns<PublicationListItem[]>();
  if (error) throw error;
  return data ?? [];
}

export async function getPublicationById(
  id: string,
): Promise<PublicationDetail | null> {
  const { supabase, companyId } = await getCompanyScope();

  const { data, error } = await supabase
    .from("publications")
    .select(
      "*, vehicle:vehicles(*), targets:publication_targets(*, group:publication_groups(id, name, url, platform)), logs:publication_logs(*)",
    )
    .eq("id", id)
    .eq("company_id", companyId)
    .maybeSingle<PublicationDetail>();
  if (error) throw error;
  if (!data) return null;

  data.targets.sort((a, b) => a.created_at.localeCompare(b.created_at));
  data.logs.sort((a, b) => b.created_at.localeCompare(a.created_at));
  return data;
}

export async function createPublicationBatch(
  input: CreatePublicationInput,
): Promise<Publication> {
  const { supabase, companyId, profileId } = await getCompanyScope();

  const { data: vehicle, error: vehicleError } = await supabase
    .from("vehicles")
    .select("id")
    .eq("id", input.vehicleId)
    .eq("company_id", companyId)
    .maybeSingle<{ id: string }>();
  if (vehicleError) throw vehicleError;
  if (!vehicle) throw new Error("Vehicle not found.");

  // RLS on targets only checks the parent publication's company, so the group
  // ownership is validated here before any target is created.
  const uniqueGroupIds = [...new Set(input.groupIds)];
  const { data: groups, error: groupsError } = await supabase
    .from("publication_groups")
    .select("id")
    .eq("company_id", companyId)
    .in("id", uniqueGroupIds)
    .returns<{ id: string }[]>();
  if (groupsError) throw groupsError;
  if (!groups || groups.length !== uniqueGroupIds.length) {
    throw new Error("Invalid publication groups.");
  }

  const { data: publication, error: pubError } = await supabase
    .from("publications")
    .insert({
      company_id: companyId,
      vehicle_id: input.vehicleId,
      status: "pending",
      publication_text: input.publicationText,
      created_by: profileId,
    })
    .select("*")
    .single<Publication>();
  if (pubError) throw pubError;

  const { error: targetsError } = await supabase
    .from("publication_targets")
    .insert(
      uniqueGroupIds.map((groupId) => ({
        publication_id: publication.id,
        group_id: groupId,
      })),
    );
  if (targetsError) {
    await supabase
      .from("publications")
      .delete()
      .eq("id", publication.id)
      .eq("company_id", companyId);
    throw targetsError;
  }

  await insertLog(supabase, publication.id, null, "info", "Publicación creada.", {
    groupCount: uniqueGroupIds.length,
  });

  return publication;
}

export async function updateTargetStatus(
  input: TargetUpdateInput,
): Promise<void> {
  const { supabase, companyId } = await getCompanyScope();

  const { data: target, error: targetError } = await supabase
    .from("publication_targets")
    .select("id, publication_id")
    .eq("id", input.targetId)
    .maybeSingle<{ id: string; publication_id: string }>();
  if (targetError) throw targetError;
  if (!target) throw new Error("Publication target not found.");

  const patch = {
    status: input.status,
    published_at: input.status === "completed" ? new Date().toISOString() : null,
    target_url: input.status === "completed" ? (input.targetUrl ?? null) : null,
    error_message: input.status === "failed" ? (input.errorMessage ?? null) : null,
  };

  const { error: updateError } = await supabase
    .from("publication_targets")
    .update(patch)
    .eq("id", input.targetId);
  if (updateError) throw updateError;

  await insertLog(
    supabase,
    target.publication_id,
    target.id,
    statusLogLevel(input.status),
    `Destino: ${PUBLICATION_TARGET_STATUS_LABELS[input.status]}`,
    input.targetUrl ? { targetUrl: input.targetUrl } : undefined,
  );

  await refreshPublicationStatus(supabase, companyId, target.publication_id);
}

export async function cancelPublication(id: string): Promise<void> {
  const { supabase, companyId } = await getCompanyScope();

  const { data: publication, error: pubError } = await supabase
    .from("publications")
    .select("id")
    .eq("id", id)
    .eq("company_id", companyId)
    .maybeSingle<{ id: string }>();
  if (pubError) throw pubError;
  if (!publication) throw new Error("Publication not found.");

  const { error: targetsError } = await supabase
    .from("publication_targets")
    .update({ status: "cancelled" })
    .eq("publication_id", id)
    .in("status", ["pending", "requires_review"]);
  if (targetsError) throw targetsError;

  await insertLog(supabase, id, null, "info", "Publicación cancelada.");
  await refreshPublicationStatus(supabase, companyId, id);
}
