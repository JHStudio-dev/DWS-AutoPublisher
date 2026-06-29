import type { ReactNode } from "react";

export type StatusTone =
  | "neutral"
  | "muted"
  | "primary"
  | "accent"
  | "success"
  | "warning"
  | "danger";

const TONE_CLASSES: Record<StatusTone, string> = {
  neutral: "border-border bg-surface-muted text-text",
  muted: "border-border bg-surface-muted text-text-muted",
  primary: "border-primary/40 bg-primary/10 text-primary",
  accent: "border-accent/40 bg-accent/10 text-accent",
  success: "border-success/40 bg-success/10 text-success",
  warning: "border-warning/40 bg-warning/10 text-warning",
  danger: "border-danger/40 bg-danger/10 text-danger",
};

export function StatusPill({
  tone = "muted",
  children,
}: {
  tone?: StatusTone;
  children: ReactNode;
}) {
  return (
    <span
      className={`dws-pill inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${TONE_CLASSES[tone]}`}
    >
      {children}
    </span>
  );
}
