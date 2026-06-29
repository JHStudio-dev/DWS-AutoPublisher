import Link from "next/link";
import type { PublicationGroup } from "@/db/types/database";
import {
  GROUP_PLATFORM_LABELS,
  groupActiveLabel,
} from "@/lib/constants/publication-groups";
import { IconGroups } from "@/components/ui/icons";
import { StatusPill } from "@/components/ui/status-pill";

export function GroupCard({ group }: { group: PublicationGroup }) {
  return (
    <Link
      href={`/dashboard/publication-groups/${group.id}`}
      className="dws-group-card group block rounded-card border border-border bg-surface p-4 shadow-card transition-[transform,border-color] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:border-primary/40"
    >
      <div className="dws-group-card__header flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="dws-group-card__icon grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/12 text-primary">
            <IconGroups className="h-5 w-5" />
          </span>
          <h2 className="dws-group-card__name truncate font-medium text-text">
            {group.name}
          </h2>
        </div>
        <span className="shrink-0">
          <StatusPill tone={group.active ? "success" : "muted"}>
            {groupActiveLabel(group.active)}
          </StatusPill>
        </span>
      </div>

      <p className="dws-group-card__platform mt-3 text-sm text-text-muted">
        {GROUP_PLATFORM_LABELS[group.platform]}
      </p>

      <p className="dws-group-card__url mt-1 truncate text-xs text-text-muted/80">
        {group.url}
      </p>
    </Link>
  );
}
