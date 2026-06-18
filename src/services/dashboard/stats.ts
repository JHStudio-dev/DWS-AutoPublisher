import "server-only";
import type { VehicleStatus } from "@/db/types/database";
import { getCompanyScope } from "@/services/company-scope";

// Dashboard stats

export type DashboardStats = {
  vehicles: {
    total: number;
    byStatus: Record<VehicleStatus, number>;
  };
  groups: {
    total: number;
    active: number;
  };
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const { supabase, companyId } = await getCompanyScope();

  const { data: vehicleRows, error: vehiclesError } = await supabase
    .from("vehicles")
    .select("status")
    .eq("company_id", companyId)
    .returns<{ status: VehicleStatus }[]>();
  if (vehiclesError) throw vehiclesError;

  const { data: groupRows, error: groupsError } = await supabase
    .from("publication_groups")
    .select("active")
    .eq("company_id", companyId)
    .returns<{ active: boolean }[]>();
  if (groupsError) throw groupsError;

  const byStatus: Record<VehicleStatus, number> = {
    draft: 0,
    ready: 0,
    published: 0,
    archived: 0,
  };
  for (const row of vehicleRows ?? []) {
    byStatus[row.status] += 1;
  }

  const groups = groupRows ?? [];

  return {
    vehicles: {
      total: vehicleRows?.length ?? 0,
      byStatus,
    },
    groups: {
      total: groups.length,
      active: groups.filter((group) => group.active).length,
    },
  };
}
