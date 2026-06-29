import type { ReactNode } from "react";

export function Panel({
  title,
  action,
  children,
  className = "",
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`dws-panel rounded-card border border-border bg-surface p-5 shadow-card ${className}`}
    >
      {title || action ? (
        <div className="dws-panel__header mb-4 flex items-center justify-between gap-3">
          {title ? (
            <h2 className="dws-panel__title text-sm font-semibold text-text">
              {title}
            </h2>
          ) : (
            <span />
          )}
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}
