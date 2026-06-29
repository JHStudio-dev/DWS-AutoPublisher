import "server-only";
import type {
  GroupPlatform,
  PublicationStatus,
  VehicleStatus,
} from "@/db/types/database";
import { getCompanyScope } from "@/services/company-scope";

// Dashboard stats

export type ActivityPoint = { date: string; count: number };
export type PlatformCount = { platform: GroupPlatform; count: number };

export type DashboardStats = {
  vehicles: {
    total: number;
    active: number;
    byStatus: Record<VehicleStatus, number>;
  };
  groups: {
    total: number;
    active: number;
  };
  publications: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
    byStatus: Record<PublicationStatus, number>;
    byPlatform: PlatformCount[];
    activity: ActivityPoint[];
  };
};

const ACTIVITY_DAYS = 7;

function emptyStatusCounts(): Record<PublicationStatus, number> {
  return {
    draft: 0,
    pending: 0,
    processing: 0,
    requires_review: 0,
    completed: 0,
    failed: 0,
    cancelled: 0,
  };
}

function buildActivity(timestamps: string[]): ActivityPoint[] {
  const buckets = new Map<string, number>();
  const today = new Date();

  for (let offset = ACTIVITY_DAYS - 1; offset >= 0; offset -= 1) {
    const day = new Date(today);
    day.setDate(today.getDate() - offset);
    buckets.set(day.toISOString().slice(0, 10), 0);
  }

  for (const timestamp of timestamps) {
    const key = timestamp.slice(0, 10);
    const current = buckets.get(key);
    if (current !== undefined) {
      buckets.set(key, current + 1);
    }
  }

  return [...buckets.entries()].map(([date, count]) => ({ date, count }));
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const { supabase, companyId } = await getCompanyScope();

  const [vehiclesRes, groupsRes, publicationsRes, targetsRes] =
    await Promise.all([
      supabase
        .from("vehicles")
        .select("status")
        .eq("company_id", companyId)
        .returns<{ status: VehicleStatus }[]>(),
      supabase
        .from("publication_groups")
        .select("active")
        .eq("company_id", companyId)
        .returns<{ active: boolean }[]>(),
      supabase
        .from("publications")
        .select("status, created_at")
        .eq("company_id", companyId)
        .returns<{ status: PublicationStatus; created_at: string }[]>(),
      // Targets carry no company_id; RLS scopes them through the parent publication.
      supabase
        .from("publication_targets")
        .select("group:publication_groups(platform)")
        .returns<{ group: { platform: GroupPlatform } | null }[]>(),
    ]);

  if (vehiclesRes.error) throw vehiclesRes.error;
  if (groupsRes.error) throw groupsRes.error;
  if (publicationsRes.error) throw publicationsRes.error;
  if (targetsRes.error) throw targetsRes.error;

  const vehicleByStatus: Record<VehicleStatus, number> = {
    draft: 0,
    ready: 0,
    published: 0,
    archived: 0,
  };
  for (const row of vehiclesRes.data ?? []) {
    vehicleByStatus[row.status] += 1;
  }
  const vehiclesTotal = vehiclesRes.data?.length ?? 0;

  const groups = groupsRes.data ?? [];

  const publicationByStatus = emptyStatusCounts();
  const timestamps: string[] = [];
  for (const row of publicationsRes.data ?? []) {
    publicationByStatus[row.status] += 1;
    timestamps.push(row.created_at);
  }

  const platformCounts = new Map<GroupPlatform, number>();
  for (const row of targetsRes.data ?? []) {
    const platform = row.group?.platform;
    if (!platform) continue;
    platformCounts.set(platform, (platformCounts.get(platform) ?? 0) + 1);
  }
  const byPlatform = [...platformCounts.entries()]
    .map(([platform, count]) => ({ platform, count }))
    .sort((a, b) => b.count - a.count);

  return {
    vehicles: {
      total: vehiclesTotal,
      active: vehiclesTotal - vehicleByStatus.archived,
      byStatus: vehicleByStatus,
    },
    groups: {
      total: groups.length,
      active: groups.filter((group) => group.active).length,
    },
    publications: {
      total: publicationsRes.data?.length ?? 0,
      pending: publicationByStatus.pending,
      completed: publicationByStatus.completed,
      cancelled: publicationByStatus.cancelled,
      byStatus: publicationByStatus,
      byPlatform,
      activity: buildActivity(timestamps),
    },
  };
}
