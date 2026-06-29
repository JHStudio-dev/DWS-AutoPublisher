"use client";

import Link from "next/link";
import { IconMenu, IconPlus } from "@/components/ui/icons";

export function DashboardTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="dws-topbar sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-surface/80 px-4 py-3 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Abrir menú"
        className="dws-topbar__menu grid h-9 w-9 place-items-center rounded-md border border-border text-text-muted transition-colors hover:text-text md:hidden"
      >
        <IconMenu className="h-5 w-5" />
      </button>

      <div className="dws-topbar__brand text-sm font-semibold tracking-tight text-text md:hidden">
        <span className="text-primary">DWS</span> PublishFlow
      </div>

      <div className="dws-topbar__spacer flex-1" />

      <Link
        href="/dashboard/publications/new"
        className="dws-topbar__cta group inline-flex items-center gap-2 rounded-lg bg-primary py-2 pl-4 pr-2 text-sm font-medium text-text shadow-primary transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-primary-hover active:scale-[0.98]"
      >
        <span>Nueva publicación</span>
        <span className="dws-topbar__cta-icon grid h-6 w-6 place-items-center rounded-md bg-black/20 transition-transform duration-200 group-hover:translate-x-0.5">
          <IconPlus className="h-4 w-4" />
        </span>
      </Link>
    </header>
  );
}
