import type { ReactNode } from "react";
import { requireProfile } from "@/lib/auth/session";
import { DashboardShell } from "@/components/layout/dashboard-shell";

// Per-user and auth-gated: always rendered on request.
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { profile, company } = await requireProfile();

  return (
    <DashboardShell
      companyName={company.name}
      fullName={profile.full_name}
      email={profile.email}
      role={profile.role}
    >
      {children}
    </DashboardShell>
  );
}
