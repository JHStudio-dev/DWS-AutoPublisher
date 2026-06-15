import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dws-auth flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="dws-auth__container w-full max-w-md">
        <div className="dws-auth__brand mb-6 flex items-center justify-center gap-2">
          <span className="dws-auth__brand-name text-xl font-semibold text-text">
            DWS PublishFlow
          </span>
          <span
            className="dws-auth__brand-accent inline-block h-2 w-2 rounded-full bg-accent"
            aria-hidden="true"
          />
        </div>
        <div className="dws-auth__card rounded-lg border border-border bg-surface p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
