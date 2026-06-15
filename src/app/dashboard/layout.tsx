import type { ReactNode } from "react";
import { requireProfile } from "@/lib/auth/session";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";

// The dashboard is per-user and auth-gated, so it is always rendered on request.
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { profile, company } = await requireProfile();

  return (
    <div className="dws-dashboard min-h-screen bg-background text-text md:grid md:grid-cols-[16rem_1fr]">
      <DashboardSidebar companyName={company.name} />
      <div className="dws-dashboard__main flex min-h-screen flex-col">
        <DashboardTopbar
          fullName={profile.full_name}
          email={profile.email}
          role={profile.role}
        />
        <main className="dws-dashboard__content flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
