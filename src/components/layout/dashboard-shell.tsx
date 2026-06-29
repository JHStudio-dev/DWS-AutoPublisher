"use client";

import { useState, type ReactNode } from "react";
import type { UserRole } from "@/db/types/database";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";

type DashboardShellProps = {
  companyName: string;
  fullName: string | null;
  email: string;
  role: UserRole;
  children: ReactNode;
};

export function DashboardShell({
  companyName,
  fullName,
  email,
  role,
  children,
}: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="dws-shell min-h-screen bg-background text-text md:grid md:grid-cols-[17rem_1fr]">
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() => setMobileOpen(false)}
          className="dws-shell__overlay fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        />
      ) : null}

      <DashboardSidebar
        companyName={companyName}
        fullName={fullName}
        email={email}
        role={role}
        open={mobileOpen}
        onNavigate={() => setMobileOpen(false)}
      />

      <div className="dws-shell__main flex min-h-screen flex-col">
        <DashboardTopbar onMenuClick={() => setMobileOpen(true)} />
        <main className="dws-shell__content flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
