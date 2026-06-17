import Link from "next/link";
import type { PublicationGroup } from "@/db/types/database";
import {
  GROUP_PLATFORM_LABELS,
  groupActiveLabel,
} from "@/lib/constants/publication-groups";

export function GroupCard({ group }: { group: PublicationGroup }) {
  return (
    <Link
      href={`/dashboard/publication-groups/${group.id}`}
      className="dws-group-card block rounded-lg border border-border bg-surface p-4 transition-colors hover:border-primary"
    >
      <div className="dws-group-card__header flex items-start justify-between gap-3">
        <h2 className="dws-group-card__name font-medium text-text">
          {group.name}
        </h2>
        <span
          className={`dws-group-card__status shrink-0 rounded-full border border-border bg-surface-muted px-2 py-0.5 text-xs ${
            group.active ? "text-text" : "text-text-muted"
          }`}
        >
          {groupActiveLabel(group.active)}
        </span>
      </div>

      <p className="dws-group-card__platform mt-1 text-sm text-text-muted">
        {GROUP_PLATFORM_LABELS[group.platform]}
      </p>

      <p className="dws-group-card__url mt-2 truncate text-xs text-text-muted">
        {group.url}
      </p>
    </Link>
  );
}
